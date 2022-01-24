

"use strict";

var whatyoulike= {};

module.exports.gameBaselib= whatyoulike;

// 所有要导出的类或变量在下面这里开始写

whatyoulike.gameBase= require("./GameBase.js");  // 注意这个 World 它就是外部声明的 World，名字对上就可以
