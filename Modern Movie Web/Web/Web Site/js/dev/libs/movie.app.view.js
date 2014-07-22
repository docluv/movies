/// <reference path="../../libs/view.js" />

;

(function (window, undefined) {

    "use strict";

    var movieAppView = View.extend({

        init: function () {
            this._super.apply(this, arguments);
        },

        noResults: "<div class='no-results'>Sorry There are No Results Available</div>",

        mainTitle: document.querySelector(".view-title"),

        movieTypes: {
            "Opening": "Opening",
            "TopBoxOffice": "Top Box Office",
            "ComingSoon": "Comming Soon",
            "InTheaters": "In Theaters"
        },

        bindBackButton: function () {

            deeptissue(document.querySelector(".win-backbutton"))
                .tap(function () {

                    window.history.back(1);

                });

        },

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

    });


    return (window.movieAppView = movieAppView);

}(window));