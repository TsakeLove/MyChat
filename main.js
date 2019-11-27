const app = require ("express")();
const server = require('http').Server(app);
const io = require('socket.io')(server);
let path = require('path');
let port = 8800;
let online = [];
// array to store current users
let users = [];
// array for storing current messages
let messages = [];

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '***'));
});

app.get('/:id', function (req, res) {

    if (req.params.id == '') {
        res.sendFile(path.join(__dirname, 'client.js'));
    }
    else if (req.params.id == 'favicon.ico') {
        res.sendStatus(404);
    }
    else {

        users.push(req.params.id);
        res.sendFile(path.join(__dirname, 'index.html'));
    }

})
// connection setup
io.on('connection', function (socket) {
    connections.push(socket);
    console.log(users)
    console.log('Connected: %s sockets connected', connections.length);
    // end of connection
    socket.on('disconnect', function (data) {
        let index = connections.indexOf(socket)
        // remove a broken connection from the list of current connections
        let deletedItem = connections.splice(index, 1);
        // remove user from array of current users
        users.splice(index, 1);
        // update the list of users on the client
        io.sockets.emit('users loaded', { users: users })
        console.log('Disconnected: %s sockets connected', connections.length);
    });



});

server.listen(port, function () {
    console.log('app running on port ' + port);
})