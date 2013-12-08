/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

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

        e = e || event;

        var that = this,
            target = e.target || e.srcElement,
            txtArea = /textarea/i.test((target).tagName),
            key = e.keyCode || e.which || e.charCode || 0,
            ret = txtArea || (key) !== 13;
        
        if (ret) {
            return false;
        }

        that.manageSearchIcons();

        if (key === 13) {

            e.preventDefault();

            that.searchForMovies();

        }

        return false;

    };

    movieApp.fn.loadSearchView = function (params) {

        var that = this,
            searchField = document.getElementById("searchTerm"),
            showToolbar = false;
        //clear the field just in case a previous value was entered and the markup not cleared from the page
        searchField.value = "";

        document.movieSearch.addEventListener("keypress", function (e) {
            that.searchKeyCheck.call(that, e);
        });

        searchField.addEventListener("focus", that.manageSearchIcons);
        searchField.addEventListener("blur", that.manageSearchIcons);

        that.searchForMovies(params.term);

        that.setMainTitle("Search");

        //document.movieSearch.submit = function (e) {

        //    e.preventDefault();

        //    that.searchForMovies();

        //    return false;
        //}

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
