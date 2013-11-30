
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

        minWidthMQLs: {},

        setupMQL: function(key, mediaQuery, matches){

            /*

            matches - an array of match function names and definitions

            match = {
                matchName: "foo",
                matchFunc: function(){},
                nomatchName: "nofoo",
                nomatchFunc: function(){}
            };

            */
        
            var that = this,
                matchKey, i;

            if(!that.minWidthMQLs[key]){
            
                that.minWidthMQLs[key] = window.matchMedia(mediaQuery);
                that.minWidthMQLs[key].match = {};
                that.minWidthMQLs[key].nomatch = {};

            }

            if(!matches.length){
                matches = [matches];
            }

            for(i = 0; i < matches.length; i++){
                that.minWidthMQLs[key].match[matches[i].matchName] = matches[i].matchFunc;
                that.minWidthMQLs[key].nomatch[matches[i].nomatchName] = matches[i].nomatchFunc;
            }
            
            that.minWidthMQLs[key].addListener(function (e) {

                if (e.matches) {
                
                    for (matchKey in that.minWidthMQLs[key].match) {
                        if (that.minWidthMQLs[key].match.hasOwnProperty(matchKey)) {
                            that.minWidthMQLs[key].match[matchKey].call(that);
                        }
                    }

                } else {

                    for (matchKey in that.minWidthMQLs[key].nomatch) {
                        if (that.minWidthMQLs[key].nomatch.hasOwnProperty(matchKey)) {
                            that.minWidthMQLs[key].nomatch[matchKey].call(that);
                        }
                    }

                }

        });

        },

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



