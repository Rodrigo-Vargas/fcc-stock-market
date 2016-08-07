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
  .controller('StockCtrl', function($scope, socket, graph, $http){
    graph.init();
    $scope.stocks = [];
    
    $scope.addStock = function() {
      socket.emit('addStock', $scope.newStock);
      $scope.newStock = '';
    }

    $scope.removeStock = function(stock){
      socket.emit('removeStock', stock);
    }

    $scope.getColor = function(stockTarget) {
      var color = '#000000';
      
      $scope.stocks.forEach(function(stock){        
        if (stock.name == stockTarget)
          color = stock.color;
      });

      return color;
    }

    socket.on('stockList', function(stocks){
      $scope.stocks = stocks;
      graph.clear();
      stocks.forEach(function(stock){
        $http(
        {
          method: 'GET',
          url: '/api/stockInfo/' + stock.name
        })
        .then(
          function successCallback(response) 
          {
            var color = $scope.getColor(response.data.name);
            graph.add(response.data, color);            
          },
          function errorCallback(response) {
            alert(response.data);
          }
        );        
      });
    });    
  });
  