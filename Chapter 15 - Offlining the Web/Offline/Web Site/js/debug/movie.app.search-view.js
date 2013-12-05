

(function (window, undefined) {

    "use strict";

    movieApp.fn.searchForMovies = function (term) {

        var that = this,
            value = term || document.getElementById("searchTerm").value;

        if (value !== "") {

            that.SearchMovies(that.settings.SearchCount, 1, value, function (data) {

                if (data && data.total > 0 && data.movies) {

                    that.mergeData(".movie-poster-div", "MoviePosterGridTemplate", data);

                } else {
                    document.querySelector(".movie-poster-div").innerHTML = that.noResults;
                }

            });

        }

    };

    movieApp.fn.searchKeyCheck = function (e) {

        if (!e) {
            return;
        }

        var that = this,
            searchEle = e.target;

        that.manageSearchIcons();

        if (e.which === 13) {

            e.preventDefault();

            that.searchForMovies();

        }

    };

    movieApp.fn.loadSearchView = function (params) {

        var that = this,
            searchField = document.getElementById("searchTerm"),
            showToolbar = false;
        //clear the field just in case a previous value was entered and the markup not cleared from the page
        searchField.value = "";

        searchField.addEventListener("keyup", function (e) {
            that.searchKeyCheck.call(that, e);
        });

        searchField.addEventListener("focus", that.manageSearchIcons);
        searchField.addEventListener("blur", that.manageSearchIcons);

        that.searchForMovies(params.term);

        that.setMainTitle("Search");

    }

    movieApp.fn.manageSearchIcons = function (e) {

        var searchField = document.getElementById("searchTerm"),
            searchIcon = document.querySelector(".search-input-icon");

        if (searchField.value != "") {
            searchField.style.width = "100%";
            searchIcon.style.display = "none";
        } else {
            searchIcon.style.display = "inline-block";
            searchField.style.width = "";
        }

    };

}(window));
