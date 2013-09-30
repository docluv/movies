
;

(function(window, undefined) {

    "use strict";


var menuItems = {
                topMenu: [
                {
                title: "home",
                iconClass: "go-home",
                url: "#!"
            }
                ,{
                title: "location",
                iconClass: "go-location",
                url:  "#!mapView"
            }
                ,{
                title: "showtimes",
                iconClass: "go-current",
                url:  "#!showtimes"
            }
                ,{
                title: "search",
                iconClass: "go-search",
                url:  "#!search"
            }],
                subMenu: [
                    {
                        title: "news",
                        icon: undefined,
                        iconClass: "go-news",
                        url: "#!news"
                    }
                    , {
                        title: "comming soon",
                        icon: undefined,
                        iconClass: "go-movie-soon",
                        url: "#!commingsoon"
                    }
                    , {
                        title: "favorites",
                        icon: undefined,
                        iconClass: "go-favorites",
                        url: "#!favorites"
                    }
                     , {
                         title: "share",
                         icon: undefined,
                         iconClass: "go-share",
                         url: "#!share"
                     }]
            };

    
    var movieApp = function(customSettings) {

        return new movieApp.fn.init(customSettings);
    };

    movieApp.fn = movieApp.prototype = {

        constructor: movieApp,

        init: function(customSettings) {

            toolbar(".toolbar", {
                menuItems: menuItems
            });

            

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



