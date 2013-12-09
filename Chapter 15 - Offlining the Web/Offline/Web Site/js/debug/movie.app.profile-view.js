
;

(function (window, undefined, movie) {

    "use strict";

    var profileView = function (xData) {

        return new profileView.fn.init(xData);

    };

    profileView.fn = profileView.prototype = {

        constructor: profileView,

        init: function (xData) {

            this.data = xData;

            return this;
        },

        foo: function () {

            console.info("and we were kung foo fighting ;)");

        },

        onload: function () {

            console.log("load profileView");

        },

        unload: function () {

            console.log("unload profileView");

        }

    };

    profileView.fn.init.prototype = profileView.fn;

    return (window.profileView = profileView);


}(window, movieApp));