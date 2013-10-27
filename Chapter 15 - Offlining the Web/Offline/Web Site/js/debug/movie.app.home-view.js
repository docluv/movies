


(function (window, undefined) {

    "use strict";

    movieApp.fn.unloadHomeView = function () {
        delete this.resizeEvents["manageHomeView"];
    //    this.panorama.clearPanoramaSettings();
     //   this.panorama = undefined;

    };

    movieApp.fn.loadHomeView = function () {

        var that = this;

        that.setupPanorama();
        that.setMainTitle("Modern Web Movies");

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

        that.setPanoramaWidth();

        var i = 0,
            vPanels = document.querySelectorAll(".panel-v-scroll");

        that.resizeEvents["manageHomeView"] = that.setPanoramaWidth;

    };

    movieApp.fn.viewWidth = window.innerWidth;

    movieApp.fn.setPanoramaWidth = function () {

        var that = this,
            i = 0,
            peekWidth = (that.viewWidth > 600) ? 50 : 30,
            panelWidth = (that.viewWidth - peekWidth),
            panoramaWrapper = document.querySelector(".panorama-panels"),
            panels = document.querySelectorAll(".single-panel"),
            movieGrids = document.querySelectorAll(".movie-poster-grid"),
            gridHeight = getGridHeight(parseInt(panoramaWrapper.style.height, 10));

        for (; i < panels.length; i++) {
            panels[i].style.width = panelWidth + "px";
        }

        if (panoramaWrapper) {
            panoramaWrapper.style.width = (panels.length * panelWidth) + "px";
        }

        that.panorama.resizePanorama();

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

    function getGridHeight (baseHeight) {

        var wWidth = window.innerWidth;

        if (wWidth <= 600) {
            return baseHeight - 32;
        } else if (wWidth > 600 && wWidth <= 1024) {
            return Math.floor(baseHeight /200) * 200;
        } else if (wWidth > 1024) {
            return (Math.floor(baseHeight / 200) * 200) + 20 ;
        }


    };

}(window));
