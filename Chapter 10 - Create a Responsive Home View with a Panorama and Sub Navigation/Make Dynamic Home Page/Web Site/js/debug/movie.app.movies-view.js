
(function (window, undefined) {

    movieApp.fn.loadMoviesView = function (params) {

        var that = this,
            movieType = params.movieType || "TopBoxOffice";

        that[movieType + "Movies"](50, 1, function (data) {

            if (!data) {
                return;
            }

            that.setMoviePanelWidth(".movie-poster-div", data.movies.length);

            window.addEventListener("resize", function () {
                that.setMoviePanelWidth(".movie-poster-div", data.movies.length);
            });

            that.mergeData(".movie-poster-div", "MoviePosterGridTemplate", data);

        });



    };

})(window);