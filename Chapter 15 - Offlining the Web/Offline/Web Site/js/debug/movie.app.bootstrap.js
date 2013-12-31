
var bp = backpack(),
    data = rqData(),
    movie;

movieApp.fn.privacyView = privacyView(data);

movie = movieApp({
    bp: bp,
    tmpl: Mustache,
    movieData: movieData(
        RottenTomatoes({ data: data }),
        fakeTheaters()
    )
});

_spa = spa({
    "appContext": movie,
    "bp": bp,
    "defaultPage": "homeview",
    "viewWrapper": "#main",
    "viewTransition": "slide",
    "defaultTitle": "Modern Web Movies"
});

//movie.privacyView.foo();

//causes the Android and iPhone browser to scroll up to claim more real estate
//$().hideURLBar();