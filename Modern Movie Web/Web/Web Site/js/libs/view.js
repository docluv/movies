

(function () {

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

            if (that.rootScope.templates[templateName]) {
                requestAnimationFrame(function () {
                    t.innerHTML = that.rootScope.templates[templateName](data);
                });
                //t.innerHTML = that.templates[templateName](data);
            }

        }


    });

    return (window.View = View);

})();