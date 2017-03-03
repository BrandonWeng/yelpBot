'use strict';
let Yelp = require('yelp-api-v3');
let yelp = new Yelp(require('./config'));

function yelpSearch(longitude, latitude, pricePreference, sender, sendResturants) {

    // Search queries used to make POST request to YELP
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
        console.log(JSON.parse(data));
        sendResturants(sender, JSON.parse(data));
    }

    // Make GET request
    yelp.search(yelpSearch, handler);
}

module.exports = {
  yelpSearch : yelpSearch
};