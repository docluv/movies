(function (window, undefined) {

	"use strict";

	/*
	 * initial load grabs module definitions
	 * loops through them and stamps references to scripts and CSS in DOM
	 * views are just views and processed like we have been.
	 * when a script or CSS is stampped ensure the reference has not already been added
	 *	this will involve checking the id and the target URL.
	 * allow script to be added in a deferred mannor so they can be lazy loaded
	 * assets do not need to added as the application flows by default
	 * they can be loaded up front.
	 * however there should be a mechanism to load them as the user
	 * opens views in modules. no sense in loading assets for a module that is rarely used
	 * all the time.
	 * 
	 */

	var SPAPM = function (settings) {

		return new SPAPM.fn.init(settings);

	};

	SPAPM.fn = SPAPM.prototype = {

		constructor: SPAPM,

		init: function (settings) {

			var pm = this;

			if (!settings) {
				settings = {};
			}

			//these are required
			pm.viewEngine = settings.viewEngine;
			pm.cache = settings.cache;

			if (settings.ViewSelector) {

				ViewSelector: settings.ViewSelector;

			}

			if (settings.cssSelector) {

				cssSelector: settings.cssSelector;

			}

			if (settings.scriptSelector) {

				scriptSelector: settings.scriptSelector;

			}

			if (settings.appPrefix) {
				pm.appPrefix = settings.appPrefix;
			}

			return pm;
		},

		version: "0.0.1",

		viewEngine: undefined,
		cache: undefined,

		mainWrappperSelector: "main",
		currentClass: "current",
		appPrefix: "SPAapp-",


		ViewSelector: "template[class='spa-view']",
		LayoutSelector: "template[class='spa-layout']",
		cssSelector: "link[rel='stylesheet']",
		scriptSelector: "script",

		views: {},

		getFileName: function (path) {

			return path.replace(/^.*[\\\/]/, '');
		},


		loadImport: function (ImportURL, moduleName) {

			var pm = this;

			pm.getImport(ImportURL, function (content) {

				pm.parseImport(content, moduleName);

			});

		},

		getImport: function (route, callback) {

			var request = new XMLHttpRequest();
			request.open('GET', route, true);

			request.onload = function () {
				if (request.status >= 200 && request.status < 400) {
					// Success!
					var resp = request.responseText.replace(/(\r\n|\n|\r)/gm, "");

					if (callback) {
						callback(resp);
					}

				} else {
					// We reached our target server, but it returned an error

				}
			};

			request.onerror = function () {
				// There was a connection error of some sort
			};

			request.send();

		},

		parseImport: function (content, moduleName) {

			var pm = this,
				moduleDef = {
					name: moduleName
				},
				module = document.createElement("div");

			module.innerHTML = content;

			moduleDef.Views = pm.processViews(module.querySelectorAll(pm.ViewSelector +
													", " + pm.LayoutSelector), moduleName);

			moduleDef.scripts = pm.processScripts(module.querySelectorAll(pm.scriptSelector), moduleName);

			moduleDef.css = pm.processCSS(module.querySelectorAll(pm.cssSelector), moduleName);

			pm.cache.setObject("spa-module-" + moduleName, moduleDef, +new Date() + 86400000000); //long long time in the future

		},

		processViews: function (moduleViews, moduleName) {

			var pm = this,
				ele = document.createElement("div");

			for (var i = 0; i < moduleViews.length; i++) {

				ele.appendChild(moduleViews[i]);

			}

			pm.viewEngine.parseViews(ele.innerHTML);

			pm.setupRoutes(moduleViews);

		},


		processCSS: function (css) {

			var pm = this,
				cssRefs = pm.cache.getObject(pm.appPrefix + -"css") || {};

			if (css && css.length) {

				for (var i = 0; i < css.length; i++) {

					pm.appendCSS(css[i].href);
					
					cssRefs[pm.getFileName(css[i].href)] = css[i].href;

				}

				pm.cache.setObject(pm.appPrefix + "-css", cssRefs);

			}

		},

		appendCSS: function (url, id) {

			var pm = this,
				cssLink,
				fileName = pm.getFileName(url);

			if (!document.querySelector("link[id='" + fileName + "']")) {

				cssLink = document.createElement("link");

				cssLink.id = fileName;

				cssLink.rel = "stylesheet";
				cssLink.type = "text/css";
				cssLink.href = url;

				document.head.appendChild(cssLink);

			}

		},

		processScripts: function (scripts) {

			var pm = this,
				scriptRefs = pm.cache.getObject(pm.appPrefix + "-scripts") || {};

			if (scripts && scripts.length) {

				for (var i = 0; i < scripts.length; i++) {

					pm.appendScript(scripts[i].src);

					scriptRefs[pm.getFileName(scripts[i].src)] = scripts[i].src;

				}

				pm.cache.setObject(pm.appPrefix + "-scripts", scriptRefs);

			}

		},

		appendScript: function (src) {

			var pm = this,
				script,
				fileName = pm.getFileName(src);

			if (!document.querySelector("script[id='" + fileName + "']")) {

				script = document.createElement("script");

				script.id = fileName;
				script.src = src;

				document.body.appendChild(script);

			}

		},

		setupAssets: function () {

			var pm = this,
				asset,
				scriptRefs = pm.cache.getObject(pm.appPrefix + "-scripts"),
				cssRefs = pm.cache.getObject(pm.appPrefix + "-css");

			for (asset in scriptRefs) {
				pm.appendScript(scriptRefs[asset]);
			}

			for (asset in cssRefs) {
				pm.appendCSS(cssRefs[asset]);
			}
			
		},

		getAttributeDefault: function (ele, attr, def) {

			return (ele.hasAttribute(attr) ? ele.getAttribute(attr) : def);

		},

		getRoutes: function () {

			return JSON.parse(localStorage.getItem(this.appPrefix + "routes")) || {};
		},

		setRoutes: function (routes) {

			localStorage.setItem(this.appPrefix + "routes", JSON.stringify(routes));
		},

		setupRoutes: function (views) {

			var pm = this,
				routes = pm.getRoutes(),
				i = 0,
				rawPath, view, route, viewId;

			if (views.length === undefined) {
				views = [views];
			}

			for (; i < views.length; i++) {

				view = views[i];

				if (view.hasAttributes() && view.hasAttribute("id")) {

					viewId = view.getAttribute("id");
					rawPath = pm.getAttributeDefault(view, "spa-route", "");

					route = pm.createRoute(viewId, rawPath, view);

					if (route) {

						routes[route.path] = route;

					}

				}

			}

			pm.setRoutes(routes);

		},

		createRoute: function (viewId, rawPath, view) {
			
			//need to check for duplicate path
			var pm = this,
				route = {
				viewId: viewId,
				viewModule: pm.getAttributeDefault(view, "spa-module", viewId),
				path: rawPath.split("/:")[0],
				params: rawPath.split("/:").slice(1),
				spaViewId: pm.getAttributeDefault(view, "spa-view-id", "#" + viewId),
				title: pm.getAttributeDefault(view, "spa-title", ""),
				viewType: pm.getAttributeDefault(view, "spa-view-type", "view"),
				layout: pm.getAttributeDefault(view, "spa-layout", undefined),
				transition: pm.getAttributeDefault(view, "spa-transition", ""),
				paramValues: {},
				beforeonload: pm.getAttributeDefault(view, "spa-beforeonload", undefined),
				onload: pm.getAttributeDefault(view, "spa-onload", undefined),
				afteronload: pm.getAttributeDefault(view, "spa-afteronload", undefined),
				beforeunload: pm.getAttributeDefault(view, "spa-beforeunload", undefined),
				unload: pm.getAttributeDefault(view, "spa-unload", undefined),
				afterunload: pm.getAttributeDefault(view, "spa-afterunload", undefined)
				};

			if (route.viewType === "view") {

				return route;

			}

		}


	};

	// Give the init function the spapm prototype for later instantiation
	SPAPM.fn.init.prototype = SPAPM.fn;

	return (window.SPAPM = SPAPM);


}(window));