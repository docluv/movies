;

(function () {

	"use strict";

	var movieController = Controller.extend({

	    init: function (rootScope, response) {

	        this._super(rootScope, response);

	    },

	    isVisible: false

	});

	return (window.movieController = movieController);


})();