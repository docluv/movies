
;

(function (window, undefined) {

    movieApp.fn.setMovieGridSize = function(){
        
        var that = this,
            posters = document.querySelectorAll(".movie-target"),
            l = posters.length,
            wBox = {
                width: parseInt(window.innerWidth, 10),
                height: parseInt(window.innerHeight, 10)
            },
            rows = Math.floor(wBox.height / 145);

        if (wBox.width > 600) {//make it vertical

            articleTiles.style.width = (100 * (l / rows)) + "px";
            articleTiles.style.height = (rows * 145) + "px";

        }else{//make it horizontal

            articleTiles.style.width = (100 * (l / rows)) + "px";
            articleTiles.style.height = "auto";
            
        }

    };

}(window));