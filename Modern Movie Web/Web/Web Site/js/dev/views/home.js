/// <reference path="love2dev.app.js" />
/// <reference path="love2dev.app.api.js" />


(function (window, undefined) {

    "use strict";

    movieApp.fn.homeView = View.extend({

        init: function (rootScope) {
            this._super(rootScope);
        },

        onload: function () {

            var that = this;

            that.isVisible = true;

            that.rootScope.setupPanorama();
            that.rootScope.setMainTitle("Modern Web Movies");

            that.loadMovies.call(that);

            requestAnimationFrame(function () {
                that.rootScope.panorama.resizePanorama();
            });

            //hv.setupMQLs.call(that, hv);

        },

        mql600: undefined,
        mql1024: undefined,
        isVisible: false,

        setupMQLs: function (hv) {

            var that = this;

            if (!hv.mql600) {

                hv.mql600 = window.matchMedia("(min-width: 600px)");

                hv.mql600.addListener(function (e) {

                    hv.updateMoviePosters.call(that, e);

                });

            }

            if (!hv.mql1024) {

                hv.mql1024 = window.matchMedia("(min-width: 1024px)");

                hv.mql1024.addListener(function (e) {

                    hv.updateMoviePosters.call(that, e);

                });

            }

        },

        loadMovies: function () {

            var that = this,
                md = that.rootScope.movieData,
                 //originally had 50. This is too many because it caused up to 100 movie poster
                 //image downloads when the application is launched. 10 should be enough for the 
                 //home effect. Also changed to a variable to get minification benefit and easier
                 //maintenance.
                count = 10;

            md.InTheatersMovies.call(md, count, 1, function (data) {
                that.renderHomeMovies.call(that, ".top-box-list", data);
            });

            md.OpeningMovies.call(md, count, 1, function (data) {
                that.renderHomeMovies.call(that, ".opening-movie-list", data);
            });

            md.TopBoxOfficeMovies.call(md, count, 1, function (data) {
                that.renderHomeMovies.call(that, ".movies-near-me-list", data);
            });

            md.ComingSoonMovies.call(md, count, 1, function (data) {
                that.renderHomeMovies.call(that, ".coming-soon-list", data);
            });

        },

        updateMoviePosters: function (e) {

            if (this.homeView.isVisible) {

                var that = this;

                that.rootScope.setPosterSrc.call(that, ".opening-movie-list .movie-grid-poster");
                that.rootScope.setPosterSrc.call(that, ".top-box-list .movie-grid-poster");
                that.rootScope.setPosterSrc.call(that, ".coming-soon-list .movie-grid-poster");
                that.rootScope.setPosterSrc.call(that, ".movies-near-me-list .movie-grid-poster");

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



;
