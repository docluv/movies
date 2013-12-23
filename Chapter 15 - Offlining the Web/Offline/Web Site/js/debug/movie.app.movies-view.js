/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

(function (window, undefined) {

    movieApp.fn.moviesView = {

        onload: function (params) {

            var that = this,
                mv = that.moviesView,
                movieType = params.movieType || "TopBoxOffice";

            that.rt[movieType + "Movies"](50, 1, function (data) {
                mv.renderMovies.call(that, data);
            });

            that.setMainTitle(that.movieTypes[movieType]);

        },

        renderMovies: function (data) {

            if (!data) {
                return;
            }

            var that = this;

            that.setMoviePanelWidth(".movie-poster-div", data.movies.length);

            window.addEventListener("resize", function () {
                that.setMoviePanelWidth(".movie-poster-div", data.movies.length);
                that.setPosterSrc(".movie-grid-poster");
            });

            that.mergeData(".movie-poster-div", "MoviePosterGridTemplate", data);

            requestAnimationFrame(function () {
                that.setPosterSrc(".movie-grid-poster");
            });
        }

    };

})(window);