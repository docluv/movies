;
//mustacheViewEngine is a deferred content managment library with single page and mobile applications in mind
(function (window, undefined) {

    "use strict";

    var mustacheViewEngine = function (settings) {

        var that = new mustacheViewEngine.fn.init();


        //if (!that.templateService) {
        //    console.error("must define a template service provider");
        //}

        return that;
    };

    mustacheViewEngine.fn = mustacheViewEngine.prototype = {

        constructor: mustacheViewEngine,

        init: function () {

            return this;
        },

        version: "0.0.1",

        bp: undefined,
        eventPrefix: "spa-",
        $rootScope: undefined,
        templateService: undefined,
        templateType: "text/x-mustache-template",
        appPrefix: "mustacheApp-",

        views: {},

        parseViews: function (remove) {

            var that = this,
                i, temp, viewMarkup,
                views = $.parseLocalStorage(that.appPrefix + "views"),
                t = document.querySelectorAll("script[type='" + that.templateType + "']");

            if (remove === undefined) {
                remove = true; //default setting
            }

            for (i = 0; i < t.length; i++) {

                temp = t[i];
                viewMarkup = temp.innerHTML.replace(/(\r\n|\n|\r)/gm, "");

                views[temp.id] = viewMarkup;

                if (remove) {

                    if (temp.parentNode) {
                        temp.parentNode.removeChild(temp);
                    }
                }

            }

            that.setViews(views);

            localStorage.setItem(that.appPrefix + "views", JSON.stringify(views));

        },

        getView: function (viewId) {
            return this.views[viewId];
        },

        getViews: function () {
            return this.views
        },

        setView: function (viewId, view) {

            if (typeof view === "string") {
                this.views[viewId] = Mustache.compile(view);
            }

        },

        setViews: function (views) {

            var that = this,
                view;

            for (view in views) {
                that.setView(view, views[view]);
            }

        },

        compileViews: function (views) {

            var that = this,
                i;

            if (views === undefined || views.length === 0) {
                that.parseViews();
                views = that.getViews();
            }

            for (i in views) {
                if (typeof views[i] === "function") {
                    views[i] = views[i];
                } else {
                    views[i] = Mustache.compile(views[i]);
                }
            }

        },

        addViews: function (views) {
    
            var that = this,
                name, copy;

            for (name in views) {
                //  src = target[name];
                copy = views[name];

                // Prevent never-ending loop
                if (that.views === copy) {
                    continue;
                }

                if (copy !== undefined) {
                    that.views[name] = copy;
                }
            }

            that.saveViews();

        },

        saveViews: function () {

            var that = this;

            localStorage.setItem(that.appPrefix + "views", that.views);

        },

        storeView: function (view) { },

        storeViews: function () { },

        removeView: function (key) {

            delete this.views[key];

        },

        mergeData: function (targetSelector, templateName, data) {

            if ((typeof targetSelector !== "string") ||
               (typeof templateName !== "string") ||
                data === undefined) {

                throw {
                    Name: "mustacheViewEngine Error",
                    Description: "missing argument in mergeData"
                }

                return;
            }

            var that = this,
                t = document.querySelector(targetSelector);

            //verify it is a single node.
            if (t.length && t.length > 0) {
                t = t[0];
            }

            if (that.views[templateName]) {

                requestAnimationFrame(function () {

                    t.innerHTML = that.views[templateName](data);

                });

            }

        }

    };

    // Give the init function the mustacheViewEngine prototype for later instantiation
    mustacheViewEngine.fn.init.prototype = mustacheViewEngine.fn;

    return (window.mustacheViewEngine = mustacheViewEngine);

})(window);
