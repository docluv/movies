/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

(function (window, undefined) {

    movieApp.fn.moviesView = {

        onload: function (params) {

            var that = this,
                movieType = params.movieType || "TopBoxOffice";

            that.rt[movieType + "Movies"](50, 1, function (data) {

                if (!data) {
                    return;
                }

                that.setMoviePanelWidth(".movie-poster-div", data.movies.length);

                window.addEventListener("resize", function () {
                    that.setMoviePanelWidth(".movie-poster-div", data.movies.length);
                });

                that.mergeData(".movie-poster-div", "MoviePosterGridTemplate", data);

            });

            that.setMainTitle(that.movieTypes[movieType]);

        }

    };

})(window);