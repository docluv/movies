
module("MovieApp Core module Unit Tests", {
    setup: function () {
        console.info("starting test");
    },
    teardown: function () {
        console.info("finished test");
    }
});



test("Verify We Have movieApp with expected members", function () {

    //basic sainty assertions to know members are present
    isFunction(movieApp, "movieApp object should exist");
    isFunction(movieApp.fn.init, "init function should exist");
    ok(movieApp.fn.version, "version should exist");
    equal(movieApp.fn.bp, undefined, "bp should exist");
    equal(movieApp.fn.data, undefined, "data should exist");
    equal(movieApp.fn.tmpl, undefined, "tmpl should exist");
    ok(movieApp.fn.mainTitle, "mainTitle should exist");
    isFunction(movieApp.fn.hideBurgerMenu, "hideBurgerMenu function should exist");
    ok(movieApp.fn.movieTypes, "movieTypes function should exist");
    isFunction(movieApp.fn.setMainTitle, "setMainTitle function should exist");
    isFunction(movieApp.fn.bindBackButton, "bindBackButton function should exist");
    ok(movieApp.fn.templates, "templates should exist");
    isFunction(movieApp.fn.compileTemplates, "compileTemplates function should exist");
    isFunction(movieApp.fn.showLoading, "showLoading function should exist");
    isFunction(movieApp.fn.mergeData, "mergeData function should exist");
    ok(movieApp.fn.resizeEvents, "resizeEvents should exist");
    isFunction(movieApp.fn.setMoviePanelWidth, "setMoviePanelWidth function should exist");
    equal(movieApp.fn.panorama, undefined, "panorama should exist");
    ok(movieApp.fn.hasTouch, "hasTouch function should exist");
    isFunction(movieApp.fn.setupPanorama, "setupPanorama function should exist");
    isFunction(movieApp.fn.setPanoramaWings, "setPanoramaWings function should exist");
    ok(movieApp.fn.settings, "settings should exist");

});


test("Verify movieApp() creates a new object", function () {

    var movie = movieApp();

    isObject(movie, "mainTitle should equal test DIV");

});


test("Verify can a new mainTitle points to the desired element", function () {

    var selector = ".view-title",
        expect = document.querySelector(selector),
        movie = movieApp();

    equal(movie.mainTitle, expect, "mainTitle should equal test DIV");

});


test("Verify can a new hide burger menu sets dosplay to none if window width between 610 & 720", function () {

    var selector = ".main-nav",
        mainNav = document.querySelector(selector),
        width = window.innerWidth,
        expect = (width > 601 && width < 720) ? "none" : "block",
        movie = movieApp();

    movie.hideBurgerMenu();

    equal(mainNav.style.display, expect, "should equal " + expect);

});
