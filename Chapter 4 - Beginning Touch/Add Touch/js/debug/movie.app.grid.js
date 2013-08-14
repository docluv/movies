
;

(function (window, undefined) {

    movieApp.fn.setMovieGridSize = function(){
        
        var that = this,
            main = document.querySelector(".main-content")
            grid = document.querySelector(".movie-poster-div"),
            posters = document.querySelectorAll(".movie-target"),
            l = posters.length,
            pHeight = 170,
            pWidth = 120,
            wBox = {
                width: parseInt(main.clientWidth, 10),
                height: parseInt(main.clientHeight, 10)
            },
            rows = Math.floor(wBox.height / pHeight);

        if (wBox.width > 600) {//make it horizontal

            grid.style.width = (pWidth * (l / rows)) + "px";
            grid.style.height = (rows * pHeight) + "px";

        }else{//make it vertical

            grid.style.width = (pWidth * (l / rows)) + "px";
         //   articleTiles.style.height = "auto";
            
        }

    };

}(window));

