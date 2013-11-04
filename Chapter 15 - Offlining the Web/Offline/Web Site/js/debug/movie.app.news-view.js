
;

(function () {

    "use strict";

    movieApp.fn.loadNewsView = function () {

        this.setMainTitle("News");

        var that = this;

        that.renderNews(that.getNews());

    };

    movieApp.fn.renderNews = function (results) {

//        if (results && results.articles && results.articles.length > 0) {
            this.mergeData(".new-article-list", "NewsHeadlineTemplate", results);

        //} else {

        //    document.querySelector(".new-article-list")
        //                .innerHTML = "<h2>Sorry No News Available</h2>";
  //      }

    }

}(window));