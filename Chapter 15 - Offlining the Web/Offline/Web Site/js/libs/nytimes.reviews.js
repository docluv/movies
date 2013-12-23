
;

//Example JavaScript Module based on the jQuery pattern
//It is wrapped within an anymous enclosure
(function (window, undefined) {


    //this is ultimately the object used to create the global variable
    //it is set at the end of the module
    //I use nytReviews as an example name, you can do a replace all to name it 
    //what every suites your needs.
    var nytReviews = function (data) {

        var that = new nytReviews.fn.init();

        that.data = data.data;

        return that;
    };


    //Create an alias to the module's prototype
    //create the object's members in the protype definition.
    nytReviews.fn = nytReviews.prototype = {

        //hmm what is this for?
        //well combined with the following init definition we 
        constructor: nytReviews,


        //gets everything started and returns a reference to the object.
        //notice it was called from the nytReviews function definition above.
        init: function () {
            //return a reference to itself so you can chain things later!
            return this;
        },

        data: undefined,

        //I think this is just good practice ;)
        version: "0.0.1",

        reviews: function (callback) {

            return this.data.getData(
                    "http://api.nytimes.com/svc/movies/v2/reviews/all/by-opening-date.json?api-key=003f5423c8182dca2684e2cdc804f925:16:60721682", {
                        success: function (data) {
                            if (callback) {
                                callback.call(that, data);
                            }
                        }
                    });

        },


        //yes you can create chile objects
        settings: {
            prop1: "Sample Module"
        }


    };


    // Give the init function the nytReviews prototype for later instantiation
    nytReviews.fn.init.prototype = nytReviews.fn;


    //create the global object used to create new instances of nytReviews
    return (window.nytReviews = nytReviews);


})(window);


