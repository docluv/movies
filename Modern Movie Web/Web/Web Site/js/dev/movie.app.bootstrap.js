window.applicationCache.addEventListener('updateready', function (e) {
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        // Browser downloaded a new app cache.
        // Swap it in and reload the page to get the new hotness.
        window.applicationCache.swapCache();
        if (confirm('A new version of this site is available. Load it?')) {
            window.location.reload();
        }
    } else {
        // Manifest didn't changed. Nothing new to server.
        console.info("Manifest didn't changed. Nothing new to server.");
    }
}, false);



var bp = backpack(),
    data = rqData(),
    movie = movieApp({
        "viewEngine": mustacheViewEngine(),
        services: {
            bp: bp,
            tmpl: Mustache, //remove
            dataProvider: movieData({
                RottenTomatoes: RottenTomatoes({ data: data }),
                fakeTheaters: fakeTheaters()
            })
        }
    });

_spa = spa({
    "appContext": movie,
    "bp": bp,
    "viewEngine": mustacheViewEngine(),
    "defaultPage": "homeview",
    "viewWrapper": "#main",
    "viewTransition": "slide",
    "defaultTitle": "Modern Web Movies"
});
