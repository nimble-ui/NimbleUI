"use strict";
exports.__esModule = true;
var index_1 = require("../../../src/index");
var Clock = function (_a, update) {
    var fmt = _a.fmt;
    var clk = "" + new Date;
    return {
        template: index_1.e('h2', function () { return ({}); }, index_1._(function () { return fmt(clk); })),
        mounted: function () {
            console.log('Loaded');
            var c = setInterval(function () {
                clk = "" + new Date;
                update();
            });
            return function () { return clearInterval(c); };
        }
    };
};
var app = index_1.c(Clock, function () { return ({ fmt: function (clk) { return "The current time is " + clk; } }); });
window.addEventListener('load', function () {
    app(this.document.body);
});
