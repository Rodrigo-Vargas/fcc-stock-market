var express   = require('express'),
    http      = require('http'),
    request   = require("request");

var app       = express();
//var routes    = 


app.use(express.static(__dirname + '/app'));

app.get('/api/stockInfo/:stock', function(req, res){
  var stock = {};

  var options = { 
    method: 'GET',
    url: 'https://www.quandl.com/api/v3/datasets/WIKI/' + req.params.stock + '.json?start_date=1985-05-01&end_date=2016-07-30&order=asc&column_index=4&collapse=quarterly&transformation=rdiff&api_key=' + env.apiKey,
    headers: 
    { 
      'cache-control': 'no-cache'
    }
  };

  request(options, function (error, response, body) {
    if (error) 
      throw new Error(error);
    var quandlData = JSON.parse(body);
    var stockData = {
                  name : '',
                  values : []
    };
    
    stockData.name = quandlData.dataset.dataset_code;
    quandlData.dataset.data.forEach(function(stock){
      var newStockValue = {
                            date : stock[0],
                            stock : stock[1]
                          }
      stockData.values.push(newStockValue);
    })

    return res.json(stockData);
  })
    
})

/*
app.get('*', function(req, res) {
  res.sendfile('./app/index.html');
});*/

var server = http.createServer(app);
server.listen(3000);

var stockList = ['FB', 'GOOGL', 'TSLA'];

var env = require('./config/env.js');

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.on('addStock', function (data) {
    socket.emit('stockList', stockList);    
  });
}); 