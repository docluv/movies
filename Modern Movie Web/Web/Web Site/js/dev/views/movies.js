/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

(function (window, undefined) {

    movieApp.fn.moviesView = gridView.extend({

        onload: function (params) {

            var that = this,
                md = that.rootScope.dataProvider,
                movieType = params.movieType || "TopBoxOffice";

            that.isVisible = true;

            md[movieType + "Movies"].call(md, 50, 1, function (data) {
                that.renderMovies.call(that, data);
            });

            that.setMainTitle(that.movieTypes[movieType]);

        },

        mql600: undefined,
        mql1024: undefined,
        isVisible: false,

        renderMovies: function (data) {

            if (!data) {
                return;
            }

            var that = this;

            that.setMoviePanelWidth(".movie-poster-div", data.movies.length);

            that.setupMQLs.call(that, data.movies.length);

            that.mergeData(".movie-poster-div", "MoviePosterGridTemplate", data);

            requestAnimationFrame(function () {
                that.setPosterSrc(".movie-grid-poster");
            });
        },

        setupMQLs: function (length) {

            var that = this;

            if (!that.mql600) {

                that.mql600 = window.matchMedia("(min-width: 600px)");

                that.mql600.addListener(function () {

                    that.updateLayout(length);

                });

            }

            if (!that.mql1024) {

                that.mql1024 = window.matchMedia("(min-width: 1024px)");

                that.mql1024.addListener(function () {

                    that.updateLayout(length);

                });

            }

        },

        updateLayout: function (length) {

            var that = this;

            if (that.isVisible) {

                that.setMoviePanelWidth(".movie-poster-div", length);
                that.setPosterSrc(".movie-grid-poster");

            }

        },

        unload: function () {
            this.isVisible = false;
        }

    });

})(window);