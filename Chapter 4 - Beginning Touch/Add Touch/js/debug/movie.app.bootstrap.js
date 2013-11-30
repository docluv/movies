
var movie = movieApp();

movie.setMovieGridSize();

movie.setupMQL("min600", "(min-width: 600px)", [{
    matchName: "setMovieGridSize",
    matchFunc: function(){
        movie.setMovieGridSize();
    },
    nomatchName: "setMovieGridSize",
    nomatchFunc: function(){
        movie.setMovieGridSize();
    }
}]);

