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
    movie; //This would be equivalent to $rootScope in Angular;

movieApp.fn.privacyView = privacyView(data);

movie = movieApp({
	"viewEngine": rivetsVE,
	movieData: movieData(
        RottenTomatoes({ data: data }),
        fakeTheaters()
    )
});

_spa = spa({
    "appContext": movie,
    "viewEngine": rivetsVE,
    "defaultPage": "homeview",
    "viewWrapper": "#main",
    "viewTransition": "slide",
    "defaultTitle": "Modern Web Movies"
});

//movie.privacyView.foo();

//causes the Android and iPhone browser to scroll up to claim more real estate
//$().hideURLBar();