
;

(function (window, undefined) {

    movieApp.fn.setMovieGridSize = function(){
        
        var that = this,
            grid = document.querySelector(".movie-poster-div"),
            posters = document.querySelectorAll(".movie-target"),
            l = posters.length,
            pHeight = 170, //poster height
            pWidth = 120, //poster width
            wBox = {
                width: parseInt(grid.clientWidth, 10),
                height: parseInt(grid.clientHeight, 10)
            },
            rows = 0, columns = 0;

        if (wBox.width > 600) {//make it horizontal

            rows = Math.floor(wBox.height / pHeight);
            grid.style.width = (pWidth * (l / rows)) + "px";
            grid.style.height = (rows * pHeight) + "px";

        }else{//make it vertical

            
            //columns = Math.floor(wBox.width / pWidth);
            //grid.style.width = (pWidth * columns) + "px";
            grid.style.width = "";
            grid.style.height = "";

            //grid.style.marginLeft = "";
            
        }

    };

}(window));

