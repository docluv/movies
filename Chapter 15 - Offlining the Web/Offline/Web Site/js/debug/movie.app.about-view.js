(function (window, undefined) {

    "use strict";

    var aboutView = function () {

        function load() {

            console.log("load about");

        };

        function unload() {

            console.log("unload about");

        };


    };


    return (movieApp.fn.aboutView = aboutView);

}(window));