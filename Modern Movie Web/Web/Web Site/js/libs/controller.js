;

(function() {

    "use strict";

    var Controller = Class.extend({

        init: function(rootScope, response) {

            if (!rootScope) {
            	throw new ReferenceError( "The rootScope must be supplied to have a valid view");
            }

            this.response = response;
            this.rootScope = rootScope;
        },

        rootScope: undefined,

        response: undefined,

        bind: function(targetSelector, data) {

            var controller = this;

            if (controller.rootScope && controller.rootScope.viewEngine) {
           
                controller.rootScope.viewEngine.bind(targetSelector, data);


            } else {
                throw {
                    "Title": "Missing viewEngine",
                    "Message": "There is no accessible viewEngine"
                };
            }

        },

        version: "0.5.1",

        noResults: "<div class='no-results'>Sorry There are No Results Available</div>",

        mainTitle: document.querySelector(".view-title"),

        //setMainTitle: function(title) {

        //    this.mainTitle.textContent = document.title = title.toLowerCase();
        //},

        getRoute: function () {

            if (this.response !== undefined) {
                return this.response.path;
            }

            return window.location.hash.replace("#!", "");

        },

        getPath: function () {

            return window.location.hash.replace("#!", "");

        },

        getParams: function () {

            var path = this.getPath(),
                params = path.split("/:").slice(1);

            return params;
        },

        newRoute: function(route){
    
            window.location.hash = "#!" + route;

        }

    });

    return (window.Controller = Controller);

})();