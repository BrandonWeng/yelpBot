/**
 * Created by Brandon on 2017-03-02.
 */

'use strict';

// Facebook APP tokens
// Facebook secret verify tokens
let token = 'KEYYYY';
let verify_token = 'ANOTHER KEY';

// Constant Text messages to send to users
let sentRestaurant = "Here are some of the top picks! These resturants should be open :) I hope it's what you were looking for!";
let askForLocation = "Can I have your location please?";
let askForBudget = "Cool! What's your budget?";
let askForStart = "Hey! Are you hungry?";
let noRestaurantFound = "I couldn't find any resturants at this price range. Would you like to try a different price?";
let repickBudget = "Would you like to pick a new Budget?";

const request = require('request');

// Makes a POST request to the sender using data
function postRequest(sender, data, errorHandler) {

    // Make POST request
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: data,
        }
    }, errorHandler)

}


// Generate text quick reply buttons for Facebook API
function quickReplyText(title,payload) {
    return {
        "content_type": "text",
        "title": title,
        "payload": payload
    }
}


// Generate quick reply location button for sender
let quickReplyLocation = {
    "text": askForLocation,
    "quick_replies": [
        {
            "content_type": "location",
        }
    ]
};


// Generate template objects for resturants
function templateRestaurant(business){

    // current business's information
    let title = business.name ;
    let imageUrl = business.image_url;
    let url = business.url;
    let distance = (business.distance / 1000.0).toFixed(2); // In km
    let distanceString = "Distance : " + distance.toString() + "KM";


    // Return template object generated
    return {
        "title": title,
        "image_url": imageUrl,
        "subtitle": distanceString,
        "buttons": [{
            "type": "web_url",
            "url": url,
            "title": "More Information"
        }]
    }
}


// Export the functions/variables for outside modules
module.exports = {
    token : token,
    verify_token: verify_token,
    postRequest : postRequest,
    askForLocation : askForLocation,
    askForBudget : askForBudget,
    askForStart : askForStart,
    sentRestaurantMessage : sentRestaurant,
    noRestaurantFound : noRestaurantFound,
    newBudget : repickBudget,
    quickReplyText : quickReplyText,
    quickReplyLocation : quickReplyLocation,
    templateRestaurant : templateRestaurant
};