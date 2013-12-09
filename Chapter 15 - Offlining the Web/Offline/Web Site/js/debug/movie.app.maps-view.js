/// <reference path="movie.app.js" />
/// <reference path="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0" />

(function (window, undefined) {

    "use strict";

    var fakeTheaters = ["The Mystic",
                    "The Marquee",
                    "The Pantagees",
                    "Regal 22",
                    "Rialto 16",
                    "AMC Stadium 20",
                    "AMC Loews Universal Cineplex 20",
                    "Regal Pointe Stadium 20 & IMAX",
                    "Touchstar Cinemas Southchase 7",
                    "Cinemark Festival Bay Mall"
    ];

    movieApp.fn.mapsView = {

        onload: function () {

            var that = this,
                mv = that.mapsView,
                title = "nearby";

            $.loadScript("bing-map-script", "http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0", function () {

                mv.loadNearbyTheaters.call(that);

            }, "head");

        },

        loadNearbyTheaters: function () {

            var that = this,
                mv = that.mapsView,
                map, i,
                key = "Ai2HABTSdPR3baDe6yPjFDNRac3RsbaFMjUb2d-OjlQd8o3vO2DcqRxBpDgRTuUD";

            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(function (position) {

                    map = new Microsoft.Maps.Map(document.getElementById('nearbyMap'), {
                        credentials: key,
                        center: new Microsoft.Maps.Location(position.coords.latitude,
                                                            position.coords.longitude),
                        mapTypeId: Microsoft.Maps.MapTypeId.road,
                        showScalebar: false,
                        showDashboard: false,
                        zoom: 12
                    });

                    //loop thorugh and place 10 random pushpins to represent theaters on the map
                    for (i = 0; i < 10; i++) {
                        mv.AddPushpin.call(that, position, map, fakeTheaters[i]);
                    }

                });

            }

        },

        AddPushpin: function (position, map, theaterName) {

            var that = this,
                mv = that.mapsView,
                  shape,
                  coords = mv.getRandomPoistion(position),
                  pin = new Microsoft.Maps.Pushpin(coords /*, { text: theaterName }*/);

            // Add a handler to the pushpin drag
            Microsoft.Maps.Events.addHandler(pin, 'click', function () {
                mv.goToTheaterFromMap(theaterName);
            });

            map.entities.push(pin);
        },

        goToTheaterFromMap: function (theaterName) {
            window.location.hash = "#!theater/" + theaterName;
        },

        getRandomPoistion: function (position) {

            var r = Math.floor((Math.random() * 5000) + 1) / 100000,
                  rl = Math.floor((Math.random() * 5500) + 1) / 100000,
                  pm = Math.round(Math.random()),
                  pm1 = Math.round(Math.random()),
                  coords = {};

            if (pm === 0) {
                r = parseFloat("-" + r);
            }

            if (pm1 === 0) {
                rl = parseFloat("-" + rl);
            }

            coords.latitude = position.coords.latitude + r;
            coords.longitude = position.coords.longitude + rl;

            return coords;
        }

    };

}(window));

