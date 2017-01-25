'use strict'
const token = "EAAaGpOO0SCEBACKheumfl9Pz72WD4ZAE1deRl0OQZB7BnFNlegbSLJJIDE9IfJRTLjZCcLAke88GdChPyzfjHtK5cgaJkj9qAYIcsaoSZCt108wDD5N7W6oQg2klxXfV2rYHSkcIRhbZAH9CT66ZB22QyoEuHZAguE2fvtsEvhtUwZDZD"
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
                if (text === 'Start') {
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
                sendTextMessage(sender, "Testing Postbacks!")
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
                    continue
                } else if (text === '2'){
                    price = '2'
                    continue
                } else if (text == '3'){
                    price = '3'
                    continue
                }
                sendTextMessage(sender, "Testing! " + text)
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

