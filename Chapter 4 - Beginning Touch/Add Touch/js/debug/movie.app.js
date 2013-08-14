
;

(function(window, undefined) {

    "use strict";
    
    var movieApp = function(customSettings) {

        return new movieApp.fn.init(customSettings);
    };

    movieApp.fn = movieApp.prototype = {

        constructor: movieApp,

        init: function(customSettings) {

            return this;
        },

        version: "0.0.2",


        settings: {
            appTitle: "Mobile Movies",
            InTheatersHomeCount: 15,
            CommingSoonHomeCount: 15,
            SearchCount: 20
        }

    };

    // Give the init function the movieApp prototype for later instantiation
    movieApp.fn.init.prototype = movieApp.fn;

    return (window.movieApp = movieApp);

} (window));



