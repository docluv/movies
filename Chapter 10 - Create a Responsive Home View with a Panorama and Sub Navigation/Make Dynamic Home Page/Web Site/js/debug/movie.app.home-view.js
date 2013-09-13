


(function (window, undefined) {

    "use strict";

    movieApp.fn.unloadHomeView = function () {
        delete this.resizeEvents["manageHomeView"];

        console.info("unloading the home view");
    };

    movieApp.fn.loadHomeView = function () {

        var that = this;

        this.setupPanorama();

        //        this.showLoading(".article-tiles");
        //MoviePosterGridTemplate
        //movie-poster-div

        that.InTheatersMovies(50, 1, function (data) {

            if (!data) {
                return;
            }

            that.mergeData(".top-box-list", "MoviePosterGridTemplate", data);

        });

        that.OpeningMovies(50, 1, function (data) {

            if (!data) {
                return;
            }

            that.mergeData(".opening-movie-list", "MoviePosterGridTemplate", data);

        });

        that.TopBoxOfficeMovies(50, 1, function (data) {

            if (!data) {
                return;
            }

            that.mergeData(".movies-near-me-list", "MoviePosterGridTemplate", data);

        });

        that.CommingSoonMovies(50, 1, function (data) {

            if (!data) {
                return;
            }

            that.mergeData(".comming-soon-list", "MoviePosterGridTemplate", data);

        });

        //that.setMovieGridSize();

        //that.resizeEvents["manageHomeView"] = function () {

        //    if (window.innerWidth < 600 && 
        //            Math.abs(window.innerWidth - movieApp.fn.viewWidth) > 10) {
        //        console.log("loadHomeView");
        //        movieApp.fn.viewWidth = window.innerWidth;
        //    }

        //};

    };

    movieApp.fn.viewWidth = window.innerWidth;

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

        if (wBox.width > 600 && grid) {//make it horizontal

            rows = Math.floor(wBox.height / pHeight);
            grid.style.width = (pWidth * (l / rows)) + "px";
            grid.style.height = (rows * pHeight) + "px";

        } else {//make it vertical

            grid.style.width = "";
            grid.style.height = "";

        }

    };

}(window));
