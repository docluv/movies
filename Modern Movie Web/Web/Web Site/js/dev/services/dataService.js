;

(function () {

    "use strict";

    var DataService = Class.extend({

        init: function (http) {

            if (!http) {
                throw {
                    "Title": "Missing http",
                    "Message": "The http must be supplied to have a valid view"
                };
            }

            this.http = http;
        },

        http: undefined,


        FORM_ENCODED: "application/x-www-form-urlencoded",
        JSON_ENCODED: "application/x-json",

        // Variable used to set whether the device is offline
        deviceOffline: false,


        getData: function (config) {

            var data = this,
                url = config.url,
                callback = config.callback,
                headers = config.headers || {},
                encoding = config.encoding || data.FORM_ENCODED;


            return data.http.getData(url, {
                data: config.data,
                contentType: encoding,
                success: callback,
                error: config.error || data.errorCallback,
                headers: headers
            });

        },

        getJSONP: function (url, callback, headers, error) {

            var data = this;

            headers = headers || {};

            return data.http.getJSONP(url, {
                success: function (resp) {

                    callback(resp);

                },
                error: error || data.errorCallback,
                headers: headers

            });

        },

        postData: function (config) {

            var data = this,
                url = config.url,
                postData = config.data,
                callback = config.callback,
                headers = config.headers || {},
                encoding = config.encoding || data.FORM_ENCODED;
            
            return data.http.postData(url, {
                data: postData,
                contentType: encoding,
                success: function (resp) {

                    if (callback) {
                        callback(resp);
                    }

                },
                // error: error || data.errorCallback,
                error: config.error || data.errorCallback,
                headers: headers
            });

        },

        putData: function (config) {

            var data = this,
                url = config.url,
                callback = config.callback,
                headers = config.headers || {},
                encoding = config.encoding || data.FORM_ENCODED;

            return data.http.putData(url, {
                data: config.data,
                contentType: encoding,
                success: callback,
                error: config.error || data.errorCallback,
                headers: headers
            });

        },

        deleteData: function (url, deleteData, callback, headers, error, encoding) {

            var data = this;

            headers = headers || {};

            return data.http.deleteData(url, {
                data: deleteData,
                contentType: encoding || data.FORM_ENCODED,
                success: function (resp) {

                    if (callback) {

                        callback(resp);

                    }

                },
                // error: error || data.errorCallback,
                error: data.errorCallback,
                headers: headers

            });

        },

        errorCallback: function (err) {

            err = JSON.parse(err.response);
            
            if (err) {
                console.error(err.message);
            }

        },

        version: "0.0.1"

    });

    return (window.DataService = DataService);

})();