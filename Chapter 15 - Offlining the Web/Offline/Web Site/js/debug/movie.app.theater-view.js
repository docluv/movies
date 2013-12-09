/// <reference path="love2dev.app.js" />
/// <reference path="love2dev.app.api.js" />
;

(function (window, undefined) {

    "use strict";

    movieApp.fn.theaterView = {

        onload: function (params) {

            var that = this,
                tv = that.theaterView;

            that.setMainTitle(decodeURIComponent(params.theaterName));

            that.InTheatersMovies(50, 1, function (data) {
                if (!data) {
                    return;
                }

                this.mergeData(".movie-showtimes-wrapper", "MovieStartTimesTemplate",
                    tv.cleanFirstPoster.call(that, data));
            });
        },

        cleanFirstPoster : function (data) {


            return data;
        }

    };

}());