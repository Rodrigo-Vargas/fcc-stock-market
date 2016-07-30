var express = require('express'),
    http = require('http'),
    request = require("request");

var app = express(); 


app.use(express.static(__dirname + '/app'));


var server = http.createServer(app);
server.listen(3000);

var stockList = ['FB', 'GOOGL', 'TSLA'];

var env = require('./config/env.js');

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.on('addStock', function (data) {
    var data = [];
    
    var options = { 
      method: 'GET',
      url: 'https://www.quandl.com/api/v3/datasets/WIKI/' + stockList[1] + '.json?start_date=1985-05-01&end_date=2016-07-30&order=asc&column_index=4&collapse=quarterly&transformation=rdiff&api_key=' + env.apiKey,
      headers: 
      { 
        'cache-control': 'no-cache'
      }
    };

    request(options, function (error, response, body) {
      if (error) 
        throw new Error(error);
      var stockData = JSON.parse(body);

      console.log(stockData.dataset.data);

      socket.emit('stockList', { name : stockList[0], data : stockData.dataset.data })
    });   
  });
}); 