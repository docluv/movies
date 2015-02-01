/// <reference path="rivets.min.js" />


;
//RivetsViewEngine is a deferred content management library with single page and mobile applications in mind
(function (window, undefined) {

    "use strict";

    var RivetsViewEngine = function (settings) {

        var rivetsViewEngine = new RivetsViewEngine.fn.init();


        return rivetsViewEngine;
    };

    RivetsViewEngine.fn = RivetsViewEngine.prototype = {

        constructor: RivetsViewEngine,

        init: function () {

            return this;
        },

        version: "0.0.1",

        eventPrefix: "spa-",
        templateService: undefined,
        templateType: "[type='text/x-Rivets-template']",
        appPrefix: "RivetsApp-",

        views: {},

        //required function
        parseViews: function (remove) {

            var rivetsViewEngine = this,
                i, temp, viewMarkup,
                views = JSON.parse(localStorage.getItem(rivetsViewEngine.appPrefix + "views")),
                t = document.querySelectorAll(rivetsViewEngine.templateType);

            views = views || {};

            if (remove === undefined) {
                remove = true; //default setting
            }

            for (i = 0; i < t.length; i++) {

                temp = t[i];
                viewMarkup = temp.outerHTML.replace(/(\r\n|\n|\r)/gm, "");

                views[temp.id] = viewMarkup;

                if (remove) {

                    if (temp.parentNode) {
                        temp.parentNode.removeChild(temp);
                    }
                }

            }

            rivetsViewEngine.setViews(views);

        },

        createChildView: function (route) {

            //only return the layout and the child view if the layout does not already exist.

            var rivetsViewEngine = this,
                //layout = document.getElementById(route.layout),
                layout,
                view,
                viewAnchor;

            //            if (!layout) {

            layout = rivetsViewEngine.views[route.layout];

            if (layout) {

                layout = rivetsViewEngine.createFragment(layout);
                layout = layout.firstChild;

                viewAnchor = layout.querySelector(".spa-child-view");

                if (viewAnchor) {
                    viewAnchor.innerHTML = rivetsViewEngine.views[route.viewId];
                }

                return layout.outerHTML;
            } else {

                view = rivetsViewEngine.createFragment(rivetsViewEngine.views[route.viewId]);
                return view.outerHTML;
            }

            return;

            //}

            //return rivetsViewEngine.views[route.viewId];

        },

        createFragment: function (htmlStr) {

            var// frag = document.createDocumentFragment(),
                temp = document.createElement("div");

            temp.innerHTML = htmlStr;

            //            frag.appendChild(temp);

            return temp;
        },

        //required function
        getView: function (route) {

            var rivetsViewEngine = this;

            if (route.layout) {

                return rivetsViewEngine.createChildView(route);

            } else {

                return rivetsViewEngine.views[route.viewId];

            }

        },

        getViews: function () {
            return this.views
        },

        setView: function (viewId, view) {

            if (typeof view === "string") {

                this.views[viewId] = view;
                this.saveViews();

            }

        },

        setViews: function (views) {

            var rivetsViewEngine = this,
                view;

            for (view in views) {
                rivetsViewEngine.setView(view, views[view]);
            }

        },

        addViews: function (views) {

            var rivetsViewEngine = this,
                name, copy;

            for (name in views) {
                //  src = target[name];
                copy = views[name];

                // Prevent never-ending loop
                if (rivetsViewEngine.views === copy) {
                    continue;
                }

                if (copy !== undefined) {
                    rivetsViewEngine.views[name] = copy;
                }
            }

            rivetsViewEngine.saveViews();

        },

        saveViews: function () {

            var rivetsViewEngine = this;

            localStorage.setItem(rivetsViewEngine.appPrefix + "views", JSON.stringify(rivetsViewEngine.views));

        },

        removeView: function (key) {

            delete this.views[key];
            this.saveViews();


        },

        boundView: undefined,

        bind: function (targetSelector, model) {

            if ((typeof targetSelector === "string") && model === undefined) {

                throw {
                    Name: "RivetsViewEngine Error",
                    Description: "missing argument in mergeData"
                }

                return;
            }

            if ((typeof targetSelector === "object")) {
                model = targetSelector;
                targetSelector = "body";
            }

            var rivetsViewEngine = this,
                t = document.querySelector(targetSelector);


            if (rivetsViewEngine.boundView) {
                rivetsViewEngine.boundView.unbind();
            }


            //verify it is a single node.
            if (t.length && t.length > 0) {
                t = t[0];
            }

            rivetsViewEngine.boundView = rivets.bind(t, model);

        }

    };

    // Give the init function the RivetsViewEngine prototype for later instantiation
    RivetsViewEngine.fn.init.prototype = RivetsViewEngine.fn;

    return (window.RivetsViewEngine = RivetsViewEngine);

})(window);

