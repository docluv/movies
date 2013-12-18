
;

//Example JavaScript Module based on the jQuery pattern
//It is wrapped within an anymous enclosure
(function (window, undefined) {


    //this is ultimately the object used to create the global variable
    //it is set at the end of the module
    //I use nytReviews as an example name, you can do a replace all to name it 
    //what every suites your needs.
    var nytReviews = function (customSettings) {


        //return the object created by the init method (defined later).
        //notice we are calling the nytReviews init method from the object's protype alias.
        //The customSettings parameter is passed to the init method. Remember to pass
        //any parameters along to the init method.
        var that = new nytReviews.fn.init(customSettings);


        //here I had a delima. I want to show how to merge a custom settings object
        //but I don't wan to rely on jQuery, Underscore or something else for this example.
        //so I decided to show you what it would look like with a jQuery dependancy.


        //this.settings = utility.extend({}, this.settings, customSettings);


        //for a lightweight library with an extend method see my dollarbill repository
        //https://github.com/docluv/dollarbill

        //and then just a simple little way to override the default settings.
        //I do encourage merging the values though.
        if (customSettings) {
            that.settings = customSettings;
        }


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
        init: function (customSettings) {
            //return a reference to itself so you can chain things later!
            return this;
        },


        //I think this is just good practice ;)
        version: "0.0.1",




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


