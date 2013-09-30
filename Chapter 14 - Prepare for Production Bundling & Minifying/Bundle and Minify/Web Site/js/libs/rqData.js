;

//navigator.onLine = navigator.onLine || true; //does not support application cache most likely, so assume online


(function (window, reqwest, undefined) {

    "use strict";


    var rqData = function (customSettings) {

        return new rqData.fn.init(customSettings);
    };

    rqData.fn = rqData.prototype = {

        constructor: rqData,

        init: function (customSettings) {

            this.settings = $.extend({}, this.settings, customSettings);

            return this;
        },

        version: "0.0.1",

        hasOnLine: "onLine" in navigator,
        onLine: navigator.onLine, //assume online if offline not supported

        ajaxSettings: {
            cache: false,
            dataType: "json",
            method: 'get',
            type: 'json',
            contentType: 'application/json',
            localCache: true,        // required to use
            cacheTTL: 5,           // in hours. Optional
            isCacheValid: function () {  // optional
                return true;
            },
            success: function (d) { },
            preAjax: function (options, callback) {

                if (callback && typeof callback === "function") {

                    return callback(options);

                }

            }
        },

        serialize: function (obj) {
            var str = [], p;

            for (p in obj) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        },


        ajaxPrefilter: function (options, jqXHR) {

            // Cache it ?
            if (!window.localStorage || !options.localCache) {
                return;
            }

            var that = this,
                value,
                hourstl = options.cacheTTL || 5,
                ls = window.localStorage,
                dataType = options.dataType || options.type,
                cacheKey = options.cacheKey ||
                         options.url.replace(/jQuery.*/, '') + options.type +
                         (options.data ? that.serialize(options.data) : ""),
                ttl = ls.getItem(cacheKey + 'cachettl');

            // isCacheValid is a function to validate cache
            if (options.isCacheValid && !options.isCacheValid()) {
                ls.removeItem(cacheKey);
            }

            // if there's a TTL that's expired, flush this item
            if (ttl && ttl < +new Date()) {
                ls.removeItem(cacheKey);
                ls.removeItem(cacheKey + 'cachettl');
                ttl = 'expired';
            }

            value = ls.getItem(cacheKey);

            if (value) {
                //In the cache? So get it, apply success callback & abort the XHR request
                // parse back to JSON if we can.
                if (dataType.indexOf('json') === 0 || dataType.indexOf('jsonp') === 0) {
                    value = JSON.parse(value);
                }

                options.success(value);

                // do not make actual AJAX call because we have data and have called the success callback!
                //TODO: return false here
                return;

            }

            //If it not in the cache, we change the success callback, 
            //just put data on localstorage and after that apply the initial callback
            if (options.success) {
                options.realsuccess = options.success;
            }

            //create a new success callback that will store data in localStorage
            options.success = function (data) {

                if (undefined === data) {

                    if (options.realsuccess) {
                        options.realsuccess(data);
                    }

                    return;
                }

                var strdata = data;

                if (dataType.indexOf('json') === 0 || dataType.indexOf('jsonp') === 0) {
                    strdata = JSON.stringify(data);
                }

                // Save the data to localStorage catching exceptions (possibly QUOTA_EXCEEDED_ERR)
                try {
                    ls.setItem(cacheKey, strdata);

                    // store timestamp
                    if (!ttl || ttl === 'expired') {
                        ls.setItem(cacheKey + 'cachettl', +new Date() + 1000 * 60 * 60 * hourstl);
                    }

                } catch (e) {

                    // Remove any incomplete data that may have been saved before the exception was caught
                    ls.removeItem(cacheKey);
                    ls.removeItem(cacheKey + 'cachettl');

                    if (options.cacheError) {
                        options.cacheError(e, cacheKey, strdata);
                    }

                }

                if (options.realsuccess) {
                    options.realsuccess(data);
                }

            };

            reqwest(options)
             .fail(function (e) {

                 that.failCallback(e);

             });

        },

        failCallback: function (data) {

            if (data.responseText) {
                console.error(JSON.stringify(data.responseText));
            }

        },

        doAJAX: function (ajaxOptions) {

            return ajaxOptions.preAjax(ajaxOptions, this.ajaxPrefilter);

//            return this.ajaxPrefilter(ajaxOptions);

        },

        getData: function (url, cache, ajaxSettings) {

            var ajaxOptions = $.extend({},
                                this.ajaxSettings,
                                ajaxSettings, { "url": url });

            if (ajaxSettings.type === "jsonp") {
                delete ajaxOptions.contentType;
                delete ajaxOptions.dataType;
            }

            return this.doAJAX(ajaxOptions);

        },

        postData: function (options) {

            var ajaxOptions = $.extend({},
                            this.ajaxSettings,
                            { type: "POST" },
                            options.ajaxSettings,
                            { "url": options.url });

            return this.doAJAX(ajaxOptions);


        },

        putData: function (options) {

            var ajaxOptions = $.extend({}, this.ajaxSettings,
                            { type: "PUT" },
                            options.ajaxSettings,
                            { "url": options.url });

            return this.doAJAX(ajaxOptions);

        },

        deleteData: function (options) {

            var ajaxOptions = $.extend({}, this.ajaxSettings,
                            { type: "DELETE" },
                            options.ajaxSettings,
                            { "url": options.url });

            return this.doAJAX(ajaxOptions);

        }

    };

    // Give the init function the rqData prototype for later instantiation
    rqData.fn.init.prototype = rqData.fn;

    return (window.rqData = rqData);

}(window, reqwest));

