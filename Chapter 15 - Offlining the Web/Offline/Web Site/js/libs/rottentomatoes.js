
;

//Example JavaScript Module based on the jQuery pattern
//It is wrapped within an anymous enclosure
(function (window, undefined) {

    "use strict";

    //this is ultimately the object used to create the global variable
    //it is set at the end of the module
    //I use RottenTomatoes as an example name, you can do a replace all to name it 
    //what every suites your needs.
    var RottenTomatoes = function (customSettings) {


        //return the object created by the init method (defined later).
        //notice we are calling the RottenTomatoes init method from the object's protype alias.
        //The customSettings parameter is passed to the init method. Remember to pass
        //any parameters along to the init method.
        var that = new RottenTomatoes.fn.init(customSettings);


        //here I had a delima. I want to show how to merge a custom settings object
        //but I don't wan to rely on jQuery, Underscore or something else for this example.
        //so I decided to show you what it would look like with a jQuery dependancy.

        that.settings = $().extend({}, that.settings, customSettings);


        //for a lightweight library with an extend method see my dollarbill repository
        //https://github.com/docluv/dollarbill

        that.data = that.settings.data || rqData();

        //This is actually where jQuery select the DOM element(s) you are looking for and encapsulates them.


        return that;
    };


    //Create an alias to the module's prototype
    //create the object's members in the protype definition.
    RottenTomatoes.fn = RottenTomatoes.prototype = {

        //hmm what is this for?
        //well combined with the following init definition we 
        constructor: RottenTomatoes,


        //gets everything started and returns a reference to the object.
        //notice it was called from the RottenTomatoes function definition above.
        init: function (customSettings) {
            //return a reference to itself so you can chain things later!
            return this;
        },


        //I think this is just good practice ;)
        version: "0.0.1",

        rtRoot: "http://api.rottentomatoes.com/api/public/v1.0/",
        apiKey: "q7g5vgxauv72mgvghgtbpdbc",
        defaultPageLimit: 12,

        data: undefined,

        TopBoxOfficeMovies: function (pageLimit, page, callback) {

            return this.getRottenTomatoesList("box_office", pageLimit, page, callback);
        },

        OpeningMovies: function (pageLimit, page, callback) {

            return this.getRottenTomatoesList("opening", pageLimit, page, callback);
        },

        InTheatersMovies: function (pageLimit, page, callback) {

            return this.getRottenTomatoesList("in_theaters", pageLimit, page, callback);
        },

        CommingSoonMovies: function (pageLimit, page, callback) {

            return this.getRottenTomatoesList("upcoming", pageLimit, page, callback);

        },

        SearchMovies: function (pageLimit, page, q, callback) {

            page = page || 1;
            pageLimit = pageLimit || this.defaultPageLimit;

            var that = this,
                url = that.rtRoot + "movies.json?apikey=" + this.apiKey +
                        "&q=" + q + "&page_limit=" +
                        pageLimit + "&page=" + page;

            return that.data.getJSONP(url, {
                success: function (data) {
                    that.MoviesCallback.call(that, data, callback);
                }
            });

        },

        loadMovieDetails: function (id, callback) {

            var that = this,
                url = that.rtRoot + "movies/" + id + ".json?apikey=" + that.apiKey,
                _callback = function (data) {

                    if (callback) {
                        callback(that.setMoviePoster(data)[0]);
                    }

                };

            return that.data.getJSONP(url, {
                success: _callback
            });

        },

        storeMoviesInStorage: function (movies) {

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

        },

        MoviesCallback: function (data, callback) {

            var that = this;

            if (data.total > 0 || data.movies.length > 1) {
                data.movies = that.setMoviePoster(data.movies);
            }

            if (callback) {
                callback.call(that, data);
            }

            that.storeMoviesInStorage(data.movies);

        },

        getRottenTomatoesList: function (listName, pageLimit, page, callback) {

            var that = this;

            return this.getRottenTomatoes(listName, pageLimit, page, function (data) {
                that.MoviesCallback.call(that, data, callback);
            });

        },

        getRottenTomatoes: function (listName, pageLimit, page, callback) {

            //might want to duck type to make the methods overloaded.

            var url = this.rtRoot + "lists/movies/" + listName + ".json?apikey=" +
                    this.apiKey + "&page_limit=" +
                        (pageLimit || that.defaultPageLimit) + "&page=" + (page || 1);

            return that.data.getJSONP(url, {
                success: callback
            });

        },

        getNews: function (callback) {

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

        //yes you can create child objects
        //settings: {
        //    prop1: "Sample Module"
        //}


    };


    // Give the init function the RottenTomatoes prototype for later instantiation
    RottenTomatoes.fn.init.prototype = RottenTomatoes.fn;


    //create the global object used to create new instances of RottenTomatoes
    return (window.RottenTomatoes = RottenTomatoes);


})(window);


