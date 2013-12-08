(function (window, undefined) {

    "use strict";

    //var aboutView = function (customSettings) {

    //    return;

    //};

    //aboutView.fn = aboutView.prototype = {

    //    constructor: aboutView,

    //    init: function () {
    //        return this;
    //    }

    //};

    //aboutView.fn.init.prototype = aboutView.fn;

    //return (window.aboutView = aboutView);


    movieApp.fn.aboutView = {

        onload: function () {

            console.log("load about");

        },

        unload: function () {

            console.log("unload about");

        }

    };


   // return (movieApp.fn.aboutView = aboutView);

}(window));