
;

(function (window, undefined) {

    var fakeTheaters = [{
        id: "fake1",
        name: "The Mystic",
        address: "123 fake st",
        city: "anytown",
        state: "any state",
        postal: "12345",
        phone: "4445551212",
        latitude: "",
        longitude: ""
    },
    {
        id: "fake1",
        name: "The Marquee",
        address: "123 fake st",
        city: "anytown",
        state: "any state",
        postal: "12345",
        phone: "4445551212",
        latitude: "",
        longitude: ""
    },
    {
        id: "fake1",
        name: "The Pantagees",
        address: "123 fake st",
        city: "anytown",
        state: "any state",
        postal: "12345",
        phone: "4445551212",
        latitude: "",
        longitude: ""
    },
    {
        id: "fake1",
        name: "Regal 22",
        address: "123 fake st",
        city: "anytown",
        state: "any state",
        postal: "12345",
        phone: "4445551212",
        latitude: "",
        longitude: ""
    },
    {
        id: "fake1",
        name: "Rialto 16",
        address: "123 fake st",
        city: "anytown",
        state: "any state",
        postal: "12345",
        phone: "4445551212",
        latitude: "",
        longitude: ""
    },
    {
        id: "fake1",
        name: "AMC Stadium 20",
        address: "123 fake st",
        city: "anytown",
        state: "any state",
        postal: "12345",
        phone: "4445551212",
        latitude: "",
        longitude: ""
    },
    {
        id: "fake1",
        name: "AMC Loews Universal Cineplex 20",
        address: "123 fake st",
        city: "anytown",
        state: "any state",
        postal: "12345",
        phone: "4445551212",
        latitude: "",
        longitude: ""
    },
    {
        id: "fake1",
        name: "Regal Pointe Stadium 20 & IMAX",
        address: "123 fake st",
        city: "anytown",
        state: "any state",
        postal: "12345",
        phone: "4445551212",
        latitude: "",
        longitude: ""
    },
    {
        id: "fake1",
        name: "Touchstar Cinemas Southchase 7",
        address: "123 fake st",
        city: "anytown",
        state: "any state",
        postal: "12345",
        phone: "4445551212",
        latitude: "",
        longitude: ""
    },
        {
            id: "fake1",
            name: "Cinemark Festival Bay Mall",
            address: "123 fake st",
            city: "anytown",
            state: "any state",
            postal: "12345",
            phone: "4445551212",
            latitude: "",
            longitude: ""
        }
    ];

    var fakeShowTimes = ["11:45 AM",
                "1:25 PM",
                "3:30 PM",
                "4:55 PM",
                "5:10 PM",
                "6:35 PM",
                "7:20 PM",
                "8:35 PM",
                "9:45 PM",
                "10:10 PM"];

    var fakeTheaters = function () {

        return new fakeTheaters.fn.init();

    };

    fakeTheaters.fn = fakeTheaters.prototype = {

        constructor: fakeTheaters,

        init: function () {
            return this;
        },

        version: "0.0.1",

        nearbyTheaters: function (latitude, longitude) {

            return fakeTheaters;
        },

        theaterShowTimes: function (theaterId, movieId) {

            return fakeShowTimes;

        }

    };


    // Give the init function the fakeTheaters prototype for later instantiation
    fakeTheaters.fn.init.prototype = fakeTheaters.fn;


    //create the global object used to create new instances of fakeTheaters
    return (window.fakeTheaters = fakeTheaters);


})(window);


