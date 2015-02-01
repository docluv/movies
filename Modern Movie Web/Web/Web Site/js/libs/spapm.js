;

(function (window, undefined) {

    var SPApm = function (http, viewEngine) {

        var spapm = new SPApm.fn.init();

        if (!http) {
            throw {
                "name": "SPA Package Manager Exception",
                "message": "You must designate an http service."
            };
        }

        if (!viewEngine) {
            throw {
                "name": "SPA Package Manager Exception",
                "message": "You must designate a viewEngine."
            };
        }

        spapm.ve = viewEngine;
        spapm.http = http;

        return spapm;
    };

    SPApm.fn = SPApm.prototype = {

        constructor: SPApm,

        init: function () {
            return this;
        },

        version: "0.0.1",

        ve: undefined,
        http: undefined,


        loadPackages: function (pkgs) {




            return this;

        },

        parsePackage: function (pkg) { },

        loadTemplates: function (templateUrls) {

            templateUrls = this.ensureArray(templateUrls);

            var template;

            templateUrls.forEach(function (value, i) {

                //parse using the View Engine

            });

        },

        loadScripts: function (scripts) {

            scripts = this.ensureArray(scripts);

            var script;

            scripts.forEach(function (url, i) {

                var script = document.createElement("script");

                script.type = "text/javascript";
                script.src = url;
                document.body.appendChild(script);
            });

        },

        loadCSS: function (cssFiles) {

            cssFiles = this.ensureArray(cssFiles);

            var link;

            cssFiles.forEach(function (url, i) {

                var link = document.createElement("link");

                link.type = "text/css";
                link.rel = stylesheet;
                link.href = url

                document.head.appendChild(script);
            });


        },

        ensureArray: function (obj) {

            if (obj.prototype.toString.call(obj) !== "[object Array]") {
                obj = [obj];
            }

            return obj;

        }

    };

    SPApm.fn.init.prototype = SPApm.fn;

    return (window.SPApm = SPApm);

})(window);

