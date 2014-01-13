
;

(function (window, undefined) {

    var mockTheaters = [{
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

            var that = this,
                i = 0, pos;

            for (; i < mockTheaters.length; i++) {

                pos = that.getRandomPoistion(latitude, longitude);

                mockTheaters[i].latitude = pos.latitude;
                mockTheaters[i].longitude = pos.longitude;
            }

            return mockTheaters;
        },

        theaterShowTimes: function (theaterId, movieId) {

            return fakeShowTimes;

        },

        getRandomPoistion: function (latitude, longitude) {

            var r = Math.floor((Math.random() * 5500) + 1) / 100000,
                  rl = Math.floor((Math.random() * 6500) + 1) / 100000,
                  pm = Math.round(Math.random()),
                  pm1 = Math.round(Math.random()),
                  coords = {};

            if (pm === 0) {
                r = parseFloat("-" + r);
            }

            if (pm1 === 0) {
                rl = parseFloat("-" + rl);
            }

            coords.latitude = latitude + r;
            coords.longitude = longitude + rl;

            return coords;
        }


    };


    // Give the init function the fakeTheaters prototype for later instantiation
    fakeTheaters.fn.init.prototype = fakeTheaters.fn;


    //create the global object used to create new instances of fakeTheaters
    return (window.fakeTheaters = fakeTheaters);


})(window);


