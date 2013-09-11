
(function (window, undefined) {

    "use strict";

    movieApp.fn.loadMovieView = function (params) {

        console.log("loadMovieView");

        var that = this;
        
        that.loadMovieDetails(params.id, function (data) {

            if (!data) {
                return;
            }

            that.renderMovieDetails(data);

        });
        
    };


    movieApp.fn.renderMovieDetails = function (data) {

        if (data) {

            this.mergeData(".movie-details-panel", "movieDetailsPosterTemplate", data);
            this.mergeData(".movie-description-panel", "movieDetailsDescriptionTemplate", data);
            this.mergeData(".cast-name-list", "movieDetailsCastTemplate", data);
            this.mergeData(".movie-showtime-list", "MovieShowtimeTemplate",
                            this.mergeInFakeShowtimes(data));

            this.setupPanorama();
        }

    };

}(window));