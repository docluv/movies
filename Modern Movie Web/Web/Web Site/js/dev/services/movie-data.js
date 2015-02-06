
;

(function (window, undefined) {

    var movieData = function (movieSrc, theaterSrc) {

        var that = new movieData.fn.init();

        that.movieSrc = movieSrc;
        that.theaterSrc = theaterSrc;

        return that;
    };

    movieData.fn = movieData.prototype = {

        constructor: movieData,

        init: function () {
            //return a reference to itself so you can chain things later!
            return this;
        },

        version: "0.0.1",

        movieSrc: undefined,
        theaterSrc: undefined,

        nearbyTheaters: function (latitude, longitude) {

            if (!this.theaterSrc) {
                return;
            }

            return this.theaterSrc.nearbyTheaters(latitude, longitude);
        },

        theaterShowTimes: function (theaterId, movieId) {

            if (!this.theaterSrc) {
                return;
            }

            return this.theaterSrc.theaterShowTimes(theaterId, movieId);

        },

        TopBoxOfficeMovies: function (pageLimit, page, callback) {

            if (!this.movieSrc) {
                return;
            }

            return this.movieSrc.TopBoxOfficeMovies(pageLimit, page, callback);

        },

        OpeningMovies: function (pageLimit, page, callback) {

            if (!this.movieSrc) {
                return;
            }

            return this.movieSrc.OpeningMovies(pageLimit, page, callback);

        },

        InTheatersMovies: function (pageLimit, page, callback) {

            if (!this.movieSrc) {
                return;
            }

            return this.movieSrc.InTheatersMovies(pageLimit, page, callback);

        },

        ComingSoonMovies: function (pageLimit, page, callback) {

            if (!this.movieSrc) {
                return;
            }

            return this.movieSrc.ComingSoonMovies(pageLimit, page, callback);

        },

        SearchMovies: function (pageLimit, page, q, callback) {

            if (!this.movieSrc) {
                return;
            }

            return this.movieSrc.SearchMovies(pageLimit, page, q, callback);

        },

        loadMovieDetails: function (id, callback) {

            if (!this.movieSrc) {
                return;
            }

            var that = this;

            this.movieSrc.loadMovieDetails(id, function (movie) {

                if (callback) {
                    callback(that.mergeInFakeShowtimes(movie));
                }
            });

        },

        mergeInFakeShowtimes: function (movie) {

            var showtimes = [{ "theater": "The Mystic", "showtimes": ["12:20", "3:05", "5:45", "7:50", "10:10"] },
                                { "theater": "The Marquee", "showtimes": ["12:05", "2:35", "4:45", "6:50", "8:10", "10:45"] },
                                { "theater": "The Pantagees", "showtimes": ["12:05", "2:35", "4:45", "6:50", "8:10", "10:45"] }], i = 0;

            if (movie.length != undefined) {

                for (i = 0; i < movie.length - 1; i++) {

                    movie[i].showtimes = showtimes;

                }

            } else {
                movie.showtimes = showtimes;
            }

            return movie;
        }

    };


    // Give the init function the movieData prototype for later instantiation
    movieData.fn.init.prototype = movieData.fn;


    //create the global object used to create new instances of movieData
    return (window.movieData = movieData);


})(window);


