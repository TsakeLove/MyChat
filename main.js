'use strict';
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const path = require('path');

const connections = [];
// array to store current users
const users = new Set();
// array for storing current messages
const messages = [];
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth.html'));
});

app.get('/:id', (req, res) => {
  if (req.params.id === 'client.js') {
    res.sendFile(path.join(__dirname, 'client.js'));
  } else if (req.params.id === 'favicon.ico') {
    res.sendStatus(404);
  } else {
    users.add(req.params.id);
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});
// connection setup
io.on('connection', (socket) => {
  connections.push(socket);
  console.log(users);
  console.log('Connected: %s sockets connected', connections.length);
  // end of connection
  socket.on('disconnect', () => {
    const index = connections.indexOf(socket);
    // remove a broken connection from the list of current connections
    // const deletedItem = connections.splice(index, 1);
    // remove user from array of current users
    users.splice(index, 1);
    // update the list of users on the client
    io.sockets.emit('users loaded', { users });
    console.log('Disconnected: %s sockets connected', connections.length);
  });
  // message processing
  socket.on('send message', (data) => {
    // save message
    messages.push(data);

    // raise a chat message event and send it to all available connections
    io.sockets.emit('chat message', data);
  });

  // upload users
  socket.on('load users', () => {
    console.log(users);
    io.sockets.emit('users loaded', { users });
  });

  // upload messages
  socket.on('load messages', () => {
    socket.emit('messages loaded', { messages });
  });
  // add new user to chat
  socket.emit('new user', { name: users[users.length - 1] });

});

server.listen(process.env.PORT || 8800);
