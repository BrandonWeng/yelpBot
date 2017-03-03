/**
 * Created by Brandon on 2017-03-02.
 */

'use strict';

// Facebook APP tokens
// Facebook secret verify tokens
let token = 'EAAaGpOO0SCEBACKheumfl9Pz72WD4ZAE1deRl0OQZB7BnFNlegbSLJJIDE9IfJRTLjZCcLAke88GdChPyzfjHtK5cgaJkj9qAYIcsaoSZCt108wDD5N7W6oQg2klxXfV2rYHSkcIRhbZAH9CT66ZB22QyoEuHZAguE2fvtsEvhtUwZDZD';

// Constant Text messages to send to users
let sentRestaurant = "Here are some of the top picks! These resturants should be open :) I hope it's what you were looking for!";
let askForLocation = "Can I have your location please?";

const request = require('request');

// Makes a POST request to the sender using data
function postRequest(sender, data, errorHandler) {
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

// Export the functions/variables for outside modules
module.exports = {
    token : token,
    verify_token: 'my_voice_is_my_password_verify_me',
    postRequest : postRequest,
    sentRestaurantMessage : sentRestaurant,
    askForLocation : askForLocation
};