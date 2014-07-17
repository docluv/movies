(function (window, undefined) {

    "use strict";

    movieApp.fn.aboutView = View.extend({

        onload: function () {
            
            console.log("load about");
            this.setMainTitle("about modern web movies");
        },

        unload: function () {

            console.log("unload about");

        },

        $rootScope: undefined,
        params: undefined,

    });

}(window));