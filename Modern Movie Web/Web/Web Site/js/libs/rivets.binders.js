;



(function (window, undefined) {

    "use strict";


    function startsWith(str, starts) {
        str += ''; starts += '';
        return str.length >= starts.length && str.substring(0, starts.length) === starts;
    };


    rivets.binders.cssclass = function (el, value) {

        if (typeof value !== "string") {
            return;
        }

        var i = 0;

        value = value.split(" ");

        for (; i < value.length; i++) {

            el.classList.add(value[i]);

        }

    }

    rivets.binders.setizzysprite = function (el, value) {

        if (typeof value !== "string") {
            return;
        }

        var i = 0,
            j = 0,
            classes = el.className.split(" ");

        value = value.split(" ");
        el.className = "";

        el.classList.add("sprite-izzy-circle");

        for (; j < classes.length; j++) {

            if (!startsWith(classes[j], "Izzy-c")) {

                el.className = el.className + " " + classes[j];
            }

        }

        for (; i < value.length; i++) {

            el.classList.add(value[i]);

        }

    }

    rivets.binders.showit = function (el, value) {

        if (value === true) {
    
            el.style.display = "block";

        }else{

            el.style.display = "none";

        }

    }

    rivets.binders.color = function (el, value) {
        el.style.color = value
    }


    rivets.binders.backgroundcolor = function (el, value) {
        el.style.backgroundColor = value
    }


    rivets.binders.selected = function (el, value) {

        if (value === true) {

            el.attributes.setAttribute("selected", "");
        }
    }

    rivets.binders.showloading = function (el, value) {

        if (value) {

            el.setAttribute("data-loading-prev", el.innerHTML);

            el.innerHTML = '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
            
        } else {

            var prev = el.getAttribute("data-loading-prev");

            if (prev) {
                el.innerHTML = prev;
            }

        }

    }

}(window));













