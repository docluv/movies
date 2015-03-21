;

(function () {

    "use strict";

    movieApp.fn.search = movieController.extend({

        onload: function (params) {

            var sv = this,
                searchField = document.getElementById("searchTerm");

            //clear the field just in case a previous value was entered and the markup not cleared from the page
            searchField.value = "";

            document.movieSearch.addEventListener("keypress", function (e) {
                sv.searchKeyCheck(e);
            });

            searchField.addEventListener("focus", sv.rootScope.manageSearchIcons);
            searchField.addEventListener("blur", sv.rootScope.manageSearchIcons);

            sv.searchForMovies(params.term);

            sv.rootScope.setMainTitle("Search");

        },

        searchForMovies: function (term) {

            var sv = this,
                value = term || document.getElementById("searchTerm").value;

            if (value !== "") {

                mData.SearchMovies(sv.rootScope.settings.SearchCount, 1, value, function (data) {

                    if (data && data.total > 0 && data.movies) {

                        document.querySelector(".movie-poster-div").innerHTML = "";
                        document.querySelector(".xy-scroller-wrapper").scrollLeft = 0;
                        sv.rootScope.viewEngine.bind(".movie-poster-div", "MoviePosterGridTemplate", data);

                        sv.rootScope.setMoviePanelWidth(".movie-poster-div", data.movies.length);

                        requestAnimationFrame(function () {
                            sv.rootScope.setPosterSrc(".movie-grid-poster");
                        });

                        window.addEventListener("resize", function () {
                            sv.rootScope.setMoviePanelWidth(".movie-poster-div", data.movies.length);
                            sv.rootScope.setPosterSrc(".movie-grid-poster");
                        });

                    } else {
                        document.querySelector(".movie-poster-div").innerHTML = that.noResults;
                    }

                });

            }

        },

        searchKeyCheck: function (e) {

            //http://stackoverflow.com/questions/585396/how-to-prevent-enter-keypress-to-submit-a-web-form

            e = e || event;

            var sv = this,
                target = e.target || e.srcElement,
                txtArea = /textarea/i.test((target).tagName),
                key = e.keyCode || e.which || e.charCode || 0,
                ret = txtArea || (key) !== 13;

            if (ret) {
                return false;
            }

            sv.manageSearchIcons();

            if (key === 13) {

                e.preventDefault();

                sv.searchForMovies();

            }

            return false;

        },

        manageSearchIcons: function (e) {

            var searchField = document.getElementById("searchTerm"),
                searchIcon = document.querySelector(".search-input-icon");

            if (searchField.value != "") {
                searchField.style.width = "100%";
                searchIcon.style.display = "none";
            } else {
                searchIcon.style.display = "inline-block";
                searchField.style.width = "";
            }

        }

    });

})();