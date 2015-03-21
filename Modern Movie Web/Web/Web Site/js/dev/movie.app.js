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
                title: "search",
                iconClass: "search-icon",
                url: "#!search"
            }, {
                title: "about",
                iconClass: "about-icon",
                url: "#!about"
            }
            //,
            //{
            //    title: "reviews",
            //    iconClass: "reviews-icon",
            //    url: "#!reviews"
            //}

        ],
        subMenu: [
             {
                 title: "opening this week",
                 url: "#!movies/Opening"
             }
             , {
                 title: "in theaters",
                 url: "#!movies/InTheaters"
             }
             , {
                 title: "top box office",
                 url: "#!movies/TopBoxOffice"
             }
            , {
                title: "comming soon",
                url: "#!movies/ComingSoon"
            }
            ,
            {
                title: "privacy",
                url: "#!privacy"
            }
        ]
    };

    var movieApp = function (customSettings) {

        return new movieApp.fn.init(customSettings);

    };

    movieApp.fn = movieApp.prototype = {

        constructor: movieApp,

        init: function (config) {

            var that = this;

            that.parseServices(config.services);

            if (!that.viewEngine) {
                throw {
                    "name": "SPA Exception",
                    "message": "You must designate a viewEngine"
                };
            }

            toolbar(".toolbar", {
                menuItems: menuItems
            });

            that.setupHamburger();

            that.bindBackButton();

            window.addEventListener("resize", function (e) {

                requestAnimationFrame(function () {
                    for (var key in that.resizeEvents) {
                        if (that.resizeEvents.hasOwnProperty(key)) {
                            that.resizeEvents[key].call(that);
                        }
                    }
                });

            });

            return that;
        },

        setupHamburger: function () {

            deeptissue(".hamburger-nav").tap(function () {
                requestAnimationFrame(function () {
                    $(".main-nav").show();
                });
            });

            deeptissue(".main-nav > a").tap(function (e) {

                e.stopPropagation();
                e.preventDefault();

                var target = e.currentTarget,
                    select = "seleted-nav";

                target.classList.add(select);

                requestAnimationFrame(function () {

                    if (target.href) {
                        window.location.href = target.href;
                    }

                    target.classList.remove(select);
                    document.querySelector(".main-nav").style.display = "none";
                });

            });

            deeptissue(document.body).tap(function () {
                $(".main-nav").hide();
            });

        },

        version: "0.5.0",

        //get this out of here and into a markup source
        noResults: "<div class='no-results'>Sorry There are No Results Available</div>",

        mainTitle: document.querySelector(".view-title"),

        movieTypes: {
            "Opening": "Opening",
            "TopBoxOffice": "Top Box Office",
            "ComingSoon": "Comming Soon",
            "InTheaters": "In Theaters"
        },

        setMainTitle: function (title) {

            this.mainTitle.textContent = document.title = title.toLowerCase();

        },

        parseServices: function (services) {

            for (var service in services) {

                if (typeof services[service] === "function") {
                    this[service] = new services[service]();
                } else {
                    this[service] = services[service];
                }

            }

        },


        bindBackButton: function () {

            deeptissue(document.querySelector(".win-backbutton"))
                .tap(function () {

                    window.history.back(1);

                });

        },

        showLoading: function (targetSelector) {

            if (typeof targetSelector !== "string") {
                return;
            }

            document.querySelector(targetSelector)
                    .innerHTML = "<img class='ajax-loading' src='http://images.professionalaspnet.com/ajax-loader.gif'/>";
        },

        resizeEvents: {},

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

            that.panorama = panorama(pCont,
                                $.extend(settings, {
                                    speed: 600,
                                    headerHeight: 80,
                                    peekWidth: 50
                                }));

            dt = deeptissue(pCont,
                        {
                            swipeRightThreshold: 50,
                            swipeLeftThreshold: -50,
                            swipeUpThreshold: 50,
                            swipeDownThreshold: 50
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

        },

        setPanoramaWings: function () {

            var wrapper = document.querySelector(".pxs_navigation");

            if (wrapper) {
                wrapper.style.display = "block";
            }

        },

        setPosterSrc : function (posterSelector) {

            var i = 0,
                moviePoster,
                moviePosters = document.querySelectorAll(posterSelector || ".movie-grid-poster"),
                curWidth = window.innerWidth,
                detBreakPoint = 600,
                oriBreakPoint = 1024;

            for (i = 0; i < moviePosters.length; i++) {

                moviePoster = moviePosters[i];

                if (i === 0 && curWidth >= oriBreakPoint) {

                    moviePoster.src = moviePoster.src
                                        .replace("tmb", "ori")
                                        .replace("pro", "ori")
                                        .replace("det", "ori");

                } else if (curWidth >= detBreakPoint) {

                    moviePoster.src = moviePoster.src
                                        .replace("tmb", "det")
                                        .replace("pro", "det")
                                        .replace("ori", "det");

                } else {
                    moviePoster.src = moviePoster.src
                                                    .replace("tmb", "pro")
                                                    .replace("ori", "pro")
                                                    .replace("det", "pro");
                }

            }

        },

        settings: {
            desktopBreakPoint: 1024,
            smallBreakPoint: 600,
            SearchCount: 50
        }

    };

    // Give the init function the movieApp prototype for later instantiation
    movieApp.fn.init.prototype = movieApp.fn;

    return (window.movieApp = movieApp);

}(window));






