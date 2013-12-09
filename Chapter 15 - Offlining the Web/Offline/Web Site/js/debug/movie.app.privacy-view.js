
;

(function (window, undefined, movie) {

    "use strict";

    var privacyView = function (xData) {

        return new privacyView.fn.init(xData);

    };

    privacyView.fn = privacyView.prototype = {

        constructor: privacyView,

        init: function (xData) {

            this.data = xData;

            return this;
        },

        foo: function () {

            console.info("and we were kung fu fighting, but privately ;)");

        },

        onload: function () {

            console.log("load privacyView");

            this.setMainTitle("Privacy Policy");

        },

        unload: function () {

            console.log("unload privacyView");

        }

    };

    privacyView.fn.init.prototype = privacyView.fn;

    return (window.privacyView = privacyView);


}(window, movieApp));