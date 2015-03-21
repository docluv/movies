;

(function () {

	"use strict";

	movieApp.fn.maps = movieController.extend({

		onload: function () {

		    var mv = this;

			mv.rootScope.setMainTitle("theaters near you");

			$().loadScript("bing-map-script", "http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0", function () {

				mv.loadNearbyTheaters();

			}, "head");

		},

		loadNearbyTheaters: function () {

			var mv = this,
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

					theaters = mData.nearbyTheaters(position.coords.latitude,
															position.coords.longitude);

					//loop thorugh and place 10 random pushpins to represent theaters on the map
					for (i = 0; i < theaters.length; i++) {
						mv.AddPushpin(map, theaters[i]);
					}

					//add fake theater load

				});

			}

		},

		AddPushpin: function (map, theater) {

			var mv = this,
				  shape,
				  pin = new Microsoft.Maps.Pushpin({
					  latitude: theater.latitude,
					  longitude: theater.longitude
				  });

			// Add a handler to the pushpin drag
			Microsoft.Maps.Events.addHandler(pin, 'click', function () {
				mv.goToTheaterFromMap(theater.name);
			});

			map.entities.push(pin);
		},

		goToTheaterFromMap: function (theaterName) {
			window.location.hash = "#!theater/" + theaterName;
		}

	});

})();