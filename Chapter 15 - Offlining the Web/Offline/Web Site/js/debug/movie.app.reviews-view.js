/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

;

//http://developer.nytimes.com/docs/movie_reviews_api/
//003f5423c8182dca2684e2cdc804f925:16:60721682 
// http://api.nytimes.com/svc/movies/v2/reviews?api-key=003f5423c8182dca2684e2cdc804f925:16:60721682


function jsonpCallback(data) {
    console.dir(data);
};

(function () {

    "use strict";

    movieApp.fn.reviewsView = {

        onload: function () {

            this.setMainTitle("Current Reviews");

        },

        renderReviews : function (results) {

            this.mergeData(".new-article-list", "NewsHeadlineTemplate", results);

        },

        SendAjax : function (url, callbackFunction) {

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
        },

        ReceiveAjax : function (response, callbackFunction) {

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
        }

    };

}(window));