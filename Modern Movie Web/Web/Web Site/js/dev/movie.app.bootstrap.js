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


var data = rqData(),
    lsCache = l2Storeagecache(),
    mustacheVE = mustacheViewEngine({
        "appName": "Match",
        "appPrefix": "match-"
    }),
    pm = SPAPM({
        viewEngine: mustacheVE,
        cache: lsCache,
        "appPrefix": "match-"
    }),
    mData = movieData(
        RottenTomatoes({ data: data }),
        fakeTheaters()
    ),

    movie; //This would be equivalent to $rootScope in Angular;

movie = movieApp({
    services: {
        "viewEngine": mustacheVE
    }
});

_spa = SPA({
    "appContext": movie,
    "viewEngine": mustacheVE,
    "pm": pm,
    "viewSelector": "[type='text/x-mustache-template']",
    "defaultPage": "index",
    "viewWrapper": "#main",
    "viewTransition": "slide",
    "defaultTitle": "SPA Movies"
});

