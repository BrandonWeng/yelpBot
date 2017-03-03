/**
 * Created by Brandon on 2017-03-02.
 */
'use strict';

// Importing facebook api token and keys
let facebook = new require('./fbconfig');
let token = facebook.token;
let verify_token = facebook.verify_token;


// Error Handler
function facebookError(error,response) {
    if (error) {
        console.error('ERROR sending messages: ', error)
    } else if (response.body.error) {
        console.error('ERROR: response', response.body.error)
    }
}


// Prompts the sender to start the process
function sendStartButton(sender) {

    // Construction JSON object : Two buttons to start the process or end
    let messageData = {
        "text" : facebook.askForStart,
        "quick_replies" : [
            facebook.quickReplyText("Yes!","hungry"),
            facebook.quickReplyText("Nope ","notHungry")
        ]
    };

    // Make POST request : Send start button
    facebook.postRequest(sender,messageData,facebookError)
}


// Sends text message to sender
function sendTextMessage(sender, text) {

    // Constructing JSON object : Text message
    let messageData = {text: text};

    // Make POST request : Send text message to user
    facebook.postRequest(sender,messageData,facebookError)
}


// Sends three resturants as template buttons back to sender
function sendResturants(sender, resturants) {
    // TODO add a restart (Price) option

    let restaurant = resturants.businesses;

    // Building JSON object : 3 template buttons
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    facebook.templateRestaurant(restaurant[0]),
                    facebook.templateRestaurant(restaurant[1]),
                    facebook.templateRestaurant(restaurant[2])
                ]
            }
        }
    };

    // if no resturants are found at this price
    if (restaurant.length != 3){

        // Send message prompt user to choose new budget since
        // no resturants were found
        sendPriceRangeButton(sender,facebook.sentRestaurantMessage);

    // At least 3 Resturants found
    } else {

        // Make POST request : send 3 Resturants as templates
        facebook.postRequest(sender, messageData, facebookError);

        // Send message to thank user
        sendTextMessage(sender, facebook.sentRestaurantMessage);
    }
}


// Prompts sender for price input by sending 4 price buttons
function sendPriceRangeButton(sender,text) {

    // check if text was passed, if not assume default value
    text = text || facebook.askForBudget;

    // Construction JSON object : price buttons that make post backs
    let messageData = {
        "text": text,
        "quick_replies": [
            facebook.quickReplyText("Cheapest","1"),
            facebook.quickReplyText("Average","2"),
            facebook.quickReplyText("Treating myself","3"),
        ]
    };

    // Make POST request: sends three price buttons that make post backs
    facebook.postRequest(sender,messageData,facebookError);
}


// Prompts sender for their longitude and latitude
function sendLocationButton(sender) {

    // Construction JSON object : Location Button
    let messageData = facebook.quickReplyLocation

    // Make POST request : send quick reply button
    facebook.postRequest(sender,messageData,facebookError);
}


// Export the following for main module to use
module.exports = {
    token : token,
    verify_token : verify_token,
    sendResturants :sendResturants,
    sendLocationButton : sendLocationButton,
    sendStartButton : sendStartButton,
    sendTextMessage: sendTextMessage,
    sendPriceRangeButton : sendPriceRangeButton
};
