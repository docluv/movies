

(function (window, undefined) {

    "use strict";

    /*
    movieApp.fn.setMovieGridSize = function () {

        var that = this,
            grid = document.querySelector(".movie-poster-div"),
            posters = document.querySelectorAll(".movie-target"),
            l = posters.length,
            pHeight = 170, //poster height
            pWidth = 120, //poster width
            wBox = {
                width: parseInt(main.clientWidth, 10),
                height: parseInt(main.clientHeight, 10)
            },
            rows = 0, columns = 0;

        if (wBox.width > 600) {//make it horizontal

            rows = Math.floor(wBox.height / pHeight);
            grid.style.width = (pWidth * (l / rows)) + "px";
            grid.style.height = (rows * pHeight) + "px";

        } else {//make it vertical


            //columns = Math.floor(wBox.width / pWidth);
            //grid.style.width = (pWidth * columns) + "px";
            grid.style.width = "";
            grid.style.height = "";

            //grid.style.marginLeft = "";

        }

    };

    movieApp.fn.setMovieGridSize = function () {

        //panorama-panels
        //single-panel

        var that = this,
            grid = document.querySelector(".movie-poster-div"),
            posters = document.querySelectorAll(".movie-target"),
            l = posters.length,
            pHeight = 170, //poster height
            pWidth = 120, //poster width
            wBox = {
                width: parseInt(main.clientWidth, 10),
                height: parseInt(main.clientHeight, 10)
            },
            rows = 0, columns = 0;

        if (wBox.width > 600 && grid) {//make it horizontal

            rows = Math.floor(wBox.height / pHeight);
            grid.style.width = (pWidth * (l / rows)) + "px";
            grid.style.height = (rows * pHeight) + "px";

        } else {//make it vertical

            grid.style.width = "";
            grid.style.height = "";

        }

    };
    */
    

    movieApp.fn.setPosterSrc = function (posterSelector) {

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

    };

}(window));

