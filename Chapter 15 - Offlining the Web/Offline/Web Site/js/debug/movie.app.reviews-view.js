/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

;

//http://developer.nytimes.com/docs/movie_reviews_api/

function jsonpCallback(data) {
    console.dir(data);
};

(function () {

    "use strict";

    movieApp.fn.loadReviewsView = function () {

        this.setMainTitle("Current Reviews");

    };

    movieApp.fn.renderReviews = function (results) {

        //        if (results && results.articles && results.articles.length > 0) {
        this.mergeData(".new-article-list", "NewsHeadlineTemplate", results);

        //} else {

        //    document.querySelector(".new-article-list")
        //                .innerHTML = "<h2>Sorry No News Available</h2>";
        //      }

    };


    movieApp.fn.SendAjax = function (url, callbackFunction) {

        var request;

        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }

        request.open("GET", url, true);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                if (request.responseText) {
                    ReceiveAjax(request.responseText, callbackFunction);
                }
            }
        }

        request.send(null);
    };

    movieApp.fn.ReceiveAjax = function (response, callbackFunction) {

        var doc;

        if (window.ActiveXObject) {

            doc = new ActiveXObject("Microsoft.XMLDOM");
            doc.async = "false";
            doc.loadXML(response);

        } else {

            var parser = new DOMParser();
            doc = parser.parseFromString(response, "text/xml");

        }

        callbackFunction(doc.documentElement);
    };



}(window));