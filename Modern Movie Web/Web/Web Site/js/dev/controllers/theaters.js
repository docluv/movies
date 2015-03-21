;

(function () {

	"use strict";

	movieApp.fn.theaters = movieController.extend({

		onload: function (params) {

			var tv = this,
				msdate = ".movie-showtime-date";

			tv.rootScope.setMainTitle(decodeURIComponent(params.theaterName));

			mData.InTheatersMovies(50, 1, function (data) {
				tv.renderTheaterMovies(data);
			});

			deeptissue(msdate).tap(function (e) {

				//removes from all the date elements
				$(msdate).removeClass("selected");

				e.currentTarget.classList.add("selected");

				//load "new" movie showtimes
				mData.InTheatersMovies(50, 1, function (data) {
					tv.renderTheaterMovies(data);
				});

			});
		},

		renderTheaterMovies: function (data) {

			if (!data) {
				return;
			}

			this.rootScope.viewEngine.bind(".movie-showtimes-wrapper", "MovieStartTimesTemplate", data);

			document.querySelector(".movie-showtimes-scroller").scrollTop = 0;
		}
	});

})();