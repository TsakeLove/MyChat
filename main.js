'use strict';
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const port = 8800;
// const online = [];
// array to store current users
const users = [];
// array for storing current messages
// const messages = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth.html'));
});

app.get('/:id', (req, res) => {

  if (req.params.id === '') {
    res.sendFile(path.join(__dirname, 'client.js'));
  } else if (req.params.id === 'favicon.ico') {
    res.sendStatus(404);
  } else {

    users.push(req.params.id);
    res.sendFile(path.join(__dirname, 'index.html'));
  }

});
// connection setup
io.on('connection', (socket) => {
  let connections;
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



});

server.listen(port, () => {
  console.log('app running on port ' + port);
});
