;

//navigator.onLine = navigator.onLine || true; //does not support application cache most likely, so assume online


(function (window, undefined) {

    "use strict";

    var cachettl = "-cachettl";

    var rqHTTP = function () {

        return new rqHTTP.fn.init();

    };

    rqHTTP.fn = rqHTTP.prototype = {

        constructor: rqHTTP,

        init: function () {
            return this;
        },

        version: "0.0.2",

        ajaxSettings: {
            dataType: "json",
            method: 'get',
            type: 'json',
            contentType: 'application/json',
            success: function () { }
        },

        serialize: function (obj) {
            var str = [], p;

            for (p in obj) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        },

        failCallback: function (data) {

            if (data.responseText) {
                console.error("error - " + JSON.stringify(data.responseText));
            }

        },

        doAJAX: function (ajaxOptions) {

            var that = this;

            return reqwest(ajaxOptions)
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

            this.doAJAX(ajaxOptions);

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

            return this.doAJAX(ajaxOptions);

        },

        postData: function (url, options) {

            var that = this,
                ajaxOptions = $.extend({},
                            this.ajaxSettings,
                            {
                                method: "post"
                            },
                            options, { "url": url });

            return reqwest(ajaxOptions)
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

            return reqwest(ajaxOptions)
             .fail(function (e) {

                 that.failCallback(e);

             });

        },

        deleteData: function (url, options) {

            var that = this,
                ajaxOptions = $.extend({},
                this.ajaxSettings,
                {
                    method: "delete"
                },
                options, { "url": url });

            return reqwest(ajaxOptions)
             .fail(function (e) {

                 that.failCallback(e);

             });

        }

    };

    // Give the init function the rqHTTP prototype for later instantiation
    rqHTTP.fn.init.prototype = rqHTTP.fn;

    return (window.rqHTTP = rqHTTP);

}(window));

