;



(function (window, undefined) {

    "use strict";


    rivets.formatters.percent = function (value) {

    	value = Math.round(value);
        return value + '%';
    }

    rivets.formatters.currency = function (value) {

    	if (isNaN(value)) {
    		return value;
    	} else {
    		return '$' + value;
    	}
        
    }

}(window));
