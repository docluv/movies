

(function (window, undefined) {

    "use strict";


    movieApp.fn.searchForMovies = function (term) {

        var that = this,
            value = term || document.getElementById("searchTerm").value;

        if (value !== "") {

            that.SearchMovies(that.settings.SearchCount, 1, value, function (data) {

                if (data && data.movies) {

                    that.mergeData(".movie-poster-div", "MoviePosterGridTemplate", data);

                }

            });

        }

    };

    movieApp.fn.searchKeyCheck = function (e) {

        if (!e) {
            return;
        }

        var that = this,
            searchEle = e.target,
            searchClear = document.querySelector(".search-clear"),
            searchIcon = document.querySelector(".search-icon");

        if (e.which === 13) {

            e.preventDefault();

            that.searchForMovies();

        }

    };

    movieApp.fn.loadSearchView = function (params) {

        var that = this,
            searchField = document.getElementById("searchTerm"),
            showToolbar = false;

        searchField.value = "";

    //    searchField.addEventListener("blur", showToolbar);
        searchField.addEventListener("keyup", function(e){
            that.searchKeyCheck.call(that, e);
        });

        that.searchForMovies(params.term);

        that.setMainTitle("Search");

        this.panorama = undefined;

    }


}(window));
