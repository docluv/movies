/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

;

//http://developer.nytimes.com/docs/movie_reviews_api/
//003f5423c8182dca2684e2cdc804f925:16:60721682 
// http://api.nytimes.com/svc/movies/v2/reviews?api-key=003f5423c8182dca2684e2cdc804f925:16:60721682

(function () {

    "use strict";

    movieApp.fn.reviewsView = {

        onload: function () {

            var that = this;

            that.setMainTitle("NY TImes Movie Reviews");
            that.reviews.reviews(function (reviews) {
                that.renderReviews.renderReviews.call(that, reviews);
            });

        },

        renderReviews : function (results) {

            this.mergeData(".new-article-list", "NewsHeadlineTemplate", results);

        }

    };

}(window));