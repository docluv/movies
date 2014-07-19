(function (window, undefined) {

    "use strict";

    movieApp.fn.aboutView = View.extend({

        init: function () {
            this._super.apply(this, arguments);
        },

        onload: function () {
            
            console.log("load about");
            this.setMainTitle("about modern web movies");
        },

        unload: function () {

            console.log("unload about");

        }

    });

}(window));