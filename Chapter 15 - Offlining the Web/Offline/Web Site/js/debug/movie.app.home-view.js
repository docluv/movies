/// <reference path="love2dev.app.js" />
/// <reference path="love2dev.app.api.js" />


(function (window, undefined) {

    "use strict";

    movieApp.fn.homeView = {

        onload: function () {

            var that = this,
                hv = that.homeView;

            that.setupPanorama();
            that.setMainTitle("Modern Web Movies");

            hv.loadMovies.call(that);

            requestAnimationFrame(function () {
                that.panorama.resizePanorama();
            });

            hv.setupMQLs.call(that, hv);

        },

        setupMQLs: function (hv) {

            var that = this;

            that.setupMQL("min600", "(min-width: 600px)", [{
                matchName: "manageHomeView",
                matchFunc: function () {
                    hv.updatePanoramaLayout.call(that);
                },
                nomatchName: "manageHomeView",
                nomatchFunc: function () {
                    hv.updatePanoramaLayout.call(that);
                }
            }]);

            that.setupMQL("min1024", "(min-width: 1024px)", [{
                matchName: "manageHomeView1024",
                matchFunc: function () {
                    hv.updatePanoramaLayout.call(that);
                },
                nomatchName: "manageHomeView1024",
                nomatchFunc: function () {
                    hv.updatePanoramaLayout.call(that);
                }
            }]);

        },

        loadMovies: function () {

            var that = this,
                hv = that.homeView;

            that.rt.InTheatersMovies(50, 1, function (data) {
                hv.renderHomeMovies.call(that, ".top-box-list", data);
            });

            that.rt.OpeningMovies(50, 1, function (data) {
                hv.renderHomeMovies.call(that, ".opening-movie-list", data);
            });

            that.rt.TopBoxOfficeMovies(50, 1, function (data) {
                hv.renderHomeMovies.call(that, ".movies-near-me-list", data);
            });

            that.rt.ComingSoonMovies(50, 1, function (data) {
                hv.renderHomeMovies.call(that, ".coming-soon-list", data);
            });

        },

        updatePanoramaLayout: function () {

            var that = this;

            that.panorama.resizePanorama();

            that.setPosterSrc.call(that, ".opening-movie-list .movie-grid-poster");
            that.setPosterSrc.call(that, ".top-box-list .movie-grid-poster");
            that.setPosterSrc.call(that, ".coming-soon-list .movie-grid-poster");
            that.setPosterSrc.call(that, ".movies-near-me-list .movie-grid-poster");

        },

        unload: function () {
            delete this.minWidthMQLs["min600"];
            delete this.minWidthMQLs["min1024"];
        },

        renderHomeMovies: function (target, data) {

            if (!data) {
                return;
            }

            var that = this;

            that.mergeData(target, "MoviePosterGridTemplate", data);

            requestAnimationFrame(function () {
                that.setPosterSrc(target + " .movie-grid-poster");
            });

        }

    };

}(window));
