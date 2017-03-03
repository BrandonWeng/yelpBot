'use strict';
var facebook = new require('./fbconfig');
const token = facebook.token;
const verify_token = facebook.verify_token;

var YELP = new require('./yelp');

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();



let price = 0;
let lat = 0;
let long = 0;

// Start on Local:5000 or env.PORT
app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
    res.send('Facebook Tokens Verified!')
});

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === verify_token) {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
});

// Spin up the server
app.listen(app.get('port'), function () {
    console.log("Messenger Bot is starting...");
})

app.post('/webhook/', messageRecieved);

function messageRecieved(req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (sender != '680930332088116') {
            if (event.message && event.message.text) {
                let text = event.message.text
                if (text === 'Start' || text === 'start' || text === 'hungry' || text === 'Hungry') {
                    console.log("Sending Start Button")
                    sendStartButton(sender)
                    continue
                }
                sendTextMessage(sender, "Sorry! Im not that smart yet. Please say 'start' or 'hungry' to begin :)")
            }
            if (event.message && event.message.attachments && event.message.attachments[0].payload.coordinates) {
                let location = event.message.attachments[0].payload.coordinates
                // console.log(JSON.stringify(location))
                long = location.long
                lat = location.lat
                sendPriceRangeButton(sender)
            }
            if (event.postback) {
                let text = event.postback.payload
                if (text === 'hungry') {
                    sendLocationButton(sender)
                    continue
                } else if (text === 'notHungry') {
                    sendTextMessage(sender, "awww... I'll be waiting then :(")
                    continue
                } else if (text === '1') {
                    price = '1'
                    YELP.yelpSearch(long, lat, price, sender,sendResturants)
                    continue
                } else if (text === '2') {
                    price = '2'
                    YELP.yelpSearch(long, lat, price, sender,sendResturants)
                    continue
                } else if (text == '3') {
                    price = '3'
                    YELP.yelpSearch(long, lat, price, sender,sendResturants)
                    continue
                }
                continue
            }
        }
    }
    res.sendStatus(200)
}

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
    }, function (error, response) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
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
        } else {
            sendTextMessage(sender, "Here are some places you can get food at. " +
                "These resturants should be open." +
                "Sorry if it's not what you were looking for.")
        }
    })
}
