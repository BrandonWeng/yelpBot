'use strict'
console.log("Messenger Bot is starting...");

const express = require("express");
const Botly = require("botly");
const botly = new Botly({
    accessToken: 'EAAaGpOO0SCEBAAgAXW4rkGtfXWT8E4d1z9oPyJ6xRnpbJJxWmhc3ETXjiwRFiQgPKsaeyZC9KVOJfTcHNSchErByyfVKfDvZAZAXmQP4b4LUhV3Pm6K4lF2TIKjzTfmTaJ0Ahr0QLm11aoHQgwh23GfaPc1k0Da7EQRKRKTYwZDZD', //page access token provided by facebook
    verifyToken: 'my_voice_is_my_password_verify_me',
    webHookPath: 'https://messengerbotwavinc.herokuapp.com/webhook/'
});

botly.on("message", (senderId, message, data) => {
    let text = `echo: ${data.text}`;
    botly.sendText({
      id: senderId,
      text: text
    });
});

const app = express();
app.use("/webhook", botly.router());
app.listen(3000);
