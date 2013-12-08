/// <reference path="love2dev.app.js" />
/// <reference path="love2dev.app.api.js" />


(function (window, undefined) {

    "use strict";

    movieApp.fn.unloadHomeView = function () {
        delete this.resizeEvents["manageHomeView"];
        this.panorama = undefined;
    };

    movieApp.fn.renderHomeMovies = function (target, data) {

        if (!data) {
            return;
        }

        this.mergeData(target, "MoviePosterGridTemplate", data);
        this.setPosterSrc();

    };

    movieApp.fn.loadHomeView = function () {

        var that = this,
            i = 0,
            vPanels = document.querySelectorAll(".panel-v-scroll");

        that.setupPanorama();
        that.setMainTitle("Modern Web Movies");

        that.InTheatersMovies(50, 1, function (data) {
            that.renderHomeMovies.call(that, ".top-box-list", data);
        });

        that.OpeningMovies(50, 1, function (data) {
            that.renderHomeMovies.call(that, ".opening-movie-list", data);
        });

        that.TopBoxOfficeMovies(50, 1, function (data) {
            that.renderHomeMovies.call(that, ".movies-near-me-list", data);
        });

        that.CommingSoonMovies(50, 1, function (data) {
            that.renderHomeMovies.call(that, ".comming-soon-list", data);
        });

        that.setPanoramaWidth();

        that.setupMQL("min600", "(min-width: 600px)", [{
            matchName: "manageHomeView",
            matchFunc: function () {
                that.setPanoramaWidth.call(that);
                that.setPosterSrc.call(that);
            },
            nomatchName: "manageHomeView",
            nomatchFunc: function () {
                that.setPanoramaWidth.call(that);
                that.setPosterSrc.call(that);
            }
        }]);

        that.setupMQL("min1024", "(min-width: 1024px)", [{
            matchName: "manageHomeView1024",
            matchFunc: function () {
                that.setPanoramaWidth.call(that);
                that.setPosterSrc.call(that);
            },
            nomatchName: "manageHomeView1024",
            nomatchFunc: function () {
                that.setPanoramaWidth.call(that);
                that.setPosterSrc.call(that);
            }
        }]);

    };

    movieApp.fn.viewWidth = window.innerWidth;

    movieApp.fn.setPanoramaWidth = function () {

        var that = this,
            i = 0,
            peekWidth = (that.viewWidth > 600) ? 50 : 30,
            panelWidth = (that.viewWidth - peekWidth),
            panoramaWrapper = document.querySelector(".panorama-panels"),
            panels = document.querySelectorAll(".single-panel"),
            movieGrids = document.querySelectorAll(".movie-poster-grid"),
            gridHeight = getGridHeight(parseInt(panoramaWrapper.style.height, 10));

        for (; i < panels.length; i++) {
            panels[i].style.width = panelWidth + "px";
        }

        if (panoramaWrapper) {
            panoramaWrapper.style.width = (panels.length * panelWidth) + "px";
        }

        that.panorama.resizePanorama();

    };


    function getGridHeight(baseHeight) {

        var wWidth = window.innerWidth;

        if (wWidth <= 600) {
            return baseHeight - 32;
        } else if (wWidth > 600 && wWidth <= 1024) {
            return Math.floor(baseHeight / 200) * 200;
        } else if (wWidth > 1024) {
            return (Math.floor(baseHeight / 200) * 200) + 20;
        }


    };

}(window));
