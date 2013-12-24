//The Panorama library is an effort to recreate the Metro UI Panoroma control functionality available
//to native Windows Phone Applications. The Panorama allows the web application to render content
//in organized sections or panels horizontally. This enables the client designer to make a much 
//richer user experience by displaying content to the user in a much more interactive manor.
//On touch devices the user can simply swipe to the right or left to change the panel in view.
//The swipe experience is continuous so the user could swipe to the right or left and the 
//panorama would seamlessly continue without interruption.

(function (window, undefined) {

    "use strict";

    var panorama = function (container, customSettings) {

        var that = new panorama.fn.init(container, customSettings);

        that.settings = $().extend({}, that.settings, customSettings);
        that.buildVendorNames();

        that.setupElements(container);
        that.resizePanorama();
        that.buildTransitionValue();

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

            var that = this,
                support = that.support,
                settings = that.settings;

            that.transitionValue = "all " +
                settings.speed + "ms " +
                settings.easing;

            that.headerTransitionValue = "all " +
                (settings.speed - 100) + "ms " +
                settings.easing;

            return this; //why not make it chainable LOL
        },

        buildVendorNames: function () {

            var that = this,
                $$ = $();

            that.div = document.createElement('div');

            // Check for the browser's transitions support.
            that.support.transition = $$.getVendorPropertyName('transition');
            that.support.transitionDelay = $$.getVendorPropertyName('transitionDelay');
            that.support.transform = $$.getVendorPropertyName('transform');
            that.support.transformOrigin = $$.getVendorPropertyName('transformOrigin');
            that.support.transform3d = $$.checkTransform3dSupport();

            // Avoid memory leak in IE.
            that.div = null;

        },

        setPanoramaDimensions: function () {

            //should not need to set each panel as the content will determin their height.
            //if they need to be scrolled we will leave that to the developer to handle.

            var that = this,
                settings = that.settings,
                pw = settings.panelWidth - settings.peekWidth,
                headerHeight = settings.headerHeight,
                headerWidth = settings.panelWidth * 3,
                panelHeight = settings.panelHeight - settings.headerHeight - settings.bottomMargin;

            that.container.style.height = panelHeight + "px";
            that.panelbody.style.height = panelHeight + "px";
            //    that.panelbody.style.top = headerHeight + "px";
            that.panelbody.style.width = (that.totalPanels * pw) + "px";
            that.panelbody.style.left = -pw + "px";

            for (var i = 0; i < that.panels.length; i++) {
                that.panels[i].style.width = pw + "px";
                // that.panels[i].style.minHeight = that.panelbody.style.height;
            }

            if (that.headerPanels.length > 1) {

                headerWidth = 0;

                for (i = 0; i < that.headerPanels.length; i++) {
                    headerWidth += that.headerPanels[i].offsetWidth;
                }

                headerWidth = headerWidth * 1.35; //add some width to make sure we cover the width we need

            }

            if (that.header) {

                var style = that.header.style;

                if (that.headerPanels && that.headerPanels.length > 0) {
                    style.width = headerWidth + "px";
                    style.left = -parseInt(that.headerPanels[0].offsetWidth, 10) + "px";
                } else {
                    style.width = headerWidth + "px";
                    style.paddingLeft =
                    style.paddingRight = settings.panelWidth + "px";
                    style.left =
                        that.settings.bigHeaderLeft =
                        -that.settings.panelWidth + "px";
                }
            }

        },

        clearPanoramaSettings: function () {

            var i = 0, that = this,
                panelbody = that.panelbody;

            if (panelbody && that.panels && that.header) {
                panelbody.style.height =
                panelbody.style.top =
                panelbody.style.width =
                panelbody.style.left =
                    that.container.style.height = "";


                for (i = 0; i < that.panels.length; i++) {
                    that.panels[i].style.minHeight = that.panels[i].style.width = "";
                }

                if (that.header) {

                    if (that.headerPanels && that.headerPanels.length > 0) {
                        that.header.style.width =
                            that.header.style.left = "";
                    } else {
                        that.header.style.width =
                            that.header.style.paddingLeft =
                            that.header.style.paddingRight =
                            that.header.style.left =
                            that.settings.bigHeaderLeft = "";
                    }
                }

                //that.panelbody.removeEventListener(that.support.transitionEnd, transitionEnd);
                that.container = undefined;
                that.panelbody = undefined;
                that.panels = undefined;
                that.header = undefined;
                that.headerPanels = undefined;
            }
        },

        setupElements: function (container) {

            var that = this;
            //The wrapping element
            if (!container) {
                that.container = document.querySelector(that.settings.container);
            } else {
                that.container = container;
            }
            //The main element
            that.panelbody = document.querySelector(
                                    that.settings.container + "  " +
                                    that.settings.panoramaSelector);
            //the panels
            that.panels = document.querySelectorAll(
                                    that.settings.container + "  " +
                                    that.settings.panoramaSelector + "  " +
                                    that.settings.singleColumnSelector);

            that.totalPanels = that.panels.length;

            that.header = document.querySelector(that.settings.headerStyle);

            that.headerPanels = document.querySelectorAll(that.settings.headerPanelStyle);

        },

        bindEvents: function () {

            var that = this;

            //This gets called when the animation is complete
            that.panelbody.addEventListener(that.support.transitionEnd, function transitionEnd(e) {

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

            var that = this,
                move = that.moveQue.shift();

            if (move !== undefined) {

                that.moving = true;

                that.tEndCB = move.cb;

                that.panelbody.style[that.support.transition] = that.transitionValue;

                that.panelbody.style[that.support.transform] = that.support.transform3d ?
                                                'translate3D(' + move.value + 'px, 0, 0)' :
                                                'translateX(' + move.value + 'px)';

            } else {
                that.moving = false;
            }

        },

        movePanels: function (value, cb) {

            var that = this,
                move = {
                    cb: cb,
                    value: value
                };

            if (that.moving) {
                return;
            }

            that.moveQue.push(move);

            if (!that.moving) {
                that.executeMove();
            }

        },

        _movePrevCB: [],
        _moveNextCB: [],

        movePrevious: function (cb) {

            if (cb) {
                that._movePrevCB.push(cb);
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
                i = 0, that = this;

            x = x || that.settings.panelWidth - that.settings.peekWidth;

            that.currentPanel += 1;

            if (that.currentPanel > that.totalPanels) {
                that.currentPanel = 1;
            }

            if (that.moveHeader) {
                that.moveHeader(true);
            }

            that.movePanels(-x, that.moveLeftCallback);

            for (i = 0; i < that._moveNextCB.length; i++) {

                if (that._moveNextCB[i]) {
                    that._moveNextCB[i].call(that.currentPanel);
                }

            }

        },

        moveRight: function (e, x) {

            var target = e.target,
                i = 0, that = this;

            x = x || that.settings.panelWidth - that.settings.peekWidth;

            that.currentPanel -= 1;

            if (that.currentPanel < 1) {
                that.currentPanel = that.totalPanels;
            }

            if (that.moveHeader) {
                that.moveHeader(true);
            }

            that.movePanels(x, that.moveRightCallback);

            for (i = 0; i < that._movePrevCB.length; i++) {

                if (that._movePrevCB[i]) {
                    that._movePrevCB[i].call(that.currentPanel);
                }

            }

        },

        moveLastPanel: function () {

            var that = this,
                parentNode = that.panelbody,
                    childNodes = parentNode.childNodes;

            parentNode.style[that.support.transition] = that.fastTransition;
            parentNode.appendChild(that.getFirstPanel(childNodes));
            parentNode.style[that.support.transform] = "";

        },

        moveLeftCallback: function (parentNode) {

            parentNode = parentNode || this.panelbody;

            var that = this,
                childNodes = parentNode.childNodes;

            parentNode.style[that.support.transition] = that.fastTransition;
            parentNode.appendChild(that.getFirstPanel(childNodes));
            parentNode.style[that.support.transform] = "";

            that.moving = false;

            that.executeMove();

        },

        moveRightCallback: function (parentNode) {

            parentNode = parentNode || this.panelbody;

            var that = this,
                childNodes = parentNode.childNodes;

            parentNode.style[that.support.transition] = that.fastTransition;
            parentNode.insertBefore(that.getLastPanel(childNodes), parentNode.firstChild);
            parentNode.style[that.support.transform] = "";

            that.moving = false;
            that.executeMove();

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

}(window));

