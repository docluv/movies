/// <reference path="love2dev.app.js" />
/// <reference path="love2dev.app.api.js" />
;

(function (window, undefined) {

    "use strict";

    movieApp.fn.theaterView = View.extend({


        onload: function (params) {

            var that = this,
                msdate = ".movie-showtime-date";

            that.setMainTitle(decodeURIComponent(params.theaterName));

            that.rootScope.dataProvider.InTheatersMovies(50, 1, function (data) {
                that.renderTheaterMovies(data);
            });

            deeptissue(msdate).tap(function (e) {

                //removes from all the date elements
                $(msdate).removeClass("selected");

                e.currentTarget.classList.add("selected");

                //load "new" movie showtimes
                that.rootScope.dataProvider.InTheatersMovies(50, 1, function (data) {
                    that.renderTheaterMovies(data);
                });

            });
        },

        renderTheaterMovies: function (data) {

            if (!data) {
                return;
            }

            this.mergeData(".movie-showtimes-wrapper", "MovieStartTimesTemplate", data);

            document.querySelector(".movie-showtimes-scroller").scrollTop = 0;
        },

    });

}());