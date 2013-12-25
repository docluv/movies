/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

(function (window, undefined) {

    "use strict";

    movieApp.fn.movie = {
        Items: {
            reviewPanel: ".movie-review-panel",
            detailPanel: ".movie-details-panel",
            castPanel: ".movie-cast-panel",
            showtimesPanel: ".movie-showtimes-panel",
            descPanel: ".movie-description-panel"
        }
    };

    var prevWidth = window.innerWidth;

    movieApp.fn.movieView = {

        onload: function (params) {

            if (!params || !params.id) {
                this.showError("No Movie Id Requested");
            }

            var that = this,
                mv = this.movieView;

            prevWidth = Number.MAX_VALUE;

            //            prevWidth = window.innerWidth;

            this.rt.loadMovieDetails(params.id, function (data) {

                if (!data) {
                    return;
                }

                mv.renderMovieDetails.call(that, data);

            });

        },

        unload: function () {

          //  delete this.resizeEvents["manageMovieView"];

        },

        renderMovieDetails: function (data) {

            if (data) {

                var that = this,
                    mv = that.movieView,
                    width = window.innerWidth;

                that.mergeData(".movie-details-panel", "movieDetailsPosterTemplate", data);
                that.mergeData(".movie-description", "movieDetailsDescriptionTemplate", data);
                that.mergeData(".cast-name-list", "movieDetailsCastTemplate", data);
                that.mergeData(".movie-showtime-list", "MovieShowtimeTemplate",
                                that.rt.mergeInFakeShowtimes(data));

                that.setMainTitle(data.title);

                mv.bindPanelTitles.call(that);

                mv.setupMQLs.call(that, mv);

                that.setupPanorama(".panorama-container", { maxWidth: 610 });

         //       that.resizeEvents["manageMovieView"] = mv.manageMovieView;

                var reviewSubmit = document.getElementById("reviewSubmit");

                document.reviewForm.onsubmit = function (e) {

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

                };

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

        mql600: undefined,
        mql820: undefined,
        mql1024: undefined,

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

                mv.mql1024.addListener(function (e) {

                    mv.setMoviePoster(window.innerWidth);

                });

            }


        },

        bindPanelTitles: function () {

            var showTimes = $(".movie-showtime-list"),
                castNames = $(".cast-name-list"),
                movieDesc = $(".movie-description"),
                showTimesTitle = $(".movie-showtimes-panel > .panel-title"),
                castNamesTitle = $(".movie-cast-panel > .panel-title"),
                movieDescTitle = $(".movie-description-panel > .panel-title"),
                showReview = $("#showReview"),
                selectors = this.movie.Items;

            $(movieDesc).show();

            deeptissue(movieDescTitle).tap(function (e) {

                var width = window.innerWidth;

                if (width > 600 && width < 820) {

                    showTimes.hide();
                    showReview.hide();
                    castNames.hide();
                    movieDesc.show();

                    showTimesTitle.removeClass("selected");
                    castNamesTitle.removeClass("selected");
                    movieDescTitle.addClass("selected");

                }

            });

            deeptissue(castNamesTitle).tap(function (e) {

                var width = window.innerWidth;

                if (width > 600 && width < 820) {

                    showTimes.hide();
                    showReview.hide();
                    castNames.show();
                    movieDesc.hide();

                    castNames[0].style.position = "relative";
                    castNames[0].style.left = "-130px";

                    showTimesTitle.removeClass("selected");
                    castNamesTitle.addClass("selected");
                    movieDescTitle.removeClass("selected");

                }

            });

            deeptissue(showTimesTitle).tap(function (e) {

                var width = window.innerWidth;

                if (width > 600 && width < 820) {

                    showTimes.show();
                    showReview.show();
                    castNames.hide();
                    movieDesc.hide();

                    showTimes[0].style.position = "relative";
                    showTimes[0].style.left = "-260px";

                    showReview[0].style.position = "relative";
                    showReview[0].style.left = "-200px";
                    showReview[0].style.top = "30px";

                    showTimesTitle.addClass("selected");
                    castNamesTitle.removeClass("selected");
                    movieDescTitle.removeClass("selected");

                }

            });

            deeptissue("#showReview").tap(function (e) {

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

        renderSmallScreen: function () {

            $("#showReview").hide();

            $(".movie-showtime-list").show();
            $(".movie-review-panel").show();
            $(".movie-details-list").show();
            $(".movie-descrption-list").show();
            $(".cast-name-list").show();
            
        },

        renderMiniTablet: function () {

            $("#showReview").hide();

            $(".movie-descrption-list").show();
            $(".movie-description").show();
            $(".movie-showtime-list").hide();
            $(".movie-review-panel").hide();
            $(".movie-details-list").hide();
            $(".cast-name-list").hide();

            var i = 0,
                panelWrapper = document.querySelector(".panorama-panels"),
                panels = document.querySelectorAll(".single-panel");

            for (; i < panels.length; i++) {
                panels[i].style.width = "";
            }

            panelWrapper.style.width = "";
            panelWrapper.style.height = "";
            panelWrapper.style.left = "";

            

        },

        renderFullScreen: function () {

            var showReview = $("#showReview"),
                showTimes = document.querySelector(".movie-showtime-list");
            
            showTimes.style.position = "";
            showTimes.style.left = "";
            showTimes.style.display = "block";

            showReview[0].style.position = "";
            showReview[0].style.left = "";
            showReview[0].style.top = "";

            $(".movie-review-panel").hide();
            $(".movie-details-list").show();
            $(".movie-descrption-list").show();
            document.querySelector(".cast-name-list").style.display = "block";


        },

        manageMovieView: function () {

            var that = this,
                mv = that.movieView,
                width = window.innerWidth,
                showReview = $("#showReview"),
                showTimes = document.querySelector(".movie-showtime-list"),
                castNames = document.querySelector(".cast-name-list");

            //move from mini-tablet view
            if ((width < 610 || width > 800) && (prevWidth >= 610 && prevWidth <= 800)) {

                showTimes.style.position = "";
                showTimes.style.left = "";

                showReview[0].style.position = "";
                showReview[0].style.left = "";
                showReview[0].style.top = "";

                $(".movie-showtime-list").show();
                $(".movie-review-panel").hide();
                $(".movie-details-list").show();
                $(".movie-descrption-list").show();
                castNames.style.display = "block";
            }

            if ((width > 610 && width < 820) && (prevWidth <= 610 || prevWidth >= 820)) {

                $(showTimes).hide();
                $(showReview).hide();
                $(".movie-description").show();
                $(".movie-showtime-list").hide();
                $(".movie-review-panel").hide();
                $(".movie-details-list").hide();
                $(".cast-name-list").hide();

                var i = 0,
                    panelWrapper = document.querySelector(".panorama-panels"),
                    panels = document.querySelectorAll(".single-panel");

                for (; i < panels.length; i++) {
                    panels[i].style.width = "";
                }

                var pp = document.querySelector(".panorama-panels");

                pp.style.width = "";
                pp.style.height = "";
                pp.style.left = "";

            }

            if (width <= 610 && prevWidth > 610) {
                //make sure panorama in effect
                that.setupPanorama(".panorama-container", { maxWidth: 610 });

                $(".movie-showtime-list").show();
                $(".movie-review-panel").show();
                $(".movie-details-list").show();
                $(".movie-descrption-list").show();
                $(".cast-name-list").show();

            }

            //need a routine to reset the order of panels since they may have been swiped

            mv.setMoviePoster(width);

            prevWidth = width;

        },

        setMoviePoster: function () {

            var width = window.innerWidth,
                poster = document.querySelector(".full-movie-poster");

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

        clearInlineRelativePostition: function (nodes) {

            if (!nodes.legth) {
                nodes = [nodes];
            }

            for (var i = 0; i < nodes.length; i++) {

                nodes[i].style.position = "";
                nodes[i].style.left = "";

            }

        }

    };


}(window));