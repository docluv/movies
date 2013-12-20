/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

(function (window, undefined) {

    "use strict";

    movieApp.fn.searchView = {

        onload: function (params) {

            var that = this,
                sv = that.searchView,
                searchField = document.getElementById("searchTerm"),
                showToolbar = false;
            //clear the field just in case a previous value was entered and the markup not cleared from the page
            searchField.value = "";

            document.movieSearch.addEventListener("keypress", function (e) {
                sv.searchKeyCheck.call(that, e);
            });

            searchField.addEventListener("focus", that.manageSearchIcons);
            searchField.addEventListener("blur", that.manageSearchIcons);

            sv.searchForMovies.call(that, params.term);

            that.setMainTitle("Search");

        },

        searchForMovies : function (term) {

            var that = this,
                sv = that.searchView,
                value = term || document.getElementById("searchTerm").value;

            if (value !== "") {

                that.rt.SearchMovies(that.settings.SearchCount, 1, value, function (data) {

                    if (data && data.total > 0 && data.movies) {

                        document.querySelector(".movie-poster-div").innerHTML = "";
                        document.querySelector(".xy-scroller-wrapper").scrollLeft = 0;
                        that.mergeData(".movie-poster-div", "MoviePosterGridTemplate", data);

                        that.setMoviePanelWidth(".movie-poster-div", data.movies.length);

                        requestAnimationFrame(function () {
                            that.setPosterSrc(".movie-grid-poster");
                        });
                        
                        window.addEventListener("resize", function () {
                            that.setMoviePanelWidth(".movie-poster-div", data.movies.length);
                            that.setPosterSrc(".movie-grid-poster");
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

            var that = this,
                sv = that.searchView,
                target = e.target || e.srcElement,
                txtArea = /textarea/i.test((target).tagName),
                key = e.keyCode || e.which || e.charCode || 0,
                ret = txtArea || (key) !== 13;
        
            if (ret) {
                return false;
            }

            sv.manageSearchIcons.call(that);

            if (key === 13) {

                e.preventDefault();

                sv.searchForMovies.call(that);

            }

            return false;

        },

        manageSearchIcons : function (e) {

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

    }


}(window));
