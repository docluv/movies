/// <reference path="movie.app.js" />

;

(function(window, tmpl, undefined) {

    "use strict";


var menuItems = {
                topMenu: [
                {
                title: "home",
                iconClass: "go-home",
                url: "#!"
            }
                ,{
                title: "map",
                iconClass: "go-map",
                url:  "#!maps"
            }
                ,{
                title: "showtimes",
                iconClass: "go-showtimes",
                url:  "#!showtimes"
            }
                ,{
                title: "search",
                iconClass: "go-search",
                url:  "#!search"
            }],
                subMenu: [
                    {
                        title: "news",
                        icon: undefined,
                        iconClass: "go-news",
                        url: "#!news"
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
                    }]
            };

    
    var movieApp = function(customSettings) {

        return new movieApp.fn.init(customSettings);
    };

    movieApp.fn = movieApp.prototype = {

        constructor: movieApp,

        init: function (customSettings) {

            var that = this;

            that.bp = backpack();

            that.data = rqData();

            that.compileTemplates();

            toolbar(".toolbar", {
                menuItems: menuItems
            });

            window.addEventListener("resize", function (e) {

                for (var key in that.resizeEvents) {
                    if (that.resizeEvents.hasOwnProperty(key)) {
                        that.resizeEvents[key].call(that);
                    }
                }

            });

            that.bindBackButton();

            return this;
        },

        version: "0.0.1",

        bp: undefined,

        mainTitle: document.querySelector(".view-title"),

        movieTypes: {
            "Opening": "Opening",
            "TopBoxOffice": "Top Box Office",
            "CommingSoon": "Comming Soon",
            "InTheaters": "In Theaters"
        },

        setMainTitle: function(title){

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
                this.templates[i] = tmpl.compile(t[i]);
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
                console.log("missing argument in mergeData");
                return;
            }

            var t = document.querySelector(targetSelector);

            //verify it is a single node.
            if (t.length && t.length > 0) {
                t = t[0];
            }

            if (this.templates[templateName]) {
                t.innerHTML = this.templates[templateName](data);
            }
            
        },

        data: undefined,

        resizeEvents: {},

        viewWidth: 0,

        setMoviePanelWidth: function (target, length) {

            target = target || ".movie-poster-div";
            length = length || 10;

            var grid = document.querySelector(target),
                width = window.innerWidth,
                bigWidth = 473,//added 3 because it seemed like IE needed that to make the width work correctly
                square = 203;

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
            settings = settings || {};

            var that = this,
                pCont = document.querySelector(target);

            that.panorama = panorama(pCont,
                    $.extend(settings, {
                        speed: 600,
                        headerHeight: 80,
                        contentResize: function () {

                            var posterWrappers = document.querySelectorAll(".panel-v-scroll"), i = 0;

                            for (; i < posterWrappers.length; i++) {
                                posterWrappers[i].style.height = 
                                    (window.innerHeight - 115 - 32) + "px";
                            }

                        }
                    }));

            //.moveNext()
            //.movePrevious();

            var dt = deeptissue(pCont,
                        {
                            swipeRightThreshold: 35,
                            swipeLeftThreshold: -35,
                            swipeUpThreshold: 35,
                            swipeDownThreshold: 35
                        });

            dt.swipeRight(function (evt, m, translate) {
                that.panorama.moveRight(evt);
            })

            .swipeLeft(function (evt, m, translate) {
                that.panorama.moveLeft(evt);
            });

            if (!that._panoramaSetup) {

                if (!that.hasTouch) {
                    //just falback to mouse stuff

                    that.setPanoramaWings();

                    var pn = document.querySelector(".pxs_next"),
                        pp = document.querySelector(".pxs_prev");

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

                }

                that._panoramaSetup = true;

            }

        },

        setPanoramaWings: function () {

            var wrapper = document.querySelector(".pxs_navigation");

            if (wrapper) {
                wrapper.style.display = "block";
            }

        },

        settings: {
            appTitle: "Mobile Movies",
            InTheatersHomeCount: 15,
            CommingSoonHomeCount: 15,
            SearchCount: 20
        }

    };

    // Give the init function the movieApp prototype for later instantiation
    movieApp.fn.init.prototype = movieApp.fn;

    return (window.movieApp = movieApp);

} (window, Mustache));



