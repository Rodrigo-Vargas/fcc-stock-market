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
      init: function(){
        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(drawBackgroundColor);

        function drawBackgroundColor() {
          data = new google.visualization.DataTable();
          data.addColumn('date', 'Date');
          
          options = {
            hAxis: {
              title: 'Time'
            },
            vAxis: {
              title: 'Popularity'
            },
            backgroundColor: '#f1f8e9'
          };

          chart = new google.visualization.LineChart(document.getElementById('chart_div'));
          chart.draw(data, options);
        }
      },

      addColumn: function(columnName){
        data.addColumn('number', columnName);
        chart.draw(data, options);
      },

      addRow: function(newRow) {
        var date = new Date(newRow[0]);
        newRow[0] = date;

        data.addRow(newRow);
        chart.draw(data, options);
      }
    }
  })
  .controller('StockCtrl', function($scope, socket, graph){
    $scope.stocks = [];
    
    $scope.sentMessage = function() {
      socket.emit('addStock', "Stock one");
    }

    socket.on('stockList', function(stocks){
      console.log(stocks);
      $scope.stocks.push(stocks);

      graph.addColumn(stocks.name);
      stocks.data.forEach(function(stock){
        graph.addRow(stock);
      });

      console.log($scope.stocks);
    });

    graph.init();
  });
  