//The Panorama library is an effort to recreate the Metro UI Panoroma control functionality available
//to native Windows Phone Applications. The Panorama allows the web application to render content
//in organized sections or panels horizontally. This enables the client designer to make a much 
//richer user experience by displaying content to the user in a much more interactive manor.
//On touch devices the user can simply swipe to the right or left to change the panel in view.
//The swipe experience is continuous so the user could swipe to the right or left and the 
//panorama would seamlessly continue without interruption.

//For the panel movement I Borrowed form jQUery Transit
//https://github.com/rstacruz/jquery.transit

(function (window, $, undefined) {

    "use strict";

    var panorama = function (container, customSettings) {

        return new panorama.fn.init(container, customSettings);
    };

    panorama.fn = panorama.prototype = {

        constructor: panorama,

        init: function (container, customSettings) {

            this.settings = $.extend({}, this.settings, customSettings);
            this.setupElements(container);
            this.setPanoramaDimensions();
            this.buildTransitionValue();
            this.buildVendorNames();
            this.support.transitionEnd =
                                this.eventNames[this.support.transition] || null;

            this.bindEvents();

            this.moveRightCallback();

            this.currentPanel = 2;

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
                pbs = this.panelbody.style,
                i = 0,
                header = this.header;

            this.container.style.height = (settings.panelHeight - settings.footerHeight - settings.headerHeight) + "px";
            pbs.height = this.container.style.height; //(this.settings.panelHeight - headerHeight) + "px";
            //this.panelbody.style.top = headerHeight + "px";
            pbs.width = (this.totalPanels * pw) + "px";
            pbs.left = -pw + "px";

            for (i = 0; i < this.panels.length; i++) {
                this.panels[i].style.width = pw + "px";
                this.panels[i].style.minHeight = pbs.height; //this.panelbody.style.height;
            }

            if (this.headerPanels.length > 1) {

                headerWidth = 0;

                for (var i = 0; i < this.headerPanels.length; i++) {
                    headerWidth += this.headerPanels[i].offsetWidth;
                }

                headerWidth = headerWidth * 1.35; //add some width to make sure we cover the width we need

            }

            if (header) {

                var hs = header.style;

                if (this.headerPanels && this.headerPanels.length > 0) {
                    hs.width = headerWidth + "px";
                    hs.left = -parseInt(this.headerPanels[0].offsetWidth, 10) + "px";
                } else {
                    hs.width = headerWidth + "px";
                    hs.paddingLeft =
                    hs.paddingRight = settings.panelWidth + "px";
                    hs.left =
                        settings.bigHeaderLeft = -settings.panelWidth + "px";
                }
            }

            if (settings.contentResize && typeof settings.contentResize === "function") {
                settings.contentResize();
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
            this.panelbody.addEventListener(this.support.transitionEnd, function (e) {

                if (that.tEndCB !== undefined) {
                    that.tEndCB();
                }

                if (that.tHeaderEndCB !== undefined) {
                    that.tHeaderEndCB();
                }

            });

            window.addEventListener("orientationchange", function (e) {
                that.resizePanorama(e);
            });

            window.addEventListener("resize", function (e) {
                that.resizePanorama(e);
            });

        },

        resizePanorama: function (e) {

            this.settings.windowWidth = window.innerWidth;
            this.settings.panelWidth = window.innerWidth;
            this.settings.panelHeight = window.innerHeight;

            if ((this.settings.maxWidth <= window.innerWidth ||
                this.settings.maxHeight <= window.innerHeight) &&
                this.isApplied){

                this.isApplied = false;
                this.settings.canMove = false;
                this.clearPanoramaSettings();

            } else {

                this.isApplied = true;
                this.settings.canMove = true;
                this.setPanoramaDimensions();
            }

        },

        isApplied: false,
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

        moveHeader: function (moveLeft) {

            var that = this,
                activeWidth = 0;

            if (moveLeft === undefined) {
                moveLeft = true; //assume moving to the left
            }

            if (that.header) {

                if (that.headerPanels && that.headerPanels.length > 1) {
                    //move the width of the 2nd panel in the list then move the farthest to the r || l to the other end

                    if (moveLeft) {
                        activeWidth = -parseInt(that.headerPanels[1].offsetWidth, 10);
                    } else {
                        activeWidth = parseInt(that.headerPanels[0].offsetWidth, 10);
                    }

                    that.header.style[that.support.transition] = that.headerTransitionValue;

                    that.header.style[that.support.transform] = that.support.transform3d ?
                                                'translate3D(' + activeWidth + 'px, 0, 0)' :
                                                'translateX(' + activeWidth + 'px)';

                } else {//just move a % to the left or right

                    if (this.currentPanel == 2) {
                        this.bigHeaderTrans = 0;
                    } else {

                        if (moveLeft) {
                            this.bigHeaderTrans -=
                                    (that.settings.panelWidth * that.settings.headerSlide);

                        } else {
                            this.bigHeaderTrans +=
                                    (that.settings.panelWidth * that.settings.headerSlide);

                        }

                    }

                    var bigHeader = document.querySelector(".big-header");

                    bigHeader.style[that.support.transition] = that.headerTransitionValue;

                    bigHeader.style[that.support.transform] = that.support.transform3d ?
                                                'translate3D(' + this.bigHeaderTrans + 'px, 0, 0)' :
                                                'translateX(' + this.bigHeaderTrans + 'px)';

                }


                if (!moveLeft) {
                    that.tHeaderEndCB = (that.headerPanels.length > 1) ?
                                            that.endHeaderRight :
                                            function () {
                                                that.endBigHeaderRight(activeWidth);
                                            };
                } else {
                    that.tHeaderEndCB = (that.headerPanels.length > 1) ?
                                            that.endHeaderLeft :
                                            function () {
                                                that.endBigHeaderLeft(activeWidth);
                                            };
                }

            }

        },

        endBigHeaderLeft: function (shift) {

            var that = this;

            //that.header.style[that.support.transition] = that.fastTransition;
            //that.header.style[that.support.transform] = "";

            //if (this.currentPanel == 2) {
            //    that.header.style.left = that.settings.bigHeaderLeft + "px";
            //} else {
            //    that.header.style.left = parseInt(that.header.style.left, 10) + shift + "px";
            //}

        },

        endBigHeaderRight: function (shift) {

            var that = this;

            //that.header.style[that.support.transition] = that.fastTransition;
            //that.header.style[that.support.transform] = "";

            //if (this.currentPanel == 2) {
            //    that.header.style.left = that.settings.bigHeaderLeft + "px";
            //} else {
            //    that.header.style.left = parseInt(that.header.style.left, 10) + shift + "px";
            //}

        },

        endHeaderLeft: function () {

            var that = this;

            var childNodes = that.headerPanels;

            that.header.style[that.support.transition] = that.fastTransition;
            that.header.appendChild(this.getFirstPanel(childNodes));
            that.header.style[that.support.transform] = "";
            that.headerPanels = document.querySelectorAll(that.settings.headerPanelStyle);

            this.header.style.left = -parseInt(this.headerPanels[0].offsetWidth, 10) + "px";

        },

        endHeaderRight: function () {

            var that = this;

            var childNodes = that.headerPanels;

            that.header.style[that.support.transition] = that.fastTransition;
            that.header.insertBefore(that.getLastPanel(childNodes), that.header.firstChild);
            that.header.style[that.support.transform] = "";
            that.headerPanels = document.querySelectorAll(that.settings.headerPanelStyle);

            this.header.style.left = -parseInt(this.headerPanels[0].offsetWidth, 10) + "px";

        },

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

            if (!this.settings.canMove) {
                return;
            }

            var target = e.target,
                i = 0;

            x = x || this.settings.panelWidth - this.settings.peekWidth;

            this.currentPanel += 1;

            if (this.currentPanel > this.totalPanels) {
                this.currentPanel = 1;
            }

            this.moveHeader(true);
            this.movePanels(-x, this.moveLeftCallback);

            for (i = 0; i < this._moveNextCB.length; i++) {

                if (this._moveNextCB[i]) {
                    this._moveNextCB[i].call(this.currentPanel);
                }

            }

        },

        moveRight: function (e, x) {

            if (!this.settings.canMove) {
                return;
            }

            var target = e.target,
                i = 0;

            x = x || this.settings.panelWidth - this.settings.peekWidth;

            this.currentPanel -= 1;

            if (this.currentPanel < 1) {
                this.currentPanel = this.totalPanels;
            }

            this.moveHeader(false);
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

            contentResize: $.noop(),

            maxWidth: Math.ceil(),
            maxHeight: Math.ceil(),
            canMove: true,

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
            footerHeight: 35

        }

    };

    // Give the init function the panoram prototype for later instantiation
    panorama.fn.init.prototype = panorama.fn;


    return (window.panorama = panorama);

}(window, $));

