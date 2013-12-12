
;

(function (window, undefined) {

    movieApp.fn.settingMovieGridSize = false;

    movieApp.fn.setMovieGridSize = function(){

        if(this.settingMovieGridSize){
            return;
        }
        
        var that = this,
            main = document.querySelector(".main-content"),
            grid = document.querySelector(".movie-poster-div"),
            posters = document.querySelectorAll(".movie-target"),
            l = posters.length,
            pHeight = 170, //poster height
            pWidth = 115, //poster width
            wBox = {
                width: parseInt(main.clientWidth, 10),
                height: parseInt(main.clientHeight, 10)
            },
            rows = 0, columns = 0;

        if (wBox.width > 600) {//make it horizontal

            rows = Math.floor(wBox.height / pHeight);
            grid.style.width = (pWidth * (l / rows)) + "px";
            grid.style.height = (rows * pHeight) + "px";

        }else{//make it vertical

            grid.style.width = "";
            grid.style.height = "";

        }

        that.settingMovieGridSize = false;

    };

}(window));

