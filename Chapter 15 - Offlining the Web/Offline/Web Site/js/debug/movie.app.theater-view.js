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

            that.rt.InTheatersMovies(50, 1, function (data) {
                tv.renderTheaterMovies.call(that, data);
            });
        },

        renderTheaterMovies: function (data) {

            if (!data) {
                return;
            }

            var that = this;

            that.mergeData(".movie-showtimes-wrapper", "MovieStartTimesTemplate",
                that.theaterView.cleanFirstPoster.call(that, data));
        },

        cleanFirstPoster : function (data) {


            return data;
        }

    };

}());