/**
 * Created by Brandon on 2017-03-02.
 */
'use strict';

// Importing facebook api token and keys
let facebook = new require('./fbconfig');
let token = facebook.token;
let verify_token = facebook.verify_token;

// used to make POST/GET requests
const request = require('request');

// TODO Make a constructor for making post requests
// TODO comment more!

function sendTextMessage(sender, text) {
    let messageData = {text: text}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
        // TODO make a error handler
    }, function (error, response) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function sendResturants(sender, resturants) {
    // TODO check if there are actual resturants or else postback error message
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
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
            sendTextMessage(sender, "Here are some of the top picks! These resturants should be open :). " +
                "I hope it's what you were looking for!")
        }
    })
}

function sendPriceRangeButton(sender) {
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
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendLocationButton(sender) {
    let messageData = {
        "text": "Could I have your location please?",
        "quick_replies": [
            {
                "content_type": "location",
            }
        ]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body)
        }
    })
}



function sendStartButton(sender) {
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
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
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
}
