;

(function () {

    "use strict";

    var View = Class.extend({

        init: function () {

        },

        version: "0.5.0",

        parseServices: function (services) {

            for (var service in services) {

                if (typeof services[service] === "function") {
                    this[service] = new services[service]();
                } else {
                    this[service] = services[service];
                }

            }

        },

        fn : this.prototype


    });

    return (window.View = View);

})();