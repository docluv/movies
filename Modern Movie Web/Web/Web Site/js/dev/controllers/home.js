;

(function () {

	"use strict";

	movieApp.fn.home = movieController.extend({

		onload: function () {

		    var home = this;

			home.isVisible = true;

			home.rootScope.setupPanorama();
			home.rootScope.setMainTitle("Modern Web Movies");

			home.loadMovies();

			requestAnimationFrame(function () {
			    home.rootScope.panorama.resizePanorama();
			});

			home.setupMQLs();

		},

		mql600: undefined,
		mql1024: undefined,

		setupMQLs: function (hv) {

			var home = this;

			if (!home.mql600) {

			    home.mql600 = window.matchMedia("(min-width: 600px)");

			    home.mql600.addListener(function (e) {

			        home.updateMoviePosters(e);

				});

			}

			if (!home.mql1024) {

			    home.mql1024 = window.matchMedia("(min-width: 1024px)");

				home.mql1024.addListener(function (e) {

				    home.updateMoviePosters(e);

				});

			}

		},

		loadMovies: function () {

			var home = this,
				 //originally had 50. This is too many because it caused up to 100 movie poster
				 //image downloads when the application is launched. 10 should be enough for the 
				 //home effect. Also changed to a variable to get minification benefit and easier
				 //maintenance.
				count = 10;

			mData.InTheatersMovies(count, 1, function (data) {
				home.renderHomeMovies(".top-box-list", data);
			});

			mData.OpeningMovies(count, 1, function (data) {
				home.renderHomeMovies(".opening-movie-list", data);
			});

			mData.TopBoxOfficeMovies(count, 1, function (data) {
				home.renderHomeMovies(".movies-near-me-list", data);
			});

			mData.ComingSoonMovies(count, 1, function (data) {
				home.renderHomeMovies(".coming-soon-list", data);
			});

		},

		updateMoviePosters: function (e) {

		    var home = this;

		    if (home.isVisible) {

		        home.rootScope.setPosterSrc(".opening-movie-list .movie-grid-poster");
		        home.rootScope.setPosterSrc(".top-box-list .movie-grid-poster");
		        home.rootScope.setPosterSrc(".coming-soon-list .movie-grid-poster");
		        home.rootScope.setPosterSrc(".movies-near-me-list .movie-grid-poster");

			}

		},

		unload: function () {
			this.isVisible = false;
		},

		renderHomeMovies: function (target, data) {

			if (!data) {
				return;
			}

			var that = this;

			that.rootScope.viewEngine.bind(target, "MoviePosterGridTemplate", data);

			requestAnimationFrame(function () {
			    that.rootScope.setPosterSrc(target + " .movie-grid-poster");
			});

		}

	});

})();