
(function (document) {

    "use strict";

    window.MBP = window.MBP || {};

    //simple version of the jQuery function
    MBP.extend = function () {

        var target = arguments[0] || {},
            i = 1,
            src,
            name,
            copy,
            options,
            length = arguments.length;

        for (i = 1; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) !== null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;

    };

    MBP.buildVendorNames = function () {

        return {
            // Check for the browser's transitions support.
            transition: MBP.getVendorPropertyName('transition'),
            transitionDelay: MBP.getVendorPropertyName('transitionDelay'),
            transform: MBP.getVendorPropertyName('transform'),
            transformOrigin: MBP.getVendorPropertyName('transformOrigin'),
            transform3d: MBP.checkTransform3dSupport()

        };

    };

    MBP.getVendorPropertyName = function (prop) {

        var prefixes = ['Moz', 'Webkit', 'O', 'ms'],
                    vendorProp, i,
                    div = document.createElement('div'),
                    prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

        if (prop in div.style) {
            return prop;
        }

        for (i = 0; i < prefixes.length; ++i) {

            vendorProp = prefixes[i] + prop_;

            if (vendorProp in div.style) {
                return vendorProp;
            }

        }

        // Avoid memory leak in IE.
        this.div = null;
    };


    MBP.checkTransform3dSupport = function () {

        var div = document.createElement('div'),
            transform = MBP.getVendorPropertyName('transform');

        div.style[transform] = '';
        div.style[transform] = 'rotateY(90deg)';
        return div.style[transform] !== '';

    };

})(document);