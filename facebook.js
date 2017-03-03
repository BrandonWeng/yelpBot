/**
 * Created by Brandon on 2017-03-02.
 */
'use strict';

// Importing facebook api token and keys
let facebook = new require('./fbconfig');
let token = facebook.token;
let verify_token = facebook.verify_token;

// TODO comment more

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
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Hey! Are you hungry?",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Yes!",
                        "payload": "hungry"
                    },
                    {
                        "type": "postback",
                        "title": "Nope",
                        "payload": "notHungry"
                    }
                ]
            }
        }
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
    // TODO check if there are actual resturants or else post back error message
    // TODO add a restart (Price) option

    // Building JSON object : 3 template buttons
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": resturants.businesses[0].name,
                    "image_url": resturants.businesses[0].image_url,
                    "buttons": [{
                        "type": "web_url",
                        "url": resturants.businesses[0].url,
                        "title": "More Information"
                    }]
                },
                    {
                        "title": resturants.businesses[1].name,
                        "image_url": resturants.businesses[1].image_url,
                        "buttons": [{
                            "type": "web_url",
                            "url": resturants.businesses[1].url,
                            "title": "More Information"
                        }]
                    }, {
                        "title": resturants.businesses[2].name,
                        "image_url": resturants.businesses[2].image_url,
                        "buttons": [{
                            "type": "web_url",
                            "url": resturants.businesses[2].url,
                            "title": "See more"
                        }]
                    }]
            }
        }
    };

    // Make POST request : send 3 Resturants as templates
    facebook.postRequest(sender,messageData,facebookError);

    // Send message to thank user
    sendTextMessage(sender, facebook.sentRestaurantMessage);
}

// Prompts sender for price input by sending 4 price buttons
function sendPriceRangeButton(sender) {

    // Construction JSON object : price buttons that make post backs
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Cool! What's the budget?",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Cheapest please!",
                        "payload": "1"
                    },
                    {
                        "type": "postback",
                        "title": "Doesn't matter",
                        "payload": "2"
                    },
                    {
                        "type": "postback",
                        "title": "Treating myself",
                        "payload": "3"
                    }
                ]
            }
        }
    };

    // Make POST request: sends three price buttons that make post backs
    facebook.postRequest(sender,messageData,facebookError);
}

// Prompts sender for their longitude and latitude
function sendLocationButton(sender) {

    // Construction JSON object : Location Button
    let messageData = {
        "text": facebook.askForLocation,
        "quick_replies": [
            {
                "content_type": "location",
            }
        ]
    };

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
