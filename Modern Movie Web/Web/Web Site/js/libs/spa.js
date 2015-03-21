/// <reference path="backack.js" />
/// <reference path="helper.extensions.js" />
;

(function (window, undefined) {

	"use strict";

	//constants
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

				throw new ReferenceError("Must have an application context defined");
			}

		}

		window.addEventListener("DOMContentLoaded", function () {

			//cannot assume backpack anymore
			spa.viewEngine = spa.settings.viewEngine;
			spa.pm = spa.settings.pm;

			spa.analytics = spa.settings.analytics;

			spa.titleElement = document.querySelector(spa.settings.titleSelector);

			if (spa.settings.parseDOM) {

				spa.pm.setupRoutes(document.querySelectorAll(".spa-view"));

				spa.viewEngine.parseViews();

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

		matchRouteByPath: function (path, routes) {

			if (!routes) {
				routes = this.pm.getRoutes();
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
				routes = this.pm.getRoutes();
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

				if (oldLayout && oldLayout.getAttribute("spa-layout") !== route.layout) {

					oldView = oldLayout;

				}

			}

			spa.$oldController = spa.$controller;

			spa.$controller = spa.getController(route);

			if (!spa.$controller) {

				//need a default controller option here
				return;
			}

			//analytics
			spa.pushView(path);

			//append new view with any layout to the DOM, after the existing view + layout
			newView = spa.stampView(oldView, route);

			anim = spa.getAnimation(route);
			spa.animation = anim;

			if (newView) {

				if (oldView) {

					spa.makeViewCallback(spa.$oldController, "beforeunload");

					if (spa.hasAnimations()) {

						if (anim) {

							oldView.addEventListener(
								spa.transitionend[spa.cssPrefix("animation")], function (e) {
									spa.endSwapAnimation(spa.oldRoute, route, oldView);
									currentView = undefined;
								});

							//                            modify once addClass supports array of classes
							$(oldView).addClass("animated out " + anim)
								.removeClass("in");

							$(newView).addClass(settings.currentViewClass +
								" show animated " + anim + " in");

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
							" show animated " + anim + " in");
						$(spaLayout).addClass("show");

					} else {

						$(newView).addClass(settings.currentViewClass + " show");
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
		stampView: function (currentView, route) {

			/*
			 * if layout then
			 *  see if layout already available
			 *      if layout exist then
			 *          stamp in spa-child-view placeholder
			 *      else
			 *          create fragment with layout then stamp in new layout
			 *          stamp full view + layout in main-content
			 * else
			 *      stamp in main-content placeholder
			 * 
			 */

			//todo:refactor this method later
			//should return layout if layout is new. got to make sure show is added to both layout and view elements

			var spa = this,
				view,
				currentLayout,
				newView, loc;

			if (spa.viewEngine) {

				view = spa.viewEngine.getView(route.viewId);

				if (view) {

					newView = spa.createFragment(view);

				} else {

					//make it call the server to recycle the load process 
					//because it looks like
					//the view cache has been compromised.
					//todo:find a way to warn the user before this happens.
					loc = window.location.href.split("#!");
					window.location.replace(loc[0] + "?" +
						spa.settings.forceReload + "=" + loc[1]);

				}

				if (route.layout) {

					currentLayout = document.querySelector("[spa-layout='" + route.layout + "']");

					if (currentLayout) {

						loc = currentLayout.querySelector(spa.settings.layOutPlaceholder);

						if (currentView && !currentView.classList.contains("spa-layout")) {
							loc.insertBefore(newView, currentView);
						} else {
							loc.appendChild(newView);
						}


					} else {

						currentLayout = spa.viewEngine.getView(route.layout);

						if (currentLayout) {

							currentLayout = spa.createFragment(currentLayout);
							loc = document.querySelector(spa.settings.mainWrappperSelector);
							loc.appendChild(currentLayout);

							currentLayout = document.querySelector("[spa-layout='" + route.layout + "']");
						}

						loc = currentLayout.querySelector(spa.settings.layOutPlaceholder);

						loc.appendChild(newView);

					}

				} else {

					loc = document.querySelector(spa.settings.mainWrappperSelector);

					if (currentView) {
						loc.insertBefore(newView, currentView);
					} else {
						loc.appendChild(newView);
					}

				}


			}

			return document.querySelector(route.spaViewId);

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

		//array of animations. The names match the CSS class so make sure you have the CSS for this animation or you will be dissapointed.
		animations: {
			"slide": "slide",
			"fade": "fade",
			"flip": "flip"
		},

		settings: {
			routes: [],
			viewSelector: ".spa-view", //"[type='text/x-Rivets-template']", 
			currentViewClass: "spa-current-view",
			currentLayoutClass: "spa-current-layout",
			layoutClass: "spa-layout",
			layOutPlaceholder: ".spa-child-view",
			viewClass: "spa-view",
			mainWrappperSelector: ".main-content",
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