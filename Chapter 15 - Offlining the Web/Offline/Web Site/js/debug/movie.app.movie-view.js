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
        showReview = "#showReview";

    function qs(selector) {
        return document.querySelector(selector);
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

        unload: function () {

            //if (this.panorama) {

            //    this.panorama.destroy();
            //    this.panorama = undefined;

            //}

        },

        renderMovieDetails: function (data) {

            if (data) {

                var that = this,
                    mv = that.movieView,
                    width = window.innerWidth,
                    reviewSubmit = document.getElementById("reviewSubmit");

                that.mergeData(".movie-details-panel", "movieDetailsPosterTemplate", data);
                that.mergeData(movieDesc, "movieDetailsDescriptionTemplate", data);
                that.mergeData(castNames, "movieDetailsCastTemplate", data);
                that.mergeData(showTimes, "MovieShowtimeTemplate", data);

                that.setMainTitle(data.title);

                mv.bindPanelTitles.call(that);

                mv.setupMQLs.call(that, mv);

                that.setupPanorama(".panorama-container", { maxWidth: 610 });

                document.reviewForm.onsubmit = that.reviewSubmit;

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

            deeptissue(showReview).tap(function () {

                $(selectors.reviewPanel).show();
                $(selectors.detailPanel).hide();
                $(selectors.castPanel).hide();
                $(selectors.showtimesPanel).hide();
                $(selectors.descPanel).hide();

                document.getElementById("ReviewerName").focus();

            });

            deeptissue(document.getElementById("reviewCancel")).tap(function (e) {

                $(selectors.reviewPanel).hide();
                $(selectors.detailPanel).show();
                $(selectors.castPanel).show();
                $(selectors.showtimesPanel).show();
                $(selectors.descPanel).show();

            });

        },

        displayShowtimes: function () {

            var st = qs(showTimes),
                cn = qs(castNames),
                md = qs(movieDesc),
                stt = qs(showTimesTitle),
                cnt = qs(castNamesTitle),
                mdt = qs(movieDescTitle),
                sr = qs(showReview);

            st.style.display = "block";
            sr.style.display = "block";
            cn.style.display = "none";
            md.style.display = "none";

            st.style.position = "relative";
            st.style.left = "-260px";

            sr.style.position = "relative";
            sr.style.left = "-200px";
            sr.style.top = "30px";

            stt.classList.add("selected");
            cnt.classList.remove("selected");
            mdt.classList.remove("selected");
        },

        displayCastNames: function () {

            var st = qs(showTimes),
                cn = qs(castNames),
                md = qs(movieDesc),
                stt = qs(showTimesTitle),
                cnt = qs(castNamesTitle),
                mdt = qs(movieDescTitle);

            st.style.display = "none";
            qs(showReview).style.display = "none";
            cn.style.display = "block";
            md.style.display = "none";

            cn.style.position = "relative";
            cn.style.left = "-130px";

            stt.classList.remove("selected");
            cnt.classList.add("selected");
            mdt.classList.remove("selected");

        },

        displayDescription: function () {

            var st = qs(showTimes),
	            cn = qs(castNames),
                md = qs(movieDesc),
                stt = qs(showTimesTitle),
                cnt = qs(castNamesTitle),
                mdt = qs(movieDescTitle);

            st.style.display = "none";
            qs(showReview).style.display = "none";
            cn.style.display = "none";
            cn.style.position = "";
            cn.style.left = "";
            md.style.display = "block";

            stt.classList.remove("selected");
            cnt.classList.remove("selected");
            mdt.classList.add("selected");

        },

        clearMiniTablet: function () {

            var st = $(showTimes),
                cn = $(castNames),
                md = $(movieDesc),
                stt = $(showTimesTitle),
                cnt = $(castNamesTitle),
                mdt = $(movieDescTitle),
                sr = $(showReview);

            st.show();
            sr.show();
            cn.show();
            md.show();

            st[0].style.position = "";
            st[0].style.left = "";

            sr[0].style.position = "";
            sr[0].style.left = "";
            sr[0].style.top = "";

            stt.removeClass("selected");
            cnt.removeClass("selected");
            mdt.removeClass("selected");

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

        /*
        clearInlineRelativePostition: function (nodes) {

            if (!nodes.legth) {
                nodes = [nodes];
            }

            for (var i = 0; i < nodes.length; i++) {

                nodes[i].style.position = "";
                nodes[i].style.left = "";

            }

        }
        */
    };


}(window));