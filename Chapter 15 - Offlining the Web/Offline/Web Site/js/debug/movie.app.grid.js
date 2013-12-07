

(function (window, undefined) {

    "use strict";

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

    movieApp.fn.setMoviePoster = function (movies) {

        if (!movies.length) {  //rude detection for nodeList
            //    movies = movies;
            //} else {
            movies = [movies];
        }

        var i = 0,
            width = parseInt(window.innerWidth, 10);

        for (i = 0; i < movies.length; i++) {

            if (width < this.settings.smallBreakPoint) {

                movies[i].poster = movies[i].posters.profile;

            } else if (width > this.settings.desktopBreakPoint) {

                if (i === 0) {
                    movies[i].poster = movies[i].posters.original;
                } else {
                    movies[i].poster = movies[i].posters.detailed;
                }

            } else {

                movies[i].poster = movies[i].posters.detailed;

            }

        }

        return movies;
    };

    movieApp.fn.setPosterSrc = function () {

        var i = 0,
            moviePoster,
            moviePosters = document.querySelectorAll(".movie-grid-poster"),
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

