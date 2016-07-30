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
  .controller('StockCtrl', function($scope, socket){
    $scope.stocks = [];
    
    $scope.sentMessage = function() {
      socket.emit('addStock', "Stock one");
    }

    socket.on('stockList', function(data){
      console.log(data);
      $scope.stocks.push(data);
      console.log($scope.stocks);
    });

    /*socket.on('stockList', function(data) {
      //console.log(data);
      //$scope.stocks.push(data);
      //console.log($scope.stocks);
    });*/
  });
  