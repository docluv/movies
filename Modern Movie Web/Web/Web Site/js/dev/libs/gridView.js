;

(function (window, undefined) {

    "use strict";

    var gridView = movieAppView.extend({

        init: function () {
            this._super.apply(this, arguments);
        },

        setPosterSrc : function (posterSelector) {

            var i = 0,
                moviePoster,
                moviePosters = document.querySelectorAll(posterSelector || ".movie-grid-poster"),
                curWidth = window.innerWidth,
                detBreakPoint = 600,
                oriBreakPoint = 1024;

            for (i = 0; i < moviePosters.length; i++) {

                moviePoster = moviePosters[i];

                if (i === 0 && curWidth >= oriBreakPoint) {

                    moviePoster.src = moviePoster.src
                                        .replace("pro", "ori")
                                        .replace("det", "ori");

                } else if (curWidth >= detBreakPoint) {

                    moviePoster.src = moviePoster.src
                                        .replace("pro", "det")
                                        .replace("ori", "det");

                } else {
                    moviePoster.src = moviePoster.src.replace("ori", "pro")
                                                        .replace("det", "pro");
                }

            }

        }

    });

    return (window.gridView = gridView);

}(window));