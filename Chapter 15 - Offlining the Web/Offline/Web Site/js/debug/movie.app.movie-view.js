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
        descPanel = ".movie-description-panel";

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

    movieApp.fn.movie = {
        Items: {
            reviewPanel: ".movie-review-panel",
            detailPanel: ".movie-details-panel",
            castPanel: ".movie-cast-panel",
            showtimesPanel: ".movie-showtimes-panel",
            descPanel: ".movie-description-panel"
        }
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

        //    unload: function () {

        //if (this.panorama) {

        //    this.panorama.destroy();
        //    this.panorama = undefined;

        //}

        //   },

        renderMovieDetails: function (data) {

            if (data) {

                if (!data.id) {
                    //cause an automatic redirect to the not found page.
                    window.location.hash = "#!404";
                }

                var that = this,
                    mv = that.movieView,
                    width = window.innerWidth;

                that.mergeData(".movie-details-panel", "movieDetailsPosterTemplate", data);
                that.mergeData(movieDesc, "movieDetailsDescriptionTemplate", data);
                that.mergeData(castNames, "movieDetailsCastTemplate", data);
                that.mergeData(showTimes, "MovieShowtimeTemplate", data);

                that.setMainTitle(data.title);

                mv.bindPanelTitles.call(that);

                mv.setupMQLs.call(that, mv);

                that.setupPanorama(".panorama-container", { maxWidth: 610 });

                document.reviewForm.onsubmit = mv.reviewSubmit;

                //setup the initial layout
                requestAnimationFrame(function () {

                    if (width < 610) {
                        mv.renderSmallScreen.call(that);
                    } else if (width >= 610 && width <= 820) {
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

        mql600: undefined,
        mql820: undefined,
        mql1024: undefined,

        //toying with the idea to refactor this into a common method.
        setupMQLs: function (mv) {

            var that = this;

            if (!mv.mql600) {

                mv.mql600 = window.matchMedia("(min-width: 610px)");

                mv.mql600.addListener(function (e) {

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

    var that = this,
        selectors = this.movie.Items;

    $(movieDesc).show();

    deeptissue(movieDescTitle).tap(function () {

                var width = window.innerWidth;

                if (width > 600 && width < 820) {
                    that.movieView.displayDescription();
                }

            });

    deeptissue(castNamesTitle).tap(function () {

                var width = window.innerWidth;

                if (width > 600 && width < 820) {

                    that.movieView.displayCastNames();

                }

            });

    deeptissue(showTimesTitle).tap(function () {

        var width = window.innerWidth;

        if (width > 600 && width < 820) {

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

            $(showReview).hide();

            $(showTimes).show();
            $(".movie-review-panel").show();
            $(".movie-details-list").show();
            $(".movie-descrption-list").show();
            $(castNames).show();

        },

        renderMiniTablet: function () {

            $(showReview).hide();

            $(".movie-descrption-list").show();
            $(movieDesc).show();
            $(showTimes).hide();
            $(".movie-review-panel").hide();
            $(".movie-details-list").hide();
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

            var sr = $(showReview),
                st = qs(showTimes);

            this.movieView.clearMiniTablet();

            st.style.position = "";
            st.style.left = "";
            st.style.display = "block";

            sr[0].style.position = "";
            sr[0].style.left = "";
            sr[0].style.top = "";

            $(".movie-review-panel").hide();
            $(".movie-details-list").show();
            $(".movie-descrption-list").show();
            qs(castNames).style.display = "block";


        },

        setMoviePoster: function () {

            var width = window.innerWidth,
                poster = qs(".full-movie-poster");

            if (!poster) {
                return;
            }

            if (width > 1024) {

                poster.src = poster.src
                                    .replace("pro", "ori")
                                    .replace("det", "ori");

            } else {

                poster.src = poster.src
                                    .replace("pro", "det")
                                    .replace("ori", "det");

            }
        },

    };


}(window));