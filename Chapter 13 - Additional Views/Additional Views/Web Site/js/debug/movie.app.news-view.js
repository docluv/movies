
;

(function(window, undefined){

    "use strict";

    movieApp.fn.loadNewsView = function () {

        this.setMainTitle("News");

        var that = this;

        that.getNews(that.renderNews);

    };

    movieApp.fn.renderNews = function (results) {

        if (results && results.length > 0) {
            this.mergeData(".new-article-list", "NewsHeadlineTemplate", results);

        } else {

            document.querySelector(".new-article-list")
                        .innerHTML = "<h2>Sorry No News Available</h2>";
        }

    }

}(window));