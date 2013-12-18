
var bp = backpack(),
    data = rqData(),
    rt = RottenTomatoes({data: data}),
    movie;

movieApp.fn.privacyView = privacyView(data);

movie = movieApp({
    bp: bp,
    data: data,
    tmpl: Mustache,
    rt: rt
});

_spa = spa({
    "appContext": movie,
    "bp": bp,
    "defaultPage": "homeview",
    "viewWrapper": "#main",
    "viewTransition": "slide",
    "defaultTitle": "Modern Web Movies"
});

movie.privacyView.foo();

//causes the Android and iPhone browser to scroll up to claim more real estate
$().hideURLBar();