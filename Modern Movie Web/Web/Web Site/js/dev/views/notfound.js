(function (window, undefined) {

    "use strict";

    movieApp.fn.notfoundView = View.extend({


        onload: function () {

            var img = document.querySelector(".not-found-img");

            if (img) {
                img.src = img.getAttribute("data-src");
            }

            this.setMainTitle("Sorry the Content You Reqested is Not Available");
        }

    });

}(window));