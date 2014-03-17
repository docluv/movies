/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

(function (window, undefined) {

    movieApp.fn.moviesView = {

        onload: function (params) {

            var that = this,
                md = that.movieData,
                mv = that.moviesView,
                movieType = params.movieType || "TopBoxOffice";

            mv.isVisible = true;

            md[movieType + "Movies"].call(md, 50, 1, function (data) {
                mv.renderMovies.call(that, data);
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

            that.moviesView.setupMQLs.call(that, data.movies.length);

            that.mergeData(".movie-poster-div", "MoviePosterGridTemplate", data);

            requestAnimationFrame(function () {
                that.setPosterSrc(".movie-grid-poster");
            });
        },

        setupMQLs: function (length) {

            var that = this,
                mlv = that.moviesView;

            if (!mlv.mql600) {

                mlv.mql600 = window.matchMedia("(min-width: 600px)");

                mlv.mql600.addListener(function () {

                    mlv.updateLayout.call(that, length);

                });

            }

            if (!mlv.mql1024) {

                mlv.mql1024 = window.matchMedia("(min-width: 1024px)");

                mlv.mql1024.addListener(function () {

                    mlv.updateLayout.call(that, length);

                });

            }

        },

        updateLayout: function (length) {

            var that = this;

            if (that.moviesView.isVisible) {

                that.setMoviePanelWidth(".movie-poster-div", length);
                that.setPosterSrc(".movie-grid-poster");

            }

        },

        unload: function () {
            this.moviesView.isVisible = false;
        }

    };

})(window);