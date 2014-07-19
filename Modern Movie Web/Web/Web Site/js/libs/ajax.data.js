;

(function () {

    "use strict";

    var ajaxData = Class.extend({

        init: function (ajaxProvider) {

            if (!ajaxProvider) {
                throw {
                    name: "ajaxData Error",
                    message: "Must provide Ajax Data Provider"
                };
            }

            this.ajaxProvider = ajaxProvider;

        },

        ajaxProvider: undefined,

        cachettlSuffix: "-cachettl",

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
            success: function () { }
        },

        serialize: function (obj) {
            var str = [], p;

            for (p in obj) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        },

        ajaxPrefilter: function (options) {

            // Cache it ?
            if (!window.localStorage || !options.localCache) {

                this.doAJAX(options);

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
                ttl = ls.getItem(cacheKey + cachettl);

            value = that.getExistingData({
                isCacheValid: options.isCacheValid,
                ttl: ttl,
                cacheKey: cacheKey
            });

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

                //data transform function call here
                if (options.dtf) {

                    options.dtf(data, function (data) {
                        that.persistData(options, data);
                    });

                } else {
                    that.persistData(options, data);
                }

            };

            this.doAJAX(options);

        },

        persistData: function (options, data) {

            var that = this,
                dataType = options.dataType || options.type,
                hourstl = options.cacheTTL || 5,
                strdata = data,
                cacheKey = options.cacheKey ||
                         options.url.replace(/jQuery.*/, '') + options.type +
                         (options.data ? that.serialize(options.data) : ""),
                ttl = localStorage.getItem(cacheKey + cachettl);

            if (dataType.indexOf('json') === 0 || dataType.indexOf('jsonp') === 0) {
                strdata = JSON.stringify(data);
            }

            that.saveResultToStorage(cacheKey, strdata, ttl, hourstl);

            if (options.realsuccess) {
                options.realsuccess(data);
            }

        },

        saveResultToStorage: function (cacheKey, strdata, ttl, hourstl) {

            var ls = window.localStorage;

            // Save the data to localStorage catching exceptions (possibly QUOTA_EXCEEDED_ERR)
            try {
                ls.setItem(cacheKey, strdata);

                // store timestamp
                if (!ttl || ttl === 'expired') {
                    ls.setItem(cacheKey + cachettl, +new Date() +(3600000 * hourstl));
                }

            } catch (e) {

                // Remove any incomplete data that may have been saved before the exception was caught
                ls.removeItem(cacheKey);
                ls.removeItem(cacheKey + cachettl);

                if (options.cacheError) {
                    options.cacheError(e, cacheKey, strdata);
                }

            }

        },

        getExistingData: function (options) {

            var ttl = options.ttl,
                cacheKey = options.cacheKey;

            // isCacheValid is a function to validate cache
            if (options.isCacheValid && !options.isCacheValid()) {
                localStorage.removeItem(cacheKey);
            }

            // if there's a TTL that's expired, flush this item
            if (!ttl || ttl < +new Date()) {
                localStorage.removeItem(cacheKey);
                localStorage.removeItem(cacheKey + cachettl);
                ttl = 'expired';
            }

            return localStorage.getItem(cacheKey);

        },

        failCallback: function (data) {

            if (data.responseText) {
                console.error(JSON.stringify(data.responseText));
            }

        },


        doAJAX: function (ajaxOptions) {

            var that = this;

            ajaxProvider(ajaxOptions)
             .fail(function (e) {

                 that.failCallback(e);

             });

        },

        getJSONP: function (url, ajaxSettings) {

            var ajaxOptions = $.extend({},
                    this.ajaxSettings,
                    ajaxSettings, {
                        "url": url,
                        "type": "jsonp"
                    });

            //delete ajaxOptions.contentType;
            //delete ajaxOptions.dataType;

            return this.ajaxPrefilter(ajaxOptions);
        },

        getData: function (url, ajaxSettings) {

            var that = this,
                ajaxOptions = $.extend({},
                                this.ajaxSettings,
                                ajaxSettings, { "url": url });

            if (ajaxSettings.type === "jsonp") {
                delete ajaxOptions.contentType;
                delete ajaxOptions.dataType;
            }

            return this.ajaxPrefilter(ajaxOptions);

        },

        postData: function (url, options) {

            var that = this,
                ajaxOptions = $.extend({},
                            this.ajaxSettings,
                            {
                                method: "post"
                            },
                            options, { "url": url });

            return ajaxProvider(ajaxOptions)
             .fail(function (e) {

                 that.failCallback(e);

             });

        },

        putData: function (url, options) {

            var that = this,
                ajaxOptions = $.extend({},
                this.ajaxSettings,
                {
                    method: "put"
                },
                options, { "url": url });

            return ajaxProvider(ajaxOptions)
             .fail(function (e) {

                 that.failCallback(e);

             });

        },

        deleteData: function (url, options) {

            //var ajaxOptions = $.extend({}, this.ajaxSettings,
            //                { type: "DELETE" },
            //                options.ajaxSettings,
            //                { "url": options.url });

            //return ajaxProvider(ajaxOptions)
            //.fail(function (e) {

            //    that.failCallback(e);

            //});

            var that = this,
                ajaxOptions = $.extend({},
                this.ajaxSettings,
                {
                    method: "delete"
                },
                options, { "url": url });

            return ajaxProvider(ajaxOptions)
             .fail(function (e) {

                 that.failCallback(e);

             });

        }

    });

    return (window.ajaxData = ajaxData);

})();