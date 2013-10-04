
module("Dollar Bill Unit Tests", {
    setup: function () {

        

    },
    teardown: function () {

    }
});



test("Verify We Have movieApp with expected members", function () {

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

    var selector = ".operation-body",
        $ob = $(selector);

    equal(typeof $ob, "object", "movieApp object should exist");
    equal($ob.length, 1, "movieApp.length should be 1");
    equal($ob.selector, selector, "movieApp.selector should be " + selector);
    equal($ob[0], document.querySelector(selector), "should be the target node");

});

test("Verify can a movieApp.trim can trim leading and trailing spaces", function () {

    var testString = " test ",
        expect = "test",
        $ob = $(),
        result = $ob.trim(testString);

    equal(result, expect, "trim should remove leading and trailing spaces");

});

test("Verify can a movieApp.trim can trim leading space", function () {

    var testString = " test",
        expect = "test",
        $ob = $(),
        result = $ob.trim(testString);

    equal(result, expect, "trim should remove leading space");

});


test("Verify can a movieApp.trim can trim trailing space", function () {

    var testString = "test ",
        expect = "test",
        $ob = $(),
        result = $ob.trim(testString);

    equal(result, expect, "trim should remove trailing space");

});

test("Verify can a movieApp.isArray can identify an array", function () {

    var testArray = [],
        expect = true,
        $ob = $(),
        result = $ob.isArray(testArray);

    equal(result, expect, "trim should be true");

});

test("Verify can a movieApp.isArray won't identify an object as an array", function () {

    var testArray = {},
        expect = false,
        $ob = $(),
        result = $ob.isArray(testArray);

    equal(result, expect, "trim should be false");

});


