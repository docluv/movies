
panorama.fn.moveHeader = function (moveLeft) {

    var that = this,
        activeWidth;

    if (that.header) {

        if (moveLeft === undefined) {
            moveLeft = true; //assume moving to the left
        }

        activeWidth = 0;

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

            if (bigHeader) {

                bigHeader.style[that.support.transition] = that.headerTransitionValue;

                bigHeader.style[that.support.transform] = that.support.transform3d ?
                                            'translate3D(' + this.bigHeaderTrans + 'px, 0, 0)' :
                                            'translateX(' + this.bigHeaderTrans + 'px)';

            }
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

};

panorama.fn.endBigHeaderLeft = function (shift) {

    var that = this;

    //that.header.style[that.support.transition] = that.fastTransition;
    //that.header.style[that.support.transform] = "";

    //if (this.currentPanel == 2) {
    //    that.header.style.left = that.settings.bigHeaderLeft + "px";
    //} else {
    //    that.header.style.left = parseInt(that.header.style.left, 10) + shift + "px";
    //}

};

panorama.fn.endBigHeaderRight = function (shift) {

    var that = this;

    //that.header.style[that.support.transition] = that.fastTransition;
    //that.header.style[that.support.transform] = "";

    //if (this.currentPanel == 2) {
    //    that.header.style.left = that.settings.bigHeaderLeft + "px";
    //} else {
    //    that.header.style.left = parseInt(that.header.style.left, 10) + shift + "px";
    //}

};

panorama.fn.endHeaderLeft = function () {

    var that = this,
        childNodes = that.headerPanels;

    that.header.style[that.support.transition] = that.fastTransition;
    that.header.appendChild(this.getFirstPanel(childNodes));
    that.header.style[that.support.transform] = "";
    that.headerPanels = document.querySelectorAll(that.settings.headerPanelStyle);

    this.header.style.left = -parseInt(this.headerPanels[0].offsetWidth, 10) + "px";

};

panorama.fn.endHeaderRight = function () {

    var that = this,
        childNodes = that.headerPanels;

    that.header.style[that.support.transition] = that.fastTransition;
    that.header.insertBefore(that.getLastPanel(childNodes), that.header.firstChild);
    that.header.style[that.support.transform] = "";
    that.headerPanels = document.querySelectorAll(that.settings.headerPanelStyle);

    this.header.style.left = -parseInt(this.headerPanels[0].offsetWidth, 10) + "px";

};
