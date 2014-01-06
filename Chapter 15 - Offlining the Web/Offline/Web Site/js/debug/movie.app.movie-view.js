/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

(function (window, undefined) {

    "use strict";

    var showTimes = ".movie-showtime-list",
        castNames = ".cast-name-list",
        movieDesc = ".movie-description",
        showTimesTitle = ".movie-showtimes-panel > .panel-title",
        castNamesTitle = ".movie-cast-panel > .panel-title",
        movieDescTitle = ".movie-description-panel > .panel-title",
        showReview = "#showReview",
        reviewPanel = ".movie-review-panel",
        detailPanel = ".movie-details-panel",
        castPanel = ".movie-cast-panel",
        showtimesPanel = ".movie-showtimes-panel",
        descPanel = ".movie-description-panel",
        smallBreakpoint = 610,
        miniBreakpoint = 820,
        largebreakpoint = 1024;

    function qs(selector) {
        return document.querySelector(selector);
    };

    function getViewElements() {

        return {
            st: qs(showTimes),
            cn: qs(castNames),
            md: qs(movieDesc),
            stt: qs(showTimesTitle),
            cnt: qs(castNamesTitle),
            mdt: qs(movieDescTitle),
            sr: qs(showReview)
        };

    };

    movieApp.fn.movieView = {

        onload: function (params) {

            if (!params || !params.id) {
                this.showError("No Movie Id Requested");
                return;
            }

            var that = this,
                md = that.movieData,
                mv = this.movieView;

            md.loadMovieDetails.call(md, params.id, function (data) {

                if (!data) {
                    return;
                }

                mv.renderMovieDetails.call(that, data);

            });

        },

        renderMovieDetails: function (data) {

            if (data) {

                if (!data.id) {
                    //cause an automatic redirect to the not found page.
                    window.location.hash = "#!404";
                }

                var that = this,
                    mv = that.movieView,
                    width = window.innerWidth;

                that.mergeData(detailPanel, "movieDetailsPosterTemplate", data);
                that.mergeData(movieDesc, "movieDetailsDescriptionTemplate", data);
                that.mergeData(castNames, "movieDetailsCastTemplate", data);
                that.mergeData(showTimes, "MovieShowtimeTemplate", data);

                that.setMainTitle(data.title);

                mv.bindPanelTitles.call(that);

                mv.setupMQLs.call(that, mv);

                that.setupPanorama(".panorama-container", { maxWidth: smallBreakpoint });

                document.reviewForm.onsubmit = mv.reviewSubmit;

                //setup the initial layout
                requestAnimationFrame(function () {

                    if (width < smallBreakpoint) {
                        mv.renderSmallScreen.call(that);
                    } else if (width >= smallBreakpoint && width <= miniBreakpoint) {
                        mv.renderMiniTablet.call(that);
                    } else {
                        mv.renderFullScreen.call(that);
                    }

                    mv.setMoviePoster();

                });

            }

        },

        reviewSubmit: function (e) {

            e.preventDefault();

            if (!this.checkValidity()) {
                e.preventDefault();
                //Implement you own means of displaying error messages to the user here.
                console.info("not valid");
            }

            if (e.srcElement) {
                var i = 0,
                    data = {},
                    inputs = e.srcElement.querySelectorAll("input, textarea");

                for (; i < inputs.length; i++) {
                    data[inputs[i].name] = inputs[i].value;
                    console.info(inputs[i].name + " " + inputs[i].value);
                }

            }

            return false;

        },

        mql610: undefined,
        mql820: undefined,
        mql1024: undefined,

        //toying with the idea to refactor this into a common method.
        setupMQLs: function (mv) {

            var that = this;

            if (!mv.mql610) {

                mv.mql610 = window.matchMedia("(min-width: 610px)");

                mv.mql610.addListener(function (e) {

                    if (e.matches) {
                        mv.renderMiniTablet.call(that);
                    } else {
                        mv.renderSmallScreen.call(that);
                    }

                    mv.setMoviePoster(window.innerWidth);

                });

            }

            if (!mv.mql820) {

                mv.mql820 = window.matchMedia("(min-width: 820px)");

                mv.mql820.addListener(function (e) {

                    if (e.matches) {
                        mv.renderFullScreen.call(that);
                    } else {
                        mv.renderMiniTablet.call(that);
                    }

                    mv.setMoviePoster(window.innerWidth);

                });

            }

            if (!mv.mql1024) {

                mv.mql1024 = window.matchMedia("(min-width: 1024px)");

                mv.mql1024.addListener(function () {

                    mv.setMoviePoster(window.innerWidth);

                });

            }

        },

        bindPanelTitles: function () {

            var that = this;

            $(movieDesc).show();

            deeptissue(movieDescTitle).tap(function () {

                var width = window.innerWidth;

                if (width > smallBreakpoint && width < miniBreakpoint) {
                    that.movieView.displayDescription();
                }

            });

            deeptissue(castNamesTitle).tap(function () {

                var width = window.innerWidth;

                if (width > smallBreakpoint && width < miniBreakpoint) {

                    that.movieView.displayCastNames();

                }

            });

            deeptissue(showTimesTitle).tap(function () {

                var width = window.innerWidth;

                if (width > smallBreakpoint && width < miniBreakpoint) {

                    that.movieView.displayShowtimes();

                }

            });

            deeptissue(showReview).tap(function (e) {

                that.movieView.displayReview.call(that);

            });

        },

        boundCancel: false,

        displayReview: function () {

            var that = this;

            qs(reviewPanel).style.display = "block";
            qs(detailPanel).style.display = "none";
            qs(castPanel).style.display = "none";
            qs(showtimesPanel).style.display = "none";
            qs(descPanel).style.display = "none";

            document.getElementById("ReviewerName").focus();

            if (!that.movieView.boundCancel) {

                deeptissue(".review-cancel").tap(function (e) {

                    e.stopPropagation();
                    e.preventDefault();

                    that.movieView.hideReview();

                });

                that.movieView.boundCancel = true;
            }

        },

        hideReview: function () {

            qs(reviewPanel).style.display = "none";
            qs(detailPanel).style.display = "block";
            qs(castPanel).style.display = "block";
            qs(showtimesPanel).style.display = "block";
            qs(descPanel).style.display = "block";
        },

        displayShowtimes: function () {

            var ele = getViewElements();

            ele.st.style.display = "block";
            ele.sr.style.display = "block";
            ele.cn.style.display = "none";
            ele.md.style.display = "none";

            ele.st.style.position = "relative";
            ele.st.style.left = "-260px";

            ele.sr.style.position = "relative";
            ele.sr.style.left = "-200px";
            ele.sr.style.top = "30px";

            ele.stt.classList.add("selected");
            ele.cnt.classList.remove("selected");
            ele.mdt.classList.remove("selected");
        },

        displayCastNames: function () {

            var ele = getViewElements();

            ele.st.style.display = "none";
            ele.sr.style.display = "none";
            ele.cn.style.display = "block";
            ele.md.style.display = "none";

            ele.cn.style.position = "relative";
            ele.cn.style.left = "-130px";

            ele.stt.classList.remove("selected");
            ele.cnt.classList.add("selected");
            ele.mdt.classList.remove("selected");

        },

        displayDescription: function () {

            var ele = getViewElements();

            ele.st.style.display = "none";
            ele.sr.style.display = "none";
            ele.cn.style.display = "none";
            ele.cn.style.position = "";
            ele.cn.style.left = "";
            ele.md.style.display = "block";

            ele.stt.classList.remove("selected");
            ele.cnt.classList.remove("selected");
            ele.mdt.classList.add("selected");

        },

        clearMiniTablet: function () {

            var ele = getViewElements();

            ele.st.style.display = "block";
            ele.sr.style.display = "block";
            ele.cn.style.display = "block";
            ele.md.style.display = "block";

            ele.st.style.position = "";
            ele.st.style.left = "";

            ele.sr.style.position = "";
            ele.sr.style.left = "";
            ele.sr.style.top = "";

            ele.stt.classList.remove("selected");
            ele.cnt.classList.remove("selected");
            ele.mdt.classList.remove("selected");

        },

        renderSmallScreen: function () {

            this.movieView.clearMiniTablet();

            qs(showReview).style.display = "none";

            qs(showTimes).style.display = "block";
            qs(reviewPanel).style.display = "block";
            qs(castNames).style.display = "block";

        },

        renderMiniTablet: function () {

            $(showReview).hide();

//            $(movieDescriptionList).show();
            $(movieDesc).show();
            $(showTimes).hide();
            $(reviewPanel).hide();
      //      $(movieDetailList).hide();
            $(castNames).hide();

            var i = 0,
                panelWrapper = qs(".panorama-panels"),
                panels = document.querySelectorAll(".single-panel");

            for (; i < panels.length; i++) {
                panels[i].style.width = "";
            }

            panelWrapper.style.width = "";
            panelWrapper.style.height = "";
            panelWrapper.style.left = "";
        },

        renderFullScreen: function () {

            this.movieView.clearMiniTablet();

            qs(showTimes).style.display = "block";
            qs(reviewPanel).style.display = "";
            qs(castNames).style.display = "block";

        },

        setMoviePoster: function () {

            var width = window.innerWidth,
                poster = qs(".full-movie-poster");

            if (!poster) {
                return;
            }

            if (width > largebreakpoint) {

                poster.src = poster.src
                                    .replace("pro", "ori")
                                    .replace("det", "ori");

            } else {

                poster.src = poster.src
                                    .replace("pro", "det")
                                    .replace("ori", "det");

            }
        }

    };


}(window));