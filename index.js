/*jshint esversion: 6 */
console.log("Yelp,I'm Hungry is starting ...");


// NPM - EXPRESS (for Facebook)
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
    res.send('Hi, I am a Facebook Messenger bot!');
});

// Set up webhook
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

var token = 'EAAaGpOO0SCEBANtXJrv2eBDSJqtrHajmUwPnwY50OQkU2SRlOWqJZBU66cd8ZBPyjgE5jmg1odA7ueHh4iWkuBcnj8njXAUkLGAK3oUgxliPjMgAZCii60Mp8idpUlYoREx3dG5Cw66HA70bLo2htbOLck1DRav1Gp6L4zWigZDZD';


function sendTextMessage(sender, text) {
    var messageData = { text:text };
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
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function sendGenericMessage(sender,resturant) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": resturant.name,
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": resturant.name,
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    };
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
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

///////////////////////////////////////
var Yelp = require('yelp-api-v3');

var yelp = new Yelp({
  app_id: 'F-WmYeZdZ_nsR0rjGA5qGA',
  app_secret: '5GXOiYpo7sewGFDkIhegUnheT24xcwyZlZ3Un3Po47WWDJxS9febJfqlSyKyqoOK'
});

function printYelp(term,location,price){
  yelp.search({
    term: term,
    category_filter:'food' ,
    location: location,
    limit:'5',
    sort:'2',
    is_closed:'false',
    price:price,
    open_now:'true'
  })
  .then(function (data) {
    var apiReturn = JSON.parse(data);
    for (var i = 0; i < 4;++i){
      var resturant = {
        name : apiReturn.businesses[i].name,
        address1 : JSON.stringify(apiReturn.businesses[i].location.display_address[0]),
        address2 : JSON.stringify(apiReturn.businesses[i].location.display_address[1]),
        address3 : JSON.stringify(apiReturn.businesses[i].location.display_address[2]),
        rating : apiReturn.businesses[i].rating,
        review_count : apiReturn.businesses[i].review_count,
        price : apiReturn.businesses[i].price,
        url : apiReturn.businesses[i].url
      };
      console.log(resturant.name);
    }
  })
  .catch(function (err) {
    console.error(err);
  });
}

printYelp('chinese','Toronto','1');

// Spin up the server to Messenger ==================================
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
});
