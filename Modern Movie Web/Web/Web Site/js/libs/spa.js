/// <reference path="backack.js" />
/// <reference path="helper.extensions.js" />
;

(function (window, undefined) {

    "use strict";

    //contants
    var leadingDot = ".",
        spaLayout = ".spa-layout",
        oldRoute = undefined;

    // Define a local copy of deferred
    var SPA = function (customSettings) {

        var spa = new SPA.fn.init(),
            appName = "",
            AppContext;

        spa.settings = $.extend({}, spa.settings, customSettings);

        if (spa.settings.AppContext) {
            spa.$context = spa.settings.AppContext;
        } else {

            var spaApp = document.querySelector("[spa-app]");

            if (spaApp) {

                appName = window[spaApp.getAttribute("spa-app")];

                if (typeof appName === "function") {
                    appName = appName();
                }

                spa.$context = appName;

            } else {
                console.error("Must have an application context defined");

                throw {
                    name: "SPA Error",
                    message: "Must have an application context defined"
                };
            }

        }

        window.addEventListener("DOMContentLoaded", function () {

            //cannot assume backpack anymore
            spa.viewEngine = spa.settings.viewEngine || Backpack();

            spa.analytics = spa.settings.analytics;

            spa.titleElement = document.querySelector(spa.settings.titleSelector);

            if (spa.settings.parseDOM) {

                spa.setupRoutes(spa.settings.viewSelector);

            }


            window.addEventListener("hashchange", function () {

                spa.swapView();

            });

            if (spa.getParameterByName(spa.settings.forceReload)) {

                window.location.replace(window.location.href.split("?")[0] + "#!" +
                    spa.getParameterByName(spa.settings.forceReload));
                return spa;

            } else if (spa.settings.initView) {
                spa.swapView();
            }

        });

        /*

        //decided to shelve this for the time being. Will complete this functionality
        //after the book is published

        if (spa.settings.asyncUrl && typeof spa.settings.asyncUrl === "string") {

            document.addEventListener("DOMContentLoaded", function () {

                e.target.removeEventListener(e.type, arguments.callee);

                spa.loadAsyncContent.call(spa, spa.settings.asyncUrl);
            });
        }

        */

        return spa;

    };

    SPA.fn = SPA.prototype = {

        constructor: SPA,

        init: function () {
            return this;
        },

        version: "0.1.2",

        viewEngine: undefined,

        $context: undefined,
        $controller: undefined,
        $oldController: undefined,
        oldRoute: undefined,

        setupRoutes: function () {

            var spa = this,
                settings = spa.settings,
                routes = $.extend($.parseLocalStorage("routes") || {}, settings.routes),
                i = 0,
                rawPath, view, route, viewId,
                Views = document.querySelectorAll(settings.viewSelector);

            for (; i < Views.length; i++) {

                view = Views[i];

                if (view.hasAttributes() && view.hasAttribute("id")) {

                    viewId = view.getAttribute("id");
                    rawPath = (view.hasAttribute("spa-route") ? view.getAttribute("spa-route") : "");

                    route = spa.createRoute(viewId, rawPath, view);

                    if (route) {

                        routes[route.path] = route;

                    }

                }

            }

            spa.settings.routes = routes;

            localStorage.setItem("routes", JSON.stringify(routes));

            if (spa.viewEngine && (spa.getParameterByName("_escaped_fragment_") === "")) {
                spa.viewEngine.parseViews(settings.viewSelector);
            }

        },

        createRoute: function (viewId, rawPath, view) {

            //need to check for duplicate path
            var route = {
                viewId: viewId,
                viewModule: (view.hasAttribute("spa-module") ? view.getAttribute("spa-viewId") :
                    viewId),
                path: rawPath.split("/:")[0],
                params: rawPath.split("/:").slice(1),
                title: (view.hasAttribute("spa-title") ? view.getAttribute("spa-title") :
                    this.settings.defaultTitle),
                viewType: (view.hasAttribute("spa-view-type") ? view.getAttribute("spa-view-type") :
                    "view"),
                layout: (view.hasAttribute("spa-layout") ? view.getAttribute("spa-layout") :
                    undefined),
                transition: (view.hasAttribute("spa-transition") ?
                    view.getAttribute("spa-transition") :
                    ""),
                paramValues: {},
                beforeonload: (view.hasAttribute("spa-beforeonload") ? view.getAttribute("spa-beforeonload") : undefined),
                onload: (view.hasAttribute("spa-onload") ? view.getAttribute("spa-onload") : undefined),
                afteronload: (view.hasAttribute("spa-afteronload") ? view.getAttribute("spa-afteronload") : undefined),
                beforeunload: (view.hasAttribute("spa-beforeunload") ? view.getAttribute("spa-beforeunload") : undefined),
                unload: (view.hasAttribute("spa-unload") ? view.getAttribute("spa-unload") : undefined),
                afterunload: (view.hasAttribute("spa-afterunload") ? view.getAttribute("spa-afterunload") : undefined)
            };

            if (route.viewType === "view") {

                return route;

            }

        },

        matchRouteByPath: function (path, routes) {

            if (!routes) {
                routes = this.settings.routes;
            }

            var key, route, params, i,
                paramValues = {},
                search;

            //routes is an object so we can match the path to the route as it will be a property name.
            if (routes.hasOwnProperty(path)) {
                return routes[path];
            }

            for (key in routes) {

                if (routes.hasOwnProperty(key)) {

                    route = routes[key];

                    search = new RegExp('\\b' + route.path + '\\b', 'gi');

                    if (route.path !== "" &&
                        path.search(search) === 0) {

                        //use regular expression here to pull just the 1st instace
                        params = path.replace(route.path, "")
                            //.split("\\")
                            .split("/")
                            .slice(1); //the first item will be empty

                        for (i = 0; i < params.length; i++) {
                            paramValues[route.params[i]] = params[i];
                        }

                        route.paramValues = paramValues;

                        break;
                    } else {
                        route = undefined;
                    }

                }

            }

            return route;
        },

        matchRouteById: function (id, routes) {

            if (!routes) {
                routes = this.settings.routes;
            }

            var route;

            for (route in routes) {
                if (routes[route].viewId === id) {
                    return routes[route];
                }
            }

        },

        //  newView: undefined, //placeholder for new view
        //  currentView: undefined, //placeholder for current view before a swap
        animation: undefined,

        getParameterByName: function (name) {

            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);

            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },

        getVendorPropertyName: function (prop) {

            var prefixes = ['Moz', 'Webkit', 'O', 'ms'],
                vendorProp, i,
                prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

            if (prop in this.div.style) {
                return prop;
            }

            for (i = 0; i < prefixes.length; ++i) {

                vendorProp = prefixes[i] + prop_;

                if (vendorProp in this.div.style) {
                    return vendorProp;
                }

            }
        },

        transitionend: {
            'animation': 'animationend',
            'webkitAnimation': 'webkitAnimationEnd',
            'MozAnimation': 'animationend',
            'OAnimation': 'oAnimationEnd'
        },

        // re-purposed helper
        cssPrefix: function (suffix) {

            if (!suffix) {
                return '';
            }

            var i, len, parts, prefixes,
                bodyStyle = document.body.style;

            if (suffix.indexOf('-') >= 0) {

                parts = ('' + suffix).split('-');

                for (i = 1, len = parts.length; i < len; i++) {
                    parts[i] = parts[i].substr(0, 1).toUpperCase() + parts[i].substr(1);
                }
                suffix = parts.join('');
            }

            if (suffix in bodyStyle) {
                return suffix;
            }

            suffix = suffix.substr(0, 1).toUpperCase() + suffix.substr(1);

            prefixes = ['webkit', 'Moz', 'ms', 'O'];

            for (i = 0, len = prefixes.length; i < len; i++) {
                if (prefixes[i] + suffix in bodyStyle) {
                    return prefixes[i] + suffix;
                }
            }

            return "";
        },

        removeExtraViews: function (currentView) {

            if (currentView) {

                var length = currentView.length;

                while (length > 1) {

                    length--;
                    currentView[length]
                        .parentNode.removeChild(currentView[length]);
                }

            }

            return currentView[0];

        },

        pushView: function (path) {

            var spa = this;

            if (spa.analytics) {
                spa.analytics.pushView(['_trackPageview', path]);
            }

        },

        getHashPath: function () {

            var hashFragment = (window.location.hash !== "#") ? window.location.hash.replace("#!", "") : "";

            hashFragment = hashFragment.split(":")[0];
            hashFragment = hashFragment.replace(new RegExp("\\\\$"), "");

            return hashFragment;

        },

        getClassSelector: function (className) {
            return leadingDot + className;
        },

        getOldRoute: function (oldViewId) {

            if (oldViewId) {
                return this.matchRouteById(oldViewId);
            }

            return undefined;

        },

        getController: function (route) {

            var spa = this,
                controller = spa.$context[route.viewId];

            if (controller && typeof controller === "function") {

                controller = new controller(spa.$context, route);

                return controller;

            } else if (controller && typeof controller === "object") {

                controller = new controller;

                controller.response = route;

                return controller;

            } else {
                return;
            }


        },

        getExistingView: function (newLayout) {

            var spa = this
            view = document.querySelector("." + spa.settings.currentLayoutClass);

            if (!view) {
                view = document.querySelector("." + spa.settings.currentViewClass);
            }

            return view;

        },

        swapView: function () {

            var spa = this,
                settings = spa.settings,
                anim, childView,
                oldViewId = undefined,
                newView, newLayout, currentView, oldLayout, oldView,
                hasEscapeFragment = spa.getParameterByName("_escaped_fragment_"),
                path = spa.getHashPath(),
                route = spa.matchRouteByPath(path);

            if (!route || hasEscapeFragment !== "") {
                window.location.hash = "#!" + settings.NotFoundRoute;
                return;
            }

            //get current layout
            oldLayout = document.querySelectorAll(leadingDot + settings.layoutClass);

            //get current childview
            oldView = document.querySelectorAll(leadingDot + settings.currentViewClass);

            if (oldLayout && oldLayout.length > 0) {

                oldLayout = spa.removeExtraViews(oldLayout);

            }

            if (oldView && oldView.length > 0) {

                oldView = spa.removeExtraViews(oldView);
                oldViewId = (oldView) ? oldView.id : undefined;

            }

            if (oldView.length === 0) {
                oldView = undefined;
            }

            if (spa.oldRoute === path) {
                // the view is not changing so just get out
                return;
            }

            if (oldLayout) {

                if (oldLayout.length !== undefined) {
                    if (oldLayout.length === 0) {
                        oldLayout = undefined;
                    } else {
                        oldLayout = oldLayout[0];
                    }
                }

                if (oldLayout) {

                    oldView = oldLayout;

                }
            }

            //determine if transition replaces full layout or just child if layouts are the same
            //if (oldViewId === route.layout) {


            //}


            spa.$oldController = spa.$controller;

            spa.$controller = spa.getController(route);

            if (!spa.$controller) {
                return;
            }

            //analytics
            spa.pushView(path);

            //append new view with any layout to the DOM, after the existing view + layout
            oldView = spa.ensureViewAvailable(oldView, route);

            newView = document.getElementById(route.viewId);

            if (newView) {

                if (oldView) {

                    spa.makeViewCallback(spa.$oldController, "beforeunload");

                    if (spa.hasAnimations()) {

                        anim = spa.getAnimation(route);
                        spa.animation = anim;

                        if (anim) {

                            // <HACK>
                            // ROBBY: Safari is never registering webkitAnimationEnd (or animationend for that matter)
                            // causing oldView to not be removed from the DOM until the _next_ transition's removeExtraViews
                            // call.  This means we perpetually have two views in our DOM simultaneously, which causes ALL SORTS
                            // of weird behavior and rendering on our live site.
                            // Our current settings are for slide transitions to be zero'd out anyways, so I am monkey patching
                            // this code off temporarily.  God help me if I don't push a real fix for this soon.
                            // oldView.addEventListener(
                            //     spa.transitionend[spa.cssPrefix("animation")], function (e) {
                            //         spa.endSwapAnimation(spa.oldRoute, route, oldView);
                            //         currentView = undefined;
                            //     });
                            spa.endSwapAnimation(spa.oldRoute, route, oldView);
                            // </HACK>
                            
                            //modify once addClass supports array of classes
                            // $(oldView).addClass("animated out " + anim)
                            //     .removeClass("in");

                            $(newView).addClass(settings.currentViewClass +
                                " animated " + anim + " in");

                            $(spaLayout).addClass("show");

                        } else {

                            $(newView).addClass(settings.currentViewClass);
                            $(spaLayout).addClass("show");
                            spa.endSwapAnimation(spa.oldRoute, route, oldView);
                        }

                    }

                } else {

                    //this is probably the initial load

                    if (settings.intoAnimation) {

                        newView.addEventListener(
                            spa.transitionend[spa.cssPrefix("animation")], function (e) {
                                spa.endSwapAnimation.call(spa, spa.oldRoute, route, currentView);
                                currentView = undefined;
                            });

                        $(newView).addClass(settings.currentViewClass +
                            " animated " + anim + " in");
                        $(spaLayout).addClass("show");

                    } else {

                        $(newView).addClass(settings.currentViewClass);
                        spa.endSwapAnimation.call(spa, spa.oldRoute, route, currentView);
                        $(spaLayout).addClass("show");
                    }

                }

                spa.setDocumentTitle(route);

                if (route && spa.$controller) {

                    spa.makeViewCallback(spa.$controller, "beforeonload", route);
                    spa.makeViewCallback(spa.$controller, "onload", route);
                    spa.makeViewCallback(spa.$controller, "afteronload", route);
                }

            }

            spa.oldRoute = path;
        },

        getAnimation: function (route) {

            if (!route) {
                return this.settings.viewTransition;
            }

            return this.animations[route.transition] || this.settings.viewTransition;

        },

        endSwapAnimation: function (route, newRoute, currentView) {
            //currentView, newView, 
            var spa = this,
//                currentView = document.querySelector(leadingDot + spa.settings.currentViewClass + ".out"),
                newView = document.getElementById(newRoute.viewId),
                parent,
                anim = spa.animation;

            if (route) {
                spa.makeViewCallback(spa.$oldController, "unload");
                spa.makeViewCallback(spa.$oldController, "afterunload");
            }

            if (newView && newView.classList.contains("in")) {
                newView.classList.remove("in");
                newView.classList.remove(anim);
            }

            if (currentView && spa.viewEngine && currentView.parentNode) {

                parent = currentView.parentNode
                parent.removeChild(currentView);

            }

        },

        //make sure the view is actually available, this relies on backpack to supply the markup and inject it into the DOM
        ensureViewAvailable: function (currentView, route) {

            var spa = this,
                view,
                currentLayout,
                newView, loc;

            if (spa.viewEngine) {

                view = spa.viewEngine.getView(route);

                if (view) {

                    newView = spa.createFragment(view);

                } else {

                    //make it call the server to recyle the load process because it looks like
                    //the view cache has been compromised.
                    loc = window.location.href.split("#!");
                    window.location.replace(loc[0] + "?" +
                        spa.settings.forceReload + "=" + loc[1]);

                }

                //there is an existing view
                if (currentView) {

                    //if new view has a layout
                    if (route.layout) {

                        if (document.querySelector(spaLayout)) {

                            //get current layout because that needs to be replaced
                            currentLayout = document.querySelector(spaLayout);

                            //if (!currentView) {
                            //    currentView = document.querySelector(".spa-current-view");
                            //}

                            if (currentLayout) {
                                currentLayout.parentNode.insertBefore(newView, currentLayout);
                            }

                        } else {

                            currentView.parentNode.insertBefore(newView, currentView);

                        }

                    } else {

                        currentLayout = document.querySelector(spaLayout);

                        if (currentLayout) {

                            currentView = currentLayout;

                        }

                        currentView.parentNode.insertBefore(newView, currentView);

                    }

                } else {
                    //no existing view, this is startup, so add the view to the main target.
                    document.querySelector(spa.settings.mainWrappperSelector).appendChild(newView);

                }

            }

            //else assume the view is already in the markup

            return currentView;

        },

        makeViewCallback: function (controller, action, params) {

            if (controller && controller[action]) {
                controller[action].call(controller, params || {});
            }

        },


        setDocumentTitle: function (route) {

            var title = route.title,
                i;

            if (title === "") {
                return;
            }

            for (i = 0; i < route.params.length; i++) {
                title = title.replace(":" +
                    route.params[i],
                    route.paramValues[route.params[i]]);
            }

            document.title = title;

        },

        createFragment: function (htmlStr) {

            var frag = document.createDocumentFragment(),
                temp = document.createElement("div");

            temp.innerHTML = htmlStr;

            while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
            }

            return frag;
        },

        hasAnimations: function () {

            var animation = false,
                elm = document.createElement("div"),
                animationstring = 'animation',
                keyframeprefix = '',
                domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
                pfx = '',
                i = 0;

            if (elm.style.animationName) {
                animation = true;
            }

            if (animation === false) {
                for (i = 0; i < domPrefixes.length; i++) {
                    if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                        pfx = domPrefixes[i];
                        animationstring = pfx + 'Animation';
                        keyframeprefix = '-' + pfx.toLowerCase() + '-';
                        animation = true;
                        break;
                    }
                }
            }

            return animation;

        },

        /*
        storeAsyncContent: function (content) {
    
            this.viewEngine.updateViewsFromFragment(this.settings.viewSelector, content);
        },
    
        loadAsyncContent: function (url, callback) {
    
            callback = callback || this.storeAsyncContent;
    
            var oReq = new XMLHttpRequest();
    
            oReq.onload = callback;
            oReq.open("get", url, true);
            oReq.send();
        },
        */

        //array of animations. The names match the CSS class so make sure you have the CSS for this animation or you will be dissapointed.
        animations: {
            "slide": "slide",
            "fade": "fade",
            "flip": "flip"
        },

        settings: {
            routes: [],
            viewSelector: "[type='text/x-Rivets-template']",
            currentViewClass: "spa-current-view",
            currentLayoutClass: "spa-current-layout",
            layoutClass: "spa-layout",
            viewClass: "spa-view",
            mainWrappperSelector: "main",
            NotFoundView: "nofoundView",
            NotFoundRoute: "404",
            defaultTitle: "A Single Page Application with Routes",
            titleSelector: ".view-title",
            forceReload: "_force_reload_",
            autoSetTitle: true,
            parseDOM: true,
            initView: true,
            transitionFullLayout: true,
            intoAnimation: true,
            viewTransition: "slide",
            asyncUrl: undefined
        }

    };

    // Give the init function the spa prototype for later instantiation
    SPA.fn.init.prototype = SPA.fn;

    return (window.SPA = SPA);

})(window);