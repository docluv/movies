
var movie = movieApp();

movie.setMovieGridSize();


 window.matchMedia("(min-width: 600px)")
    .addListener(function (e) {

        movie.setMovieGridSize();

    });

