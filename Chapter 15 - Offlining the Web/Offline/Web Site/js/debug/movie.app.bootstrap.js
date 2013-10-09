
var bp = backpack(),
    data = rqData(),
    movie = movieApp({
        bp: bp,
        data: data,
        tmpl: Mustache
    }),

 //data = jqData(),
    _spa = spa({
        "bp": bp,
        "defaultPage": "homeview", "viewWrapper": "#main",
        "viewTransition": "slide", "defaultTitle": "Modern Web Movies"
    });


//causes the Android and iPhone browser to scroll up to claim more real estate
$.hideUrlBar();