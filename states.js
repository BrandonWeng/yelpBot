/**
 * Created by Brandon on 2017-03-03.
 */
'use strict';


function isPayload(event){
    return event.message && event.message.quick_reply;
}

function notMyself(sender){
    return sender != '680930332088116';
}

function isText(event){
    return event.message && event.message.text;
}

function isGreeting(text){
    return text === 'hello' || text == 'hey' || text === 'hi' || text === 'start';
}

function isCoordinates(event){
    return event.message && event.message.attachments && event.message.attachments[0].payload;
}

module.exports ={
    isPayload : isPayload,
    notMyself : notMyself,
    isText : isText,
    isGreeting : isGreeting,
    isCoordinates : isCoordinates
}