

(function (window, undefined) {

    "use strict";


    movieApp.fn.searchForMovies = function () {

        var that = this,
            value = document.getElementById("searchTerm").value;

        if (value !== "") {

            that.SearchMovies(that.settings.SearchCount, 1, value, function (data) {

                if (data && data.movies) {

                    this.mergeData(".search-results-list", "movieThumbsGridTemplate", data);

                }

            });

        }

    };

    movieApp.fn.searchKeyCheck = function (e) {

        var that = this,
            searchEle = e.target,
            searchClear = document.querySelector(".search-clear"),
            searchIcon = document.querySelector(".search-icon");

        if (key === 13) {

            e.preventDefault();

            that.searchForMovies();

            //dealing with the way Android does the keypad overlay
         //   that.toolBar.show();

        } //else {

            //if (searchEle.value !== "") {
            //    searchClear.show();
            //    searchIcon.hide();
            //} else {
            //    searchClear.hide();
            //    searchIcon.show();
            //}

    //    }

    };

    movieApp.fn.loadSearchView = function () {

        var that = this,
            searchField = document.getElementById("searchTerm"),
            showToolbar = false;
        //function (e) {
        //        that.toolBar.show();
        //    };

        searchField.value = "";

    //    searchField.addEventListener("blur", showToolbar);
        searchField.addEventListener("keyup", that.searchKeyCheck);

    //    that.hideHeader();

   //     that.setBaseToolbar();

        that.searchKeyCheck();

    }


}(window));
