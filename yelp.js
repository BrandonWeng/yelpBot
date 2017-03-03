'use strict';
let Yelp = require('yelp-api-v3');
let yelp = new Yelp(require('./config'));

// Finds three resturants close to the sender based on price and their location
// Makes GET request to YELP's API
function yelpSearch(longitude, latitude, pricePreference, sender, sendResturants) {

    // Constructing JSON object : To search for 3 resturants
    let yelpSearch = {
        term: 'food',
        category_filter: 'food',
        longitude: longitude,
        latitude: latitude,
        limit: '3',
        sort: '2',
        is_closed: 'false',
        price: pricePreference,
        open_now: 'true'
    };

    // Handler for the request
    function handler(err, data) {
        if (err) return console.error("Yelp, Something went wrong! :" + err);

        // console.log(JSON.parse(data)); // Used to debug YELP API

        // No error , sends resturants to sender
        sendResturants(sender, JSON.parse(data));
    }

    // Make GET request
    yelp.search(yelpSearch, handler);
}

// Export the main function for other modules to use
module.exports = {
  yelpSearch : yelpSearch
};