
var movie = movieApp();

movie.setMovieGridSize();

window.addEventListener("resize", movie.setMovieGridSize);

window.addEventListener("orientationchange", movie.setMovieGridSize);
