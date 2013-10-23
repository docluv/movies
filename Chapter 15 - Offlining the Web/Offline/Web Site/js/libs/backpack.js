;
//Backpack is a deferred content managment library with single page and mobile applications in mind
(function (window, $, undefined) {

    "use strict";

    var backpack = function (customSettings) {

        var that = new backpack.fn.init(customSettings);

        that.settings = $.extend({}, that.settings, customSettings);

        return that;
    };

    backpack.fn = backpack.prototype = {

        constructor: backpack,

        init: function () {

            return this;
        },

        version: "0.0.2",

        getTemplates: function (remove) {

            var i, temp,
                t = document.querySelectorAll("script[type='" + this.settings.templateType + "']"),
                templates = $.parseLocalStorage("templates");

            for (i = 0; i < t.length; i++) {

                temp = t[i];

                templates[temp.id] = temp.innerHTML.replace(/(\r\n|\n|\r)/gm, "");

                if (remove) {

                    if (temp.parentNode) {
                        temp.parentNode.removeChild(temp);
                    }
                }

            }

            localStorage.setItem("templates", JSON.stringify(templates));

            return templates;

        },

        //keep
        storeTemplates: function () {

            var i, //templates,
                scripts = document.querySelectorAll("script[type='" +
                                                      this.settings.templateType + "']");

            for (i = 0; i < scripts.length; i++) {

                this.saveTemplateToStorage(scripts[i]);

            }

        },

        //keep
        saveTemplateToStorage: function (s) {

            if (typeof s === "string") { //assume this is the element id
                s = document.getElementById(s);
            }

            if (s) {

                localStorage.setItem(s.id, s.innerHTML.replace(/(\r\n|\n|\r)/gm, ""));

                if (s.parentNode) {
                    s.parentNode.removeChild(s);
                }

            }

        },

        //keep
        getTemplate: function (id) {

            return "<script type='" +
                        this.settings.templateType
                        + "'>" + localStorage.getItem(id) + "</script>";

        },

        //keep
        updateViews: function (selector) {

            var i, views = document.querySelectorAll(selector);

            for (i = 0; i < views.length; i++) {
                this.saveViewToStorage(views[i]);
            }

        },

        //keep
        hasClass: function (e, className) {

            return (e.className.search(className) > -1);

        },

        //keep, but modify the promise stuff, take it out 4 now
        saveViewToStorage: function (e) {

            if (typeof e === "string") { //assume this is the element id
                e = document.getElementById(e);
            }

            if (e) {

                this.storeViewInfo(this.parseViewInfo(e));

                if (e.parentNode && !this.hasClass(e, this.settings.currentClass)) {
                    e.parentNode.removeChild(e);
                }

                e = undefined;
            }

        },

        //keep, but update
        parseViewInfo: function (ve) {

            return {
                pageId: ve.id,
                viewTitle: (ve.hasAttribute("data-title") ?
                                ve.getAttribute("data-title") :
                                this.settings.defaultTitle),
                tranistion: (ve.hasAttribute("data-transition") ?
                                ve.getAttribute("data-transition") :
                                ""), //need a nice way to define the default animation
                content: ve.outerHTML
            };

        },

        //keep
        storeViewInfo: function (viewInfo) {

            viewInfo = $.extend({}, this.pageSettings, viewInfo);

            localStorage.setItem(viewInfo.pageId,
                            JSON.stringify(viewInfo));

        },

        //keep
        getViewData: function (viewId) {

            var viewData = localStorage[viewId],
                view;

            if (!viewData) {

                view = document.getElementById(viewId);

                if (view) {

                    this.saveViewToStorage(view);
                    viewData = window.localStorage[viewId];
                }
            }

            if (viewData) {
                return JSON.parse(viewData);
            }

        },

        settings: {
            viewSelector: ".content-pane",
            defaultTitle: "A Really Cool SPA App",
            deferredTimeKey: "lastDeferredTime",
            templateType: "text/x-mustache-template",
            currentClass: "current"
        },

        pageSettings: {
            pageId: "",
            url: "",
            css: undefined,
            js: undefined,
            templates: "",
            content: "",
            defaultTemplate: "#DefaultViewTemplate"

        }

    };

    // Give the init function the backpack prototype for later instantiation
    backpack.fn.init.prototype = backpack.fn;

    return (window.backpack = backpack);

})(window, $);


