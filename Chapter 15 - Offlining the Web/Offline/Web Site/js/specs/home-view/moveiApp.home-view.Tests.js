
module("Movie App Search View Unit Tests", {
    setup: function () {



    },
    teardown: function () {

    }
});



test("Verify We Have MovieApp with expected search members", function () {

    //basic sainty assertions to know members are present
    ok(movieApp, "movieApp object should exist");
    ok(movieApp.fn.init, "init function should exist");
    ok(movieApp.fn.version, "version should exist");
    equal(movieApp.fn.length, 0, "length should exist");
    ok(movieApp.fn.rclass, "rclass should exist");
    equal(movieApp.fn.selector, "", "selector should exist");
    ok(movieApp.fn.trim, "trim function should exist");
    ok(movieApp.fn.isArray, "isArray function should exist");
    ok(movieApp.fn.extend, "extend function should exist");
    ok(movieApp.fn.merge, "merge function should exist");
    ok(movieApp.fn.each, "each function should exist");
    ok(movieApp.fn.map, "map function should exist");
    ok(movieApp.fn.grep, "grep function should exist");
    ok(movieApp.fn.noop, "dblTap function should exist");
    ok(movieApp.fn.loadScript, "loadScript function should exist");
});

test("Verify can a new movieApp instance and the 1st element is the target element", function () {


});

test("Verify can a movieApp.trim can trim leading and trailing spaces", function () {


});

test("Verify can a movieApp.trim can trim leading space", function () {



});


test("Verify can a movieApp.trim can trim trailing space", function () {



});

test("Verify can a movieApp.isArray can identify an array", function () {



});

test("Verify can a movieApp.isArray won't identify an object as an array", function () {


});


