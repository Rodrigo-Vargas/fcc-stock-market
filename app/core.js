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
  .controller('StockCtrl', function($scope, socket, graph){
    graph.init();
    $scope.stocks = [];
    
    $scope.addStock = function() {
      socket.emit('addStock', $scope.newStock);
      $scope.newStock = '';
    }

    $scope.removeStock = function(stock){
      socket.emit('removeStock', stock);
    }

    socket.on('stockList', function(stocks){
      $scope.stocks = stocks;

      graph.update(stocks);
    });    
  });
  