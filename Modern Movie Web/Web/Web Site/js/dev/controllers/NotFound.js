;

(function () {

	"use strict";

	movieApp.fn.NotFound = movieController.extend({

	    onload: function () {

	        var img = document.querySelector(".not-found-img");

	        if (img) {
	            img.src = img.getAttribute("data-src");
	        }

	        this.rootScope.setMainTitle("Sorry the Content You Reqested is Not Available");
	    }

	});

})();