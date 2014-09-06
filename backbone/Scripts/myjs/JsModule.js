var module1 = function () {
    var _count = 0;
    var m1 = function () {
        console.log("function m1....");
    }
    var m2 = function () {
        console.log("function m2...");
    }

    return {
        m1: m1,
        m2: m2
    };
}();

var mod = new module1();
console.log(mod._count);

mod.m1();
mod.m2();