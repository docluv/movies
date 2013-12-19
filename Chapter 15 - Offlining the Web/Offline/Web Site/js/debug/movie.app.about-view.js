(function (window, undefined) {

    "use strict";

    movieApp.fn.aboutView = {

        onload: function () {

            console.log("load about");
            this.setMainTitle("about modern web movies");
        },

        unload: function () {

            console.log("unload about");

        }

    };

}(window));