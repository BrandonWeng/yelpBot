'use strict'
const token = "EAAaGpOO0SCEBALH4EQYbZBjOzPuZC7BTOaQBpFPFiSDAwmu7cbL3k96925S4gpGR8q7ySdaTSFqAaVHNOFewXcsPGefXeKIspj2vPh4yMqS2P85hsG1UFePzK2nzaBxJSAMM8d8elmmGVmwWsRQJjNeC4qCgXc1hmQ1i1sNwZDZD"
console.log("Messenger Bot is starting...")
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

let price = 0;
let lat = 0;
let long = 0;

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Facebook Tokens Verified!')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('Successfully Started')
})

app.post('/webhook/',  messageRecieved);

function messageRecieved(req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (sender != '680930332088116') {
            if (event.message && event.message.text) {
                let text = event.message.text
                if (text === 'Start' || text ==='start' || text ==='hungry' || text === 'Hungry'){
                    console.log("Sending Start Button")
                    sendStartButton(sender)
                    continue
                }
                if (text === 'Price') {
                    console.log("Sending Price Button")
                    sendPriceRangeButton(sender)
                    continue
                }
                if (text == 'location') {
                    console.log("Sending Location Button")
                    sendLocationButton(sender)
                    continue
                }
                sendTextMessage(sender, "Sorry! Im not that smart yet. Please say 'start' or 'hungry' to begin :)")
            }
            if (event.message && event.message.attachments){
                let location = event.message.attachments[0].payload.coordinates
                console.log(JSON.stringify(location))
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
                } else if (text === '1'){
                    price = '1'
                    yelpSearched(long,lat,price,sender)
                    continue
                } else if (text === '2'){
                    price = '2'
                    yelpSearched(long,lat,price,sender)
                    continue
                } else if (text == '3'){
                    price = '3'
                    yelpSearched(long,lat,price,sender)
                    continue
                }
                continue
            }
        }
    }
    res.sendStatus(200)
}

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
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
                "text":"Hey! Are you hungry?",
                "buttons":[
                    {
                        "type":"postback",
                        "title":"Yes!",
                        "payload":"hungry"
                    },
                    {
                        "type":"postback",
                        "title":"Nope",
                        "payload":"notHungry"
                    }
                ]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    },function(error, response, body) {
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
        "quick_replies":[
            {
                "content_type":"location",
            }
        ]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
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
                "text":"Cool! What's the budget?",
                "buttons":[
                    {
                        "type":"postback",
                        "title":"Cheapest please!",
                        "payload":"1"
                    },
                    {
                        "type":"postback",
                        "title":"Doesn't matter",
                        "payload":"2"
                    },
                    {
                        "type":"postback",
                        "title":"Treating myself",
                        "payload":"3"
                    }
                ]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


var Yelp = require('yelp-api-v3');
var yelp = new Yelp(require('./config'));

function yelpSearched(longitude,latitude,pricePreference,sender){

    var yelpSearch = {
        term: 'food',
        category_filter:'food' ,
        //location: location,
        longitude:longitude,
        latitude:latitude,
        limit:'3',
        sort:'2',
        is_closed:'false',
        price: pricePreference,
        open_now:'true'
    };

    yelp.search(yelpSearch,printYelp);

    function printYelp(err,data){
        if (err) return console.error("Yelp, Something went wrong! :" + err);
        console.log(JSON.parse(data));
        sendResturants(sender,JSON.parse(data))
    }
}

function sendResturants(sender,resturants) {
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
                        }]},
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
                recipient: {id:sender},
                message: messageData,
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            } else {
                sendTextMessage(sender,"Here are some places that are supposed to be open. Hopefully this was what you're looking for :) . Enjoy your food !")
            }
        })
    }