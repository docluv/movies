//The Panorama library is an effort to recreate the Metro UI Panoroma control functionality available
//to native Windows Phone Applications. The Panorama allows the web application to render content
//in organized sections or panels horizontally. This enables the client designer to make a much 
//richer user experience by displaying content to the user in a much more interactive manor.
//On touch devices the user can simply swipe to the right or left to change the panel in view.
//The swipe experience is continuous so the user could swipe to the right or left and the 
//panorama would seamlessly continue without interruption.

(function (window, $, undefined) {

    "use strict";

    var panorama = function (container, customSettings) {

        var that = new panorama.fn.init(container, customSettings);

        that.settings = $.extend({}, that.settings, customSettings);
        that.setupElements(container);
        that.resizePanorama();
        that.buildTransitionValue();
        that.buildVendorNames();
        that.support.transitionEnd =
                        that.eventNames[that.support.transition] || null;

        that.bindEvents();

        that.moveRightCallback();

        that.currentPanel = 2;

        return that;

    };

    panorama.fn = panorama.prototype = {

        constructor: panorama,

        init: function () {
            return this;
        },

        version: "0.0.2",

        div: undefined,
        currentPanel: 1,
        leftPanel: 1,
        totalPanels: 1,
        support: {},
        eventNames: {
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'WebkitTransition': 'webkitTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },

        headerTransitionValue: "all 1000ms ease-in-out",
        transitionValue: "all 1000ms ease-in-out",
        fastTransition: "all 0ms",

        buildTransitionValue: function () {

            this.transitionValue = "all " +
                this.settings.speed + "ms " +
                this.settings.easing;

            this.headerTransitionValue = "all " +
                (this.settings.speed - 100) + "ms " +
                this.settings.easing;

            return this; //why not make it chainable LOL
        },

        buildVendorNames: function () {

            this.div = document.createElement('div');

            // Check for the browser's transitions support.
            this.support.transition = $.getVendorPropertyName('transition');
            this.support.transitionDelay = $.getVendorPropertyName('transitionDelay');
            this.support.transform = $.getVendorPropertyName('transform');
            this.support.transformOrigin = $.getVendorPropertyName('transformOrigin');
            this.support.transform3d = $.checkTransform3dSupport();

            // Avoid memory leak in IE.
            this.div = null;

        },

        setPanoramaDimensions: function () {

            //should not need to set each panel as the content will determin their height.
            //if they need to be scrolled we will leave that to the developer to handle.

            var settings = this.settings,
                pw = settings.panelWidth - settings.peekWidth,
                headerHeight = settings.headerHeight,
                headerWidth = settings.panelWidth * 3,
                panelHeight = settings.panelHeight - settings.headerHeight - settings.bottomMargin;

            this.container.style.height = panelHeight + "px";
            this.panelbody.style.height = panelHeight + "px";
        //    this.panelbody.style.top = headerHeight + "px";
            this.panelbody.style.width = (this.totalPanels * pw) + "px";
            this.panelbody.style.left = -pw + "px";

            for (var i = 0; i < this.panels.length; i++) {
                this.panels[i].style.width = pw + "px";
               // this.panels[i].style.minHeight = this.panelbody.style.height;
            }

            if (this.headerPanels.length > 1) {

                headerWidth = 0;

                for (var i = 0; i < this.headerPanels.length; i++) {
                    headerWidth += this.headerPanels[i].offsetWidth;
                }

                headerWidth = headerWidth * 1.35; //add some width to make sure we cover the width we need

            }

            if (this.header) {

                var style = this.header.style;

                if (this.headerPanels && this.headerPanels.length > 0) {
                    style.width = headerWidth + "px"
                    style.left = -parseInt(this.headerPanels[0].offsetWidth, 10) + "px";
                } else {
                    style.width = headerWidth + "px";
                    style.paddingLeft =
                    style.paddingRight = settings.panelWidth + "px";
                    style.left =
                        this.settings.bigHeaderLeft =
                        -this.settings.panelWidth + "px";
                }
            }

        },

        clearPanoramaSettings: function () {

            var i = 0,
                panelbody = this.panelbody;

            panelbody.style.height =
            panelbody.style.top =
            panelbody.style.width =
            panelbody.style.left =
                this.container.style.height = "";

            for (i = 0; i < this.panels.length; i++) {
                this.panels[i].style.minHeight = this.panels[i].style.width = "";
            }

            if (this.header) {

                if (this.headerPanels && this.headerPanels.length > 0) {
                    this.header.style.width =
                        this.header.style.left = "";
                } else {
                    this.header.style.width =
                        this.header.style.paddingLeft =
                        this.header.style.paddingRight =
                        this.header.style.left =
                        this.settings.bigHeaderLeft = "";
                }
            }

            //this.panelbody.removeEventListener(this.support.transitionEnd, transitionEnd);
            this.container = undefined;
            this.panelbody = undefined;
            this.panels = undefined;
            this.header = undefined;
            this.headerPanels = undefined;
        },

        setupElements: function (container) {
            //The wrapping element
            if (!container) {
                this.container = document.querySelector(this.settings.container);
            } else {
                this.container = container;
            }
            //The main element
            this.panelbody = document.querySelector(
                                    this.settings.container + "  " +
                                    this.settings.panoramaSelector);
            //the panels
            this.panels = document.querySelectorAll(
                                    this.settings.container + "  " +
                                    this.settings.panoramaSelector + "  " +
                                    this.settings.singleColumnSelector);

            this.totalPanels = this.panels.length;

            this.header = document.querySelector(this.settings.headerStyle);

            this.headerPanels = document.querySelectorAll(this.settings.headerPanelStyle);

        },

        bindEvents: function () {

            var that = this;

            //This gets called when the animation is complete
            this.panelbody.addEventListener(this.support.transitionEnd, function transitionEnd(e) {

                if (that.tEndCB !== undefined) {
                    that.tEndCB();
                }

                if (that.tHeaderEndCB !== undefined) {
                    that.tHeaderEndCB();
                }

            });

            //window.addEventListener("orientationchange", function (e) {
            //    that.resizePanorama(e);
            //});

            window.addEventListener("resize", function (e) {
                that.resizePanorama(e);
            });

        },

    //    isApplied: false,

        resizePanorama: function () {

            var settings = this.settings;

            settings.windowWidth = window.innerWidth;
            settings.panelWidth = window.innerWidth;
            settings.panelHeight = window.innerHeight;

            if ((settings.maxWidth <= window.innerWidth ||
                settings.maxHeight <= window.innerHeight)
                // && this.isApplied
                ) {

//                this.isApplied = false;
                settings.canMove = false;
                this.clearPanoramaSettings();

            } else {

  //              this.isApplied = true;
                settings.canMove = true;
                this.setPanoramaDimensions();
            }

        },

        tEndCB: undefined,
        tHeaderEndCB: undefined,

        moveQue: [],
        moving: false,

        executeMove: function () {

            var move = this.moveQue.shift();

            if (move !== undefined) {

                this.moving = true;

                this.tEndCB = move.cb;

                this.panelbody.style[this.support.transition] = this.transitionValue;

                this.panelbody.style[this.support.transform] = this.support.transform3d ?
                                                'translate3D(' + move.value + 'px, 0, 0)' :
                                                'translateX(' + move.value + 'px)';

            } else {
                this.moving = false;
            }

        },

        movePanels: function (value, cb) {

            var move = {
                cb: cb,
                value: value
            };

            if (this.moving) {
                return;
            }

            this.moveQue.push(move);

            if (!this.moving) {
                this.executeMove();
            }

        },

        _movePrevCB: [],
        _moveNextCB: [],

        movePrevious: function (cb) {

            if (cb) {
                this._movePrevCB.push(cb);
            }

            return this;
        },

        moveNext: function (cb) {

            if (cb) {
                this._moveNextCB.push(cb);
            }

            return this;
        },

        moveLeft: function (e, x) {

            var target = e.target,
                i = 0;

            x = x || this.settings.panelWidth - this.settings.peekWidth;

            this.currentPanel += 1;

            if (this.currentPanel > this.totalPanels) {
                this.currentPanel = 1;
            }

            if (this.moveHeader) {
                this.moveHeader(true);
            }
            
            this.movePanels(-x, this.moveLeftCallback);

            for (i = 0; i < this._moveNextCB.length; i++) {

                if (this._moveNextCB[i]) {
                    this._moveNextCB[i].call(this.currentPanel);
                }

            }

        },

        moveRight: function (e, x) {

            var target = e.target,
                i = 0;

            x = x || this.settings.panelWidth - this.settings.peekWidth;

            this.currentPanel -= 1;

            if (this.currentPanel < 1) {
                this.currentPanel = this.totalPanels;
            }

            if (this.moveHeader) {
                this.moveHeader(true);
            }
            
            this.movePanels(x, this.moveRightCallback);

            for (i = 0; i < this._movePrevCB.length; i++) {

                if (this._movePrevCB[i]) {
                    this._movePrevCB[i].call(this.currentPanel);
                }

            }

        },

        moveLastPanel: function () {

            var parentNode = this.panelbody,
                    childNodes = parentNode.childNodes;

            parentNode.style[this.support.transition] = this.fastTransition;
            parentNode.appendChild(this.getFirstPanel(childNodes));
            parentNode.style[this.support.transform] = "";

        },

        moveLeftCallback: function (parentNode) {

            parentNode = parentNode || this.panelbody;

            var childNodes = parentNode.childNodes;

            parentNode.style[this.support.transition] = this.fastTransition;
            parentNode.appendChild(this.getFirstPanel(childNodes));
            parentNode.style[this.support.transform] = "";

            this.moving = false;

            this.executeMove();

        },

        moveRightCallback: function (parentNode) {

            parentNode = parentNode || this.panelbody;

            var childNodes = parentNode.childNodes;

            parentNode.style[this.support.transition] = this.fastTransition;
            parentNode.insertBefore(this.getLastPanel(childNodes), parentNode.firstChild);
            parentNode.style[this.support.transform] = "";

            this.moving = false;
            this.executeMove();

        },

        getFirstPanel: function (childNodes) {
            var j;

            for (j = 0; j < childNodes.length; j++) {
                if (childNodes[j].nodeType === 1) {
                    return childNodes[j];
                }
            }

        },

        getLastPanel: function (childNodes) {
            var j;

            for (j = childNodes.length - 1; j !== 0; j--) {
                if (childNodes[j].nodeType === 1) {
                    return childNodes[j];
                }
            }

        },

        moveCallback: function (e, x) {

            this.movePanels(x, this.moveLeftCallback);

        },

        container: undefined,
        panelbody: undefined,
        panels: undefined,
        header: undefined,
        headerPanels: undefined,

        bigHeaderTrans: 0,

        settings: {
            panoramaSelector: ".panorama-panels",
            container: ".panorama-container",
            singleColumnSelector: ".single-panel",
            doubleColumnSelector: ".double-panel",
            speed: 150,     //speed of each slide animation
            //    easing: 'swing', //easing effect for the slide animation

            windowWidth: window.innerWidth,
            panelWidth: window.innerWidth,
            panelHeight: window.innerHeight,

            peekWidth: 35,

            easing: "ease-in-out",

            // This are for wings - To Come later
            nextScroll: ".panorama-next",
            prevScroll: ".panorama-prev",
            navWrapper: ".panorama-navigation",
            showPrevNext: false, //do this when no touch available

            headerSlide: .2,
            bigHeaderLeft: 0,

            headerStyle: ".panorama-header",
            headerPanelStyle: ".panorama-panel-header",
            headerHeight: 40,

            bottomMargin: 35
        }

    };

    // Give the init function the panoram prototype for later instantiation
    panorama.fn.init.prototype = panorama.fn;


    return (window.panorama = panorama);

}(window, $()));

