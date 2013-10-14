
module("MovieApp Core module Unit Tests", {
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
    equal(movieApp.fn.bp, undefined, "bp should exist");
    equal(movieApp.fn.data, undefined, "data should exist");
    equal(movieApp.fn.tmpl, undefined, "tmpl should exist");
    ok(movieApp.fn.mainTitle, "mainTitle should exist");
    ok(movieApp.fn.hideBurgerMenu, "hideBurgerMenu function should exist");
    ok(movieApp.fn.movieTypes, "movieTypes function should exist");
    ok(movieApp.fn.setMainTitle, "setMainTitle function should exist");
    ok(movieApp.fn.bindBackButton, "bindBackButton function should exist");
    ok(movieApp.fn.templates, "templates should exist");
    ok(movieApp.fn.compileTemplates, "compileTemplates function should exist");
    ok(movieApp.fn.showLoading, "showLoading function should exist");
    ok(movieApp.fn.mergeData, "mergeData function should exist");
    ok(movieApp.fn.resizeEvents, "resizeEvents should exist");
    ok(movieApp.fn.viewWidth, "viewWidth should exist");
    ok(movieApp.fn.setMoviePanelWidth, "setMoviePanelWidth function should exist");
    equal(movieApp.fn.panorama, undefined, "panorama should exist");
    ok(movieApp.fn.hasTouch, "hasTouch function should exist");
    ok(movieApp.fn.setupPanorama, "setupPanorama function should exist");
    ok(movieApp.fn.setPanoramaWings, "setPanoramaWings function should exist");
    ok(movieApp.fn.settings, "settings should exist");

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
