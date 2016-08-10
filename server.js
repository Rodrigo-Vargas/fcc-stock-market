var express   = require('express'),
    http      = require('http');    

var app       = express();
var routes    = require('./api/routes.js');
var Helpers   = require('./api/helpers.js')
require('dotenv').config();

app.use(express.static(__dirname + '/app'));

routes(app);

var server = http.createServer(app);
server.listen(3000);

var stockList = [
                  {
                    name : 'FB',
                    color : Helpers.generateColor(),
                  },
                  {
                    name : 'TSLA',
                    color : Helpers.generateColor(),
                  } 
                  ];

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.emit("stockList", stockList);

  socket.on('addStock', function (data) {
    if (stockList.indexOf(data) == -1)
      stockList.push({
                        name : data,
                        color : Helpers.generateColor(),
                      });

    socket.emit('stockList', stockList);
    socket.broadcast.emit('stockList', stockList);
  });

  socket.on('removeStock', function (data) {
    var updatedStocks = stockList.filter(function(stock) { return stock.name != data.name; });
    
    stockList = updatedStocks;

    socket.emit('stockList', stockList);
    socket.broadcast.emit('stockList', stockList);
  });
}); 