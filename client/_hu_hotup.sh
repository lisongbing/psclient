#!/bin/bash
if "$hotup_pause" = "";then
    export hotup_pause=true
fi

python _hu_up_version.py false macandroid

source ./version_android.sh

#rem 设置热更新地址
#rem relase http://hot.newenerg.cn/android/
#rem debug https://recharge.xmhdgame.com/android/

export HOT_UPDATE_URL=https://niuhot.csqjyc008.xyz/

#rem 生成热更新文件包
node ./_hu_version_generator.js -v $VERSION -u $HOT_UPDATE_URL

if "$hotup_pause" = "true";then
    echo "finish"
fi
