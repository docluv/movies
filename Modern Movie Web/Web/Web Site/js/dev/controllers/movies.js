;

(function () {

	"use strict";

	movieApp.fn.movies = movieController.extend({

		onload: function (params) {

			var mv = this,
				movieType = params.movieType || "TopBoxOffice";

			mv.isVisible = true;

			mData[movieType + "Movies"](50, 1, function (data) {
				mv.renderMovies(data);
			});

			mv.rootScope.setMainTitle(mv.rootScope.movieTypes[movieType]);

		},

		mql600: undefined,
		mql1024: undefined,

		renderMovies: function (data) {

			if (!data) {
				return;
			}

			var mv = this;

			mv.rootScope.setMoviePanelWidth(".movie-poster-div", data.movies.length);

			mv.setupMQLs(data.movies.length);

			mv.rootScope.viewEngine.bind(".movie-poster-div", "MoviePosterGridTemplate", data);

			requestAnimationFrame(function () {
			    mv.rootScope.setPosterSrc(".movie-grid-poster");
			});
		},

		setupMQLs: function (length) {

			var mlv = this;

			if (!mlv.mql600) {

				mlv.mql600 = window.matchMedia("(min-width: 600px)");

				mlv.mql600.addListener(function () {

					mlv.updateLayout(length);

				});

			}

			if (!mlv.mql1024) {

				mlv.mql1024 = window.matchMedia("(min-width: 1024px)");

				mlv.mql1024.addListener(function () {

					mlv.updateLayout(length);

				});

			}

		},

		updateLayout: function (length) {

			var mv = this;

			if (mv.isVisible) {

				mv.rootScope.setMoviePanelWidth(".movie-poster-div", length);
				mv.rootScope.setPosterSrc(".movie-grid-poster");

			}

		},

		unload: function () {
			this.isVisible = false;
		}

	});

})();