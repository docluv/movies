

(function (window, undefined) {

    "use strict";

    movieApp.fn.loadHomeView = function () {

        console.log("loadHomeView");

        var that = this;

//        this.showLoading(".article-tiles");

        that.setMovieGridSize();

    };

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

            grid.style.width = "";
            grid.style.height = "";

        }

    };

}(window));
