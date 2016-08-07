var express   = require('express'),
    http      = require('http');    

var app       = express();
var routes    = require('./api/routes.js');
require('dotenv').config();

app.use(express.static(__dirname + '/app'));

routes(app);

var server = http.createServer(app);
server.listen(3000);

var stockList = [
                  {
                    name : 'FB',
                    color : '#a1a1a1',
                  },
                  {
                    name : 'TSLA',
                    color : '#b2b2b2',
                  } 
                  ];

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.emit("stockList", stockList);

  socket.on('addStock', function (data) {
    if (stockList.indexOf(data) == -1)
      stockList.push(data);

    socket.emit('stockList', stockList);    
  });

  socket.on('removeStock', function (data) {
    var updatedStocks = stockList.filter(function(stock) { return stock != data; });

    stockList = updatedStocks;

    socket.emit('stockList', stockList);    
  });
}); 