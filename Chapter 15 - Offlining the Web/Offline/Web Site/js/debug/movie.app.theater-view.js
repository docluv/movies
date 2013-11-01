/// <reference path="love2dev.app.js" />
/// <reference path="love2dev.app.api.js" />
;

(function (window, undefined) {

    "use strict";

    movieApp.fn.cleanFirstPoster = function (data) {


        return data;
    };

    movieApp.fn.loadTheatersView = function (params) {

        var that = this;

        that.setMainTitle(decodeURIComponent(params.theaterName));

        that.InTheatersMovies(50, 1, function (data) {

            if (!data) {
                return;
            }

            that.mergeData(".movie-showtimes-wrapper", "MovieStartTimesTemplate",
                that.cleanFirstPoster(data));

        });

    }

}());