'use strict';

angular
  .module('rvgStockMarket',[]
  )
  .factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {  
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  })
  .factory('graph', function($rootScope){
    var data, 
        chart,
        options;

    return {
      update: function(){
      }
    }
  })
  .controller('StockCtrl', function($scope, socket, graph, $http){
    $scope.stocks = [];

    var vis = d3.select("#visualisation"),
          WIDTH = 1000,
          HEIGHT = 500,
          MARGINS = {
              top: 20,
              right: 20,
              bottom: 20,
              left: 50
          };
    var format = d3.time.format("%Y-%m-%d");
    
    $scope.requestUpdate = function() {
      socket.emit('addStock', "Stock one");
    }

    socket.on('stockList', function(stocks){
      console.log(stocks);
      
      stocks.forEach(function(stock){
        $http(
        {
          method: 'GET',
          url: '/api/stockInfo/' + stock
        })
        .then(function successCallback(response) {
          response.data.values.forEach(function(value){
            $scope.stocks.push(value);  
          })

          var xScale = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain(d3.extent($scope.stocks, function(d) { return format.parse(d.date); })),
            
            yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain(d3.extent($scope.stocks, function(d) { return d.stock; })),
            xAxis = d3.svg.axis()
            .scale(xScale),
            yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");
        
          vis.selectAll(".axis").remove();
          vis.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);
          vis.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);
          var lineGen = d3.svg.line()
            .x(function(d) {
                console.log(d)
                return xScale(format.parse(d.date));
            })
            .y(function(d) {
                return yScale(d.stock);
            });

            vis.append('svg:path')
              .attr('d', lineGen(response.data.values))
              .attr('stroke', 'green')
              .attr('stroke-width', 2)
              .attr('fill', 'none');
        },
          function errorCallback(response) {
            alert(response);
          }
        );        
      })     
    });    
  });
  