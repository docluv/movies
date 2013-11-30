/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

;

(function (window, undefined) {

    "use strict";

    var menuItems = {
        topMenu: [
        {
            title: "home",
            iconClass: "home-icon",
            url: "#!"
        },
        {
            title: "map",
            iconClass: "maps-icon",
            url: "#!maps"
        }
        , {
            title: "showtimes",
            iconClass: "theaters-icon",
            url: "#!showtimes"
        }
        , {
            title: "search",
            iconClass: "search-icon",
            url: "#!search"
        }],
        subMenu: [
            {
                title: "reviews",
                icon: undefined,
                iconClass: "go-reviews",
                url: "#!reviews"
            }

             , {
                 title: "opening this week",
                 icon: undefined,
                 iconClass: "go-opening",
                 url: "#!movies/Opening"
             }
             , {
                 title: "in theaters",
                 icon: undefined,
                 iconClass: "go-in-theaters",
                 url: "#!movies/InTheaters"
             }
             , {
                 title: "top box office",
                 icon: undefined,
                 iconClass: "go-top-box-office",
                 url: "#!movies/TopBoxOffice"
             }
            , {
                title: "comming soon",
                icon: undefined,
                iconClass: "go-movie-soon",
                url: "#!movies/CommingSoon"
            }
            , {
                title: "account",
                icon: undefined,
                iconClass: "go-account",
                url: "#!account"
            }, {
                title: "about",
                icon: undefined,
                iconClass: "go-about",
                url: "#!about"
            }]
    };

    var movieApp = function (customSettings) {

        return new movieApp.fn.init(customSettings);

    };

    movieApp.fn = movieApp.prototype = {

        constructor: movieApp,

        init: function (customSettings) {

            var that = this;

            that.settings = $.extend({}, that.settings, customSettings);

            that.bp = that.settings.bp || backpack();
            that.data = that.settings.data || rqData();
            that.tmpl = that.settings.tmpl || Mustache;

            that.compileTemplates();

            toolbar(".toolbar", {
                menuItems: menuItems
            });

            deeptissue(".hamburger-nav").tap(function () {

                $.toggle(document.querySelector(".main-nav"));
                //                document.querySelector(".main-nav").style.display = "block";

            });

            deeptissue(".main-nav > a").tap(function () {

                that.hideBurgerMenu();

            });

            window.addEventListener("resize", function (e) {

                requestAnimationFrame(function () {
                    for (var key in that.resizeEvents) {
                        if (that.resizeEvents.hasOwnProperty(key)) {
                            that.resizeEvents[key].call(that);
                        }
                    }
                });

            });

            that.bindBackButton();


            return that;
        },

        version: "0.0.1",

        bp: undefined,
        data: undefined,
        tmpl: undefined,

        mainTitle: document.querySelector(".view-title"),

        hideBurgerMenu: function () {

            var width = window.innerWidth;

            if (width > 601 && width < 720) {
                document.querySelector(".main-nav").style.display = "none";
            }

        },

        movieTypes: {
            "Opening": "Opening",
            "TopBoxOffice": "Top Box Office",
            "CommingSoon": "Comming Soon",
            "InTheaters": "In Theaters"
        },

        setMainTitle: function (title) {

            //            var mainTitle = document.querySelector(".view-title");

            this.mainTitle.textContent = title;
        },

        bindBackButton: function () {

            deeptissue(document.querySelector(".win-backbutton"))
                .tap(function () {

                    window.history.back(1);

                });

        },

        templates: {},
        compileTemplates: function () {

            var that = this,
                i,
                t = that.bp.getTemplates(true);

            for (i in t) {
                this.templates[i] = that.tmpl.compile(t[i]);
            }

        },

        showLoading: function (targetSelector) {

            if (typeof targetSelector !== "string") {
                return;
            }

            document.querySelector(targetSelector)
                    .innerHTML = "<img class='ajax-loading' src='http://images.professionalaspnet.com/ajax-loader.gif'/>";
        },

        mergeData: function (targetSelector, templateName, data) {

            if ((typeof targetSelector !== "string") ||
               (typeof templateName !== "string") ||
                (data === undefined || data === null)) {
                console.error("missing argument in mergeData");
                return;
            }

            var that = this,
                t = document.querySelector(targetSelector);

            //verify it is a single node.
            if (t.length && t.length > 0) {
                t = t[0];
            }

            if (that.templates[templateName]) {
                requestAnimationFrame(function () {
                    t.innerHTML = that.templates[templateName](data);
                });
                //t.innerHTML = that.templates[templateName](data);
            }

        },

        resizeEvents: {},

        viewWidth: 0,

        setMoviePanelWidth: function (target, length) {

            target = target || ".movie-poster-div";
            length = length || 10;

            var grid = document.querySelector(target),
                width = window.innerWidth,
                bigWidth = 473,//added 3 because it seemed like IE needed that to make the width work correctly
                square = 205;

            if (!grid) {
                return;
            }

            if (width > 1024) {

                width = (bigWidth + Math.floor(length / 2) * square);

                grid.style.width = width + "px";

            } else if (width > 600) {

                width = Math.ceil(length / 2) * square;

                grid.style.width = width + "px";

            }

        },

        panorama: undefined,
        _panoramaSetup: false,
        hasTouch: (window.navigator.msPointerEnabled || "ontouchstart" in window),

        setupPanorama: function (target, settings) {

            target = target || ".panorama-container";
            settings = $.extend({
                maxHeight: Number.MAX_VALUE,
                maxWidth: Number.MAX_VALUE
            }, settings);

            var that = this, dt,
                pCont = document.querySelector(target);

            if (settings.maxWidth &&
                settings.maxWidth >= window.innerWidth) {

                that.panorama = panorama(pCont,
                                    $.extend(settings, {
                                        speed: 600,
                                        headerHeight: 80,
                                        peekWidth: 50,
                                        contentResize: function () {

                                            var posterWrappers = document.querySelectorAll(".panel-v-scroll"), i = 0;

                                            for (; i < posterWrappers.length; i++) {
                                                posterWrappers[i].style.height =
                                                    (window.innerHeight - 115 - 32) + "px";
                                            }

                                        }
                                    }));

                //that.panoramaDt = 
                /**/
                dt = deeptissue(pCont,
                            {
                                swipeRightThreshold: 35,
                                swipeLeftThreshold: -35,
                                swipeUpThreshold: 35,
                                swipeDownThreshold: 35
                            });

                dt.swipeRight(function (evt, m, translate) {

                    if (settings.maxWidth >= window.innerWidth) {
                        that.panorama.moveRight(evt);
                    }

                })

                .swipeLeft(function (evt, m, translate) {

                    if (settings.maxWidth >= window.innerWidth) {
                        that.panorama.moveLeft(evt);
                    }

                });
                /**/
                //pCont.addEventListener("MSManipulationStateChanged", function (e) {
                //    console.log(e.currentState);
                //});

            }

            if (!that._panoramaSetup) {

                var pn = document.querySelector(".pxs_next"),
                    pp = document.querySelector(".pxs_prev");

                if (!that.hasTouch) {
                    //just falback to mouse stuff

                    that.setPanoramaWings();

                    if (pn) {
                        pn.addEventListener("click", function (e) {
                            that.panorama.moveLeft(e);
                        });
                    }

                    if (pp) {
                        pp.addEventListener("click", function (e) {
                            that.panorama.moveRight(e);
                        });

                    }

                } else {
                    //remove the wings, don't need them
                }

                that._panoramaSetup = true;

            }

        },

        panoramaDt: undefined,

        setPanoramaWings: function () {

            var wrapper = document.querySelector(".pxs_navigation");

            if (wrapper) {
                wrapper.style.display = "block";
            }

        },

        settings: {
            appTitle: "Modern Web Movies",
            InTheatersHomeCount: 15,
            CommingSoonHomeCount: 15,
            SearchCount: 20,
            smallBreakPoint: 610,
            desktopBreakPoint: 1080,
            largeBreakPoint: 3000 //arbitrary number for giant TV/Kiosks
        }

    };

    // Give the init function the movieApp prototype for later instantiation
    movieApp.fn.init.prototype = movieApp.fn;

    return (window.movieApp = movieApp);

}(window));



