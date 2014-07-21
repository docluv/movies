/// <reference path="movie.app.js" />
/// <reference path="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0" />

(function (window, undefined) {

    "use strict";

    movieApp.fn.mapsView = View.extend({


        onload: function () {

            var that = this;

            that.setMainTitle("theaters near you");

            $().loadScript("bing-map-script", "http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0", function () {

                that.loadNearbyTheaters();

            }, "head");

        },

        loadNearbyTheaters: function () {

            var that = this,
                map, i, theaters = [],
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

                    theaters = that.rootScope.dataProvider.nearbyTheaters(position.coords.latitude,
                                                            position.coords.longitude);

                    //loop thorugh and place 10 random pushpins to represent theaters on the map
                    for (i = 0; i < theaters.length; i++) {
                        that.AddPushpin(map, theaters[i]);
                    }

                    //add fake theater load

                });

            }

        },

        AddPushpin: function (map, theater) {

            var that = this,
                  shape,
                  pin = new Microsoft.Maps.Pushpin({
                      latitude: theater.latitude,
                      longitude: theater.longitude
                  });

            // Add a handler to the pushpin drag
            Microsoft.Maps.Events.addHandler(pin, 'click', function () {
                that.goToTheaterFromMap(theater.name);
            });

            map.entities.push(pin);
        },

        goToTheaterFromMap: function (theaterName) {
            window.location.hash = "#!theater/" + theaterName;
        },

    });

}(window));

