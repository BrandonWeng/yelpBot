const express = require("express");
const Botly = require("botly");
const botly = new Botly({
    accessToken: 'EAAaGpOO0SCEBAAgAXW4rkGtfXWT8E4d1z9oPyJ6xRnpbJJxWmhc3ETXjiwRFiQgPKsaeyZC9KVOJfTcHNSchErByyfVKfDvZAZAXmQP4b4LUhV3Pm6K4lF2TIKjzTfmTaJ0Ahr0QLm11aoHQgwh23GfaPc1k0Da7EQRKRKTYwZDZD', //page access token provided by facebook
    verifyToken: 'i_am_brandon',
    webHookPath: 'https://messengerbotwavinc.herokuapp.com/webhook/'
    notificationType: Botly.CONST.REGULAR //already the default (optional),
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
