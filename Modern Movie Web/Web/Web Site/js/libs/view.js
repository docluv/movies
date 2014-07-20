;

(function () {

    "use strict";

    var View = Class.extend({

        init: function (rootScope) {
            this.rootScope = rootScope;
        },

        rootScope:undefined,

        mergeData: function (targetSelector, templateName, data) {

            if ((typeof targetSelector !== "string") ||
               (typeof templateName !== "string") ||
                (data === undefined || data === null)) {
                console.error("missing argument in mergeData");
                return;
            }

            var that = this,
                t = document.querySelector(targetSelector);

            //verify it is a single node.
            if (t.length && t.length > 0) {
                t = t[0];
            }

            if (that.rootScope.viewEngine.getViews()[templateName]) {
                requestAnimationFrame(function () {
                    t.innerHTML = that.rootScope.templates[templateName](data);
                });
                //t.innerHTML = that.templates[templateName](data);
            }

        },

        version: "0.5.0",

        noResults: "<div class='no-results'>Sorry There are No Results Available</div>",

        mainTitle: document.querySelector(".view-title"),

        setMainTitle: function (title) {

            this.mainTitle.textContent = document.title = title.toLowerCase();
        }

    });

    return (window.View = View);

})();