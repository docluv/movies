/// <reference path="love2dev.app.js" />
/// <reference path="love2dev.app.api.js" />


(function (window, undefined) {

    "use strict";

    movieApp.fn.homeView = gridView.extend({

        init: function (rootScope) {
            this._super(rootScope);
        },

        onload: function () {

            var that = this;

            that.isVisible = true;

            that.setupPanorama();
            that.setMainTitle("Modern Web Movies");

            that.loadMovies();

            requestAnimationFrame(function () {
                that.panorama.resizePanorama();
            });

            that.setupMQLs();

        },

        mql600: undefined,
        mql1024: undefined,
        isVisible: false,

        setupMQLs: function () {

            var that = this;

            if (!that.mql600) {

                that.mql600 = window.matchMedia("(min-width: 600px)");

                that.mql600.addListener(function (e) {

                    that.updateMoviePosters(e);

                });

            }

            if (!that.mql1024) {

                that.mql1024 = window.matchMedia("(min-width: 1024px)");

                that.mql1024.addListener(function (e) {

                    that.updateMoviePosters(e);

                });

            }

        },

        loadMovies: function () {

            var that = this,
                md = that.rootScope.dataProvider,
                 //originally had 50. This is too many because it caused up to 100 movie poster
                 //image downloads when the application is launched. 10 should be enough for the 
                 //home effect. Also changed to a variable to get minification benefit and easier
                 //maintenance.
                count = 10;

            md.InTheatersMovies(count, 1, function (data) {
                that.renderHomeMovies(".top-box-list", data);
            });

            md.OpeningMovies(count, 1, function (data) {
                that.renderHomeMovies(".opening-movie-list", data);
            });

            md.TopBoxOfficeMovies(count, 1, function (data) {
                that.renderHomeMovies(".movies-near-me-list", data);
            });

            md.ComingSoonMovies(count, 1, function (data) {
                that.renderHomeMovies(".coming-soon-list", data);
            });

        },

        updateMoviePosters: function (e) {

            if (this.isVisible) {

                var that = this;

                that.setPosterSrc(".opening-movie-list .movie-grid-poster");
                that.setPosterSrc(".top-box-list .movie-grid-poster");
                that.setPosterSrc(".coming-soon-list .movie-grid-poster");
                that.setPosterSrc(".movies-near-me-list .movie-grid-poster");

            }

        },

        unload: function () {
            this.isVisible = false;
        },

        renderHomeMovies: function (target, data) {

            if (!data) {
                return;
            }

            var that = this;

            that.mergeData(target, "MoviePosterGridTemplate", data);

            requestAnimationFrame(function () {
                that.rootScope.setPosterSrc(target + " .movie-grid-poster");
            });

        }

    });

}(window));

