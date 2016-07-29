var express = require('express'),
    http = require('http');

var app = express(); 


app.use(express.static(__dirname + '/public'));


var server = http.createServer(app);
server.listen(3000);

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.on('addStock', function (data) {
    console.log(data);
    socket.emit('private', { msg: 'Welcome aboard' })
  });
});