/// <reference path="love2dev.app.js" />
/// <reference path="love2dev.app.api.js" />
;

(function (window, undefined) {

    "use strict";

    movieApp.fn.theaterView = {

        onload: function (params) {

            var that = this,
                tv = that.theaterView,
                msdate = ".movie-showtime-date";

            that.setMainTitle(decodeURIComponent(params.theaterName));

            that.rt.InTheatersMovies(50, 1, function (data) {
                tv.renderTheaterMovies.call(that, data);
            });

            deeptissue(msdate).tap(function (e) {

                //removes from all the date elements
                $(msdate).removeClass("selected");

                e.currentTarget.classList.add("selected");

                //load "new" movie showtimes
                that.rt.InTheatersMovies(50, 1, function (data) {
                    tv.renderTheaterMovies.call(that, data);
                });

            });
        },

        renderTheaterMovies: function (data) {

            if (!data) {
                return;
            }

            var that = this;

            that.mergeData(".movie-showtimes-wrapper", "MovieStartTimesTemplate", data);

            document.querySelector(".movie-showtimes-scroller").scrollTop = 0;
        },

    };

}());