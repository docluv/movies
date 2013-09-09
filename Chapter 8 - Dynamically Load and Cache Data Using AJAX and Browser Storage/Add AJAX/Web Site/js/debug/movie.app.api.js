
;

(function (window, undefined) {

    "use strict";

    movieApp.fn.rtRoot = "http://api.rottentomatoes.com/api/public/v1.0/";
    movieApp.fn.apiKey = "q7g5vgxauv72mgvghgtbpdbc";
    movieApp.fn.defaultPageLimit = 12;


    movieApp.fn.InTheatersMovies = function (pageLimit, page, callback) {

        var that = this,
            MoviesCallback = function (data) {

            if (callback) {
                callback.call(that, data);
            }

            that.storeMoviesInStorage(data.movies);

        };

        return this.getRottenTomatoes("in_theaters", pageLimit, page, MoviesCallback);
    };

    movieApp.fn.CommingSoonMovies = function (pageLimit, page, callback) {

        return this.getRottenTomatoes("upcoming", page, pageLimit, callback);
    };

    movieApp.fn.SearchMovies = function (pageLimit, page, q, callback) {

        page = page || 1;
        pageLimit = pageLimit || that.defaultPageLimit;

        var url = that.rtRoot + "movies.json?apikey=" + this.apiKey +
                    "&q=" + q + "&page_limit=" +
                    pageLimit + "&page=" + page;

        return this.data.getData(url, false, {
            type: "jsonp",
            success: callback
        });

    };

    movieApp.fn.loadMovieDetails = function (id, callback) {

        var that = this,
            url = that.rtRoot + "movies/" + id + ".json?apikey=" + that.apiKey;

        return this.data.getData(url, false, {
            type: "jsonp",
            success: callback
        });

    };

    /*
    storeMoviesInStorage is a helper method to take advantage of the Flixster API returning
    each movies full profile when a list of movies is requested. This will eliminate the need
    to make another round trip to the server to collect information we have already recieved.
    */
    movieApp.fn.storeMoviesInStorage = function (movies) {

        if (!movies || !movies.length) {
            return;
        }

        var movie,
            that = this,
            i = 0,
            cacheKey = "",
            ls = window.localStorage;

        for (i = 0; i < movies.length; i++) {

            movie = movies[i];

            //build the cacheKey to reference in localStorage. Must add jsonp as the preFilter does this when it stored the result
            cacheKey = that.rtRoot + "movies/" + movie.id + ".json?apikey=" +
                        that.apiKey + "jsonp";

            ls.setItem(cacheKey, JSON.stringify(movie));
            ls.setItem(cacheKey + 'cachettl', +new Date() //forces it to return ticks
                        + 1000 * 60 * 60 * 72); //ms * seconds * minutes * hours to add to current time in ticks
            //72 represents 3 days, which is a magic #
            //you can adjust this number to suit your needs, but movie information rarely changes so a long
            //period is more desireable. 
        }

    };

    movieApp.fn.getRottenTomatoes = function (listName, pageLimit, page, callback) {

        //might want to duck type to make the methods overloaded.

        page = page || 1;
        pageLimit = pageLimit || that.defaultPageLimit;

        var url = this.rtRoot + "lists/movies/" + listName + ".json?apikey=" +
                this.apiKey + "&page_limit=" + pageLimit + "&page=" + page;

        return this.data.getData(url, false, {
            type: "jsonp",
            success: callback
        });

    };

    movieApp.fn.getNews = function (callback) {

        return this.data.getData("api/news", false, { success: callback });

    };


    movieApp.fn.mergeInFakeShowtimes = function (movie) {

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


}(window));