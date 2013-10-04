
module("Movie App Search View Unit Tests", {
    setup: function () {



    },
    teardown: function () {

    }
});



test("Verify We Have MovieApp with expected search members", function () {

    //basic sainty assertions to know members are present
    ok(movieApp.fn.loadMovieView, "movieApp loadMovieView function should exist");
    ok(movieApp.fn.renderMovieDetails, "movieApp renderMovieDetails function should exist");
    ok(movieApp.fn.bindPanelTitles, "movieApp bindPanelTitles function should exist");
    ok(movieApp.fn.unloadMovieView, "movieApp unloadMovieView function should exist");
    ok(movieApp.fn.manageMovieView, "movieApp manageMovieView function should exist");
    ok(movieApp.fn.clearInlineRelativePostition, "movieApp clearInlineRelativePostition function should exist");


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


