/// <reference path="movie.app.js" />
/// <reference path="movie.app.grid.js" />

(function (window, undefined) {

    "use strict";

    movieApp.fn.rtRoot = "http://api.rottentomatoes.com/api/public/v1.0/";
    movieApp.fn.apiKey = "q7g5vgxauv72mgvghgtbpdbc";
    movieApp.fn.defaultPageLimit = 12;

    movieApp.fn.TopBoxOfficeMovies = function (pageLimit, page, callback) {

        return this.getRottenTomatoesList("box_office", pageLimit, page, callback);
    };

    movieApp.fn.OpeningMovies = function (pageLimit, page, callback) {

        return this.getRottenTomatoesList("opening", pageLimit, page, callback);
    };

    movieApp.fn.InTheatersMovies = function (pageLimit, page, callback) {

        return this.getRottenTomatoesList("in_theaters", pageLimit, page, callback);
    };

    movieApp.fn.CommingSoonMovies = function (pageLimit, page, callback) {

        return this.getRottenTomatoesList("upcoming", pageLimit, page, callback);

    };

    movieApp.fn.SearchMovies = function (pageLimit, page, q, callback) {

        page = page || 1;
        pageLimit = pageLimit || this.defaultPageLimit;

        var that = this,
            url = that.rtRoot + "movies.json?apikey=" + this.apiKey +
                    "&q=" + q + "&page_limit=" +
                    pageLimit + "&page=" + page;

        return this.data.getData(url, {
            type: "jsonp",
            success: function (data) {
                that.MoviesCallback.call(that, data, callback);
            }
        });

    };

    movieApp.fn.loadMovieDetails = function (id, callback) {

        var that = this,
            url = that.rtRoot + "movies/" + id + ".json?apikey=" + that.apiKey,
            _callback = function (data) {

                if (callback) {
                    callback(that.setMoviePoster(data)[0]);
                }

            };

        return this.data.getData(url, {
            type: "jsonp",
            success: _callback
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

    movieApp.fn.MoviesCallback = function (data, callback) {

        var that = this;

        if (data.total > 0 || data.movies.length > 1 ) {
            data.movies = that.setMoviePoster(data.movies);
        }

        if (callback) {
            callback.call(that, data);
        }

        that.storeMoviesInStorage(data.movies);

    };

    movieApp.fn.getRottenTomatoesList = function (listName, pageLimit, page, callback) {

        var that = this;

        return this.getRottenTomatoes(listName, pageLimit, page, function (data) {
            that.MoviesCallback.call(that, data, callback);
        });

    };

    movieApp.fn.getRottenTomatoes = function (listName, pageLimit, page, callback) {

        //might want to duck type to make the methods overloaded.

        page = page || 1;
        pageLimit = pageLimit || that.defaultPageLimit;

        var url = this.rtRoot + "lists/movies/" + listName + ".json?apikey=" +
                this.apiKey + "&page_limit=" + pageLimit + "&page=" + page;

        return this.data.getData(url, {
            type: "jsonp",
            success: callback
        });

    };

    movieApp.fn.getNews = function (callback) {

        return {
            articles: [
            {
                "title": "Actor Christian Bale visits Colorado shooting victims",
                "link": "http://news.yahoo.com/christian-bale-visits-shooting-victims-reports-223847447.html",
                "pubDate": "Tue, 24 Jul 2012 19:09:51 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "The porn industry condom debate: a double standard with Hollywood?",
                "link": "http://news.yahoo.com/porn-industry-condom-debate-double-standard-hollywood-113107105.html",
                "pubDate": "Wed, 25 Jul 2012 07:31:07 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Ruby Sparks review: when cute becomes cutesy",
                "link": "http://news.yahoo.com/ruby-sparks-review-cute-becomes-cutesy-113041102.html",
                "pubDate": "Wed, 25 Jul 2012 07:30:41 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Dark Knight Rises earns $160.8 million in debut",
                "link": "http://news.yahoo.com/dark-knight-rises-earns-160-8-million-debut-001911324--finance.html",
                "pubDate": "Mon, 23 Jul 2012 20:19:11 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Pixar moves Monsters Inc. 3D into crowded Christmas field",
                "link": "http://news.yahoo.com/pixar-moves-monsters-inc-3d-crowded-christmas-field-215103389.html",
                "pubDate": "Tue, 24 Jul 2012 17:51:03 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Toronto film festival promises action, India, Affleck",
                "link": "http://news.yahoo.com/toronto-film-festival-promises-action-india-affleck-190502856.html",
                "pubDate": "Tue, 24 Jul 2012 17:51:03 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Drama meets daily life in Palestinian film",
                "link": "http://news.yahoo.com/drama-meets-daily-life-palestinian-film-111602147.html",
                "pubDate": "Tue, 24 Jul 2012 17:51:03 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Actor Christian Bale visits Colorado shooting victims",
                "link": "http://news.yahoo.com/christian-bale-visits-shooting-victims-reports-223847447.html",
                "pubDate": "Tue, 24 Jul 2012 19:09:51 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "The porn industry condom debate: a double standard with Hollywood?",
                "link": "http://news.yahoo.com/porn-industry-condom-debate-double-standard-hollywood-113107105.html",
                "pubDate": "Wed, 25 Jul 2012 07:31:07 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Ruby Sparks review: when cute becomes cutesy",
                "link": "http://news.yahoo.com/ruby-sparks-review-cute-becomes-cutesy-113041102.html",
                "pubDate": "Wed, 25 Jul 2012 07:30:41 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Dark Knight Rises earns $160.8 million in debut",
                "link": "http://news.yahoo.com/dark-knight-rises-earns-160-8-million-debut-001911324--finance.html",
                "pubDate": "Mon, 23 Jul 2012 20:19:11 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Pixar moves Monsters Inc. 3D into crowded Christmas field",
                "link": "http://news.yahoo.com/pixar-moves-monsters-inc-3d-crowded-christmas-field-215103389.html",
                "pubDate": "Tue, 24 Jul 2012 17:51:03 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Toronto film festival promises action, India, Affleck",
                "link": "http://news.yahoo.com/toronto-film-festival-promises-action-india-affleck-190502856.html",
                "pubDate": "Tue, 24 Jul 2012 17:51:03 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Drama meets daily life in Palestinian film",
                "link": "http://news.yahoo.com/drama-meets-daily-life-palestinian-film-111602147.html",
                "pubDate": "Tue, 24 Jul 2012 17:51:03 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Actor Christian Bale visits Colorado shooting victims",
                "link": "http://news.yahoo.com/christian-bale-visits-shooting-victims-reports-223847447.html",
                "pubDate": "Tue, 24 Jul 2012 19:09:51 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "The porn industry condom debate: a double standard with Hollywood?",
                "link": "http://news.yahoo.com/porn-industry-condom-debate-double-standard-hollywood-113107105.html",
                "pubDate": "Wed, 25 Jul 2012 07:31:07 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Ruby Sparks review: when cute becomes cutesy",
                "link": "http://news.yahoo.com/ruby-sparks-review-cute-becomes-cutesy-113041102.html",
                "pubDate": "Wed, 25 Jul 2012 07:30:41 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Dark Knight Rises earns $160.8 million in debut",
                "link": "http://news.yahoo.com/dark-knight-rises-earns-160-8-million-debut-001911324--finance.html",
                "pubDate": "Mon, 23 Jul 2012 20:19:11 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Pixar moves Monsters Inc. 3D into crowded Christmas field",
                "link": "http://news.yahoo.com/pixar-moves-monsters-inc-3d-crowded-christmas-field-215103389.html",
                "pubDate": "Tue, 24 Jul 2012 17:51:03 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Toronto film festival promises action, India, Affleck",
                "link": "http://news.yahoo.com/toronto-film-festival-promises-action-india-affleck-190502856.html",
                "pubDate": "Tue, 24 Jul 2012 17:51:03 -0400",
                "source-url": "Reuters"
            },
            {
                "title": "Drama meets daily life in Palestinian film",
                "link": "http://news.yahoo.com/drama-meets-daily-life-palestinian-film-111602147.html",
                "pubDate": "Tue, 24 Jul 2012 17:51:03 -0400",
                "source-url": "Reuters"
            }
            ]
        };

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