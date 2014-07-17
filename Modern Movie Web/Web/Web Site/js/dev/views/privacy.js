
;

(function (window, undefined, movie) {

    "use strict";

    movieApp.fn.privacyView = View.extend({

        init: function () {

        },

        onload: function () {

            console.log("load privacyView");

            this.setMainTitle("Privacy Policy");

        },

        unload: function () {

            console.log("unload privacyView");

        }

    });
    
}(window, movieApp));