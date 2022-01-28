function Socket(host) {
    this.cbQueue = {};
    //this.msgQueue = new Array();
    this.host = host;

    if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
        let cert = cc.urlraw('cert/cert.pem');
        if (cc.loader.md5Pipe) {
            cert = cc.loader.md5Pipe.transformURL(cert);
        }
        this.ws = new WebSocket(host, null, cert);
    } else {
        this.ws = new WebSocket(host);
    }

    this.ws.binaryType = 'arraybuffer';
    this.ws.onmessage = this.message.bind(this);
    this.ws.onopen = this.connected.bind(this);
    this.ws.onclose = this.close.bind(this);
    this.ws.onerror = this.error.bind(this);
    this.notification = new cc.EventTarget();
    this.timeoutObj = null;
    this.serverTimeoutObj = null;
    this.disConnectObj = null;
    this.waitObj = null;
    this.waitObjTimeoutObj = null;
    this.isNeedReconnect = true;
    this.enableHeart = false;
    //add by panbin
    this.needRelogin = false;
    this.lossHeaderCount = 0;
}

Socket.prototype = {
    connected() {
        cc.log('socket connected');
        this.isNeedReconnect = true;
        if (this.disConnectObj != null) {
            this.resetWait();
            clearInterval(this.disConnectObj);
            this.disConnectObj = null;
            cc.g.userMgr.relogin();
        } else if (this.needRelogin) {
            cc.g.userMgr.relogin();
            this.needRelogin = false;
        }
        //this.beginHeart();
        this.notification.emit('connected');
    },

    message(event) {
        let clientResp = PB.ClientResp.decode(event.data);
        let respData = pbHelper.newResp(clientResp.api, clientResp.data);
        let callback = this.cbQueue[clientResp.api];
        
        if (callback != null) {
            this.resetWait();
            delete this.cbQueue[clientResp.api];
        } else if (clientResp.api == PB.PROTO.COMMON && this.cbQueue[respData.api] != null) {
            callback = this.cbQueue[respData.api];
            this.resetWait();
            delete this.cbQueue[respData.api];
        }

        if (clientResp.api != PB.PROTO.HEART) {//不打印心跳协议回复
            cc.log("receive message[" + clientResp.api +' - '+ PHI.desc(clientResp.api) + "]: ", respData);
            //cc.g.log("receive message[" + clientResp.api +' - '+ PHI.desc(clientResp.api) + "]: ", respData);
        } else {
            //清除心跳超时检查
            if(this.serverTimeoutObj != null) {
                this.lossHeaderCount = 0
                clearTimeout(this.serverTimeoutObj);
                this.serverTimeoutObj = null
            }
        }

        try {
            if (callback) {
                callback(respData);
            }
            this.notification.emit(clientResp.api.toString(), respData);
        } catch (e) {

        }
    },

    /*message(event) {
        let clientResp = PB.ClientResp.decode(event.data);
        this.msgQueue.push(clientResp);
        this.resetHeart();
    },

    update(dt) {
        while(this.msgQueue.length > 0) {
            let clientResp = this.msgQueue.shift();
            let respData = pbHelper.newResp(clientResp.api, clientResp.data);
            let callback = this.cbQueue[clientResp.api];
            if(callback != null ) {
                this.resetWait();
                delete this.cbQueue[clientResp.api];
            }
            else if(clientResp.api == PB.PROTO.COMMON && this.cbQueue[respData.api] != null) {
                callback = this.cbQueue[respData.api];
                this.resetWait();
                delete this.cbQueue[respData.api];
            }
            if(clientResp.api != PB.PROTO.HEART){//不打印心跳协议回复
                cc.log("receive message[" + clientResp.api + "]: ", respData);
            }
            try{
                if (callback) {
                    callback(respData);
                }
                this.notification.emit(clientResp.api.toString(), respData);
            }catch(e) {

            }
        }
    },*/

    checkConnected() {
        return this.ws.readyState == WebSocket.OPEN;
    },

    reconnect() {
        if(this.ws != null && this.ws.readyState === WebSocket.CONNECTING) {
            return;
        }
        this.cbQueue = {};

        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
            let cert = cc.urlraw('cert/cert.pem');
            if (cc.loader.md5Pipe) {
                cert = cc.loader.md5Pipe.transformURL(cert);
            }
            this.ws = new WebSocket(this.host, null, cert);
        } else {
            this.ws = new WebSocket(this.host);
        }

        this.ws.binaryType = 'arraybuffer';
        this.ws.onmessage = this.message.bind(this);
        this.ws.onopen = this.connected.bind(this);
        this.ws.onclose = this.close.bind(this);
        this.ws.onerror = this.error.bind(this);
    },

    disConnect() {
        if (!this.isNeedReconnect || this.disConnectObj != null) {
            return;
        }
        this.showWait();
        this.endHeart();
        this.reconnect();
        let self = this;
        this.disConnectObj = setInterval(function () {
            self.reconnect();
        }, 5000);
    },

    reConnectTwo() {
        if (this.disConnectObj != null) {
            clearInterval(this.disConnectObj);
            this.disConnectObj = null;
        }

        this.reconnect();
        let self = this;
        this.disConnectObj = setInterval(function () {
            self.reconnect();
        }, 5000);
    },

    close() {
        cc.log("socket close");
        this.disConnect();
        // this.notification.emit('close');
    },

    error(e) {
        cc.log("socket error", e);
        this.disConnect();
    },

    on(api, cb) {
        this.notification.off(api.toString());
        this.notification.on(api.toString(), (event) => {
            if (cb) {
                cb(event.detail || event);
            }
        })
    },

    once(api, cb) {
        this.notification.once(api.toString(), (event) => {
            if (cb) {
                cb()
                // cb(event.detail);
            }
        })
    },

    send(api, proto, callback) {
        if(this.ws == null || this.ws.readyState !== WebSocket.OPEN) {
            cc.log('ws is not ready yet!');
            return;
        }

        if (api != PB.PROTO.HEART) {//不打印心跳协议请求
            cc.log("send msg[" + api +' - '+ PHI.desc(api) + "]: ", proto);
            //cc.g.log("send msg[" + api +' - '+ PHI.desc(api) + "]: ", proto);
        } else {
            //cc.log('send HEART');
        }

        let clientReq = new PB.ClientReq();
        clientReq.api = api;
        clientReq.seq = this.sequence;
        clientReq.data = proto.toArrayBuffer();
        this.ws.send(clientReq.toArrayBuffer());
        if (callback != null) {
            this.cbQueue[api] = callback;
            this.showWait();
        }
        this.beginHeart();
    },

    closeSocket(reconnect) {
        if(this.ws == null) {
            return;
        }

        this.isNeedReconnect = reconnect;

        this.ws.close();
        this.ws = null;
        this.cbQueue = {};
        this.endHeart();
        if(!reconnect) {
            if (this.disConnectObj != null) {
                this.resetWait();
                clearInterval(this.disConnectObj);
                this.disConnectObj = null;
            }
            instance = null;
        }
    },

    closeSocketTwo(iscls) {
        if(this.ws == null) {
            return;
        }
        this.isNeedReconnect = false;
        this.ws.close();
        this.ws = null;
        this.cbQueue = {};
        this.endHeart();
        this.needRelogin = true

        if (iscls) {
            instance = null;
        }
    },

    showWait() {
        if(this.waitObj != null) {
            this.resetWait();
        }
        let self = this;
        this.waitObj = setTimeout(function () {
            cc.g.global.showWaiting();
            //如果服务器一直没有返回，并且没有断网，7s后停止等待(防止服务器发生错误引发客户端不能操作)
            if(self.enableHeart) {//判断是否登录成功
                self.waitObjTimeoutObj = setTimeout(function () {
                    if(self.disConnectObj == null) {//如果没失去连接，重置等待
                        self.resetWait();
                    }
                }, 7000);
            }

        }, 500);
    },

    resetWait() {
        if (this.waitObj != null) {
            cc.g.global.destoryWaiting();
            if(this.waitObjTimeoutObj != null) {
                clearTimeout(this.waitObjTimeoutObj);
                this.waitObjTimeoutObj = null;
            }
            clearTimeout(this.waitObj);
            this.waitObj = null;
        }
    },

    beginHeart() {
        if(!this.enableHeart) {
            return;
        }
        if(this.timeoutObj != null) {
            clearTimeout(this.timeoutObj);
        }
        let self = this;
        this.timeoutObj = setTimeout(function () {
            let heartReq = pbHelper.newReq(PB.PROTO.HEART);
            self.send(PB.PROTO.HEART, heartReq);
            if(self.serverTimeoutObj == null) {
                self.serverTimeoutObj = setTimeout(function () {
                    self.lossHeaderCount += 1
                    cc.dlog('self.lossHeaderCount-->' + self.lossHeaderCount)
                    if (self.lossHeaderCount > 5) {
                        self.lossHeaderCount = 0
                        self.closeSocket(true);
                    }
                }, 2000);
            }

        }, 5000);
    },

    setHeartEnable() {
        this.enableHeart = true;
        this.beginHeart();
    },

    endHeart() {
        this.enableHeart = false;
        if(this.timeoutObj != null) {
            clearTimeout(this.timeoutObj);
        }
        if(this.serverTimeoutObj != null) {
            this.lossHeaderCount = 0
            clearTimeout(this.serverTimeoutObj);
            this.serverTimeoutObj = null
        }
    },
}

var instance = null;

module.exports = function (host) {
    if (!instance) {
        instance = new Socket(host);
    }
    return instance;
}
