'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  console.log("Connected " + socket.id);
  var led = [true, false];
  var interval1 = setInterval(function () {
    for (var i = 0; i < led.length; i++) {
      led[i] = !led[i];
    }
    var json = {
      "led": led
    }
    socket.emit('LED', json);
    console.log("Send LED");
  }, 200)

  // socket.on('disconnect', function () {

  //   console.log('Client disconnected')
  // });



  socket.on('disconnect', () => {
    clearInterval(interval1)
    console.log('Client disconnected')
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
