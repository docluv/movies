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

    var movieApp = function (config) {

        return new movieApp.fn.init(config);

    };

    movieApp.fn = movieApp.prototype = {

        constructor: movieApp,

        init: function (config) {

            var that = this;

            that.settings = $.extend({}, that.settings, config.settings);

            that.parseServices(config.services);

            if (!that.bp) {
                that.bp = backpack();
            }

            if (!that.dataProvider) {
                that.dataProvider = that.settings.dataProvider || movieData(
                    RottenTomatoes({ data: rqData() }),
                    fakeTheaters()
                );
            }


            if (!config.viewEngine) {
                throw {
                    "Name": "SPA Exception",
                    "Description": "You must designate a viewEngine"
                };
            }

            that.viewEngine = config.viewEngine;
            
            that.viewEngine.compileViews();

            toolbar(".toolbar", {
                menuItems: menuItems
            });

            that.setupHamburger();

            that.bindBackButton();

            return that;
        },


        viewEngine: undefined,

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






