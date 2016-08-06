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

      // Set the dimensions of the canvas / graph
      var margin = {top: 30, right: 20, bottom: 30, left: 50},
          width = 600 - margin.left - margin.right,
          height = 270 - margin.top - margin.bottom;

      // Parse the date / time
      var parseDate = d3.time.format("%d-%b-%y").parse;

      // Set the ranges
      var x = d3.time.scale().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);

      // Define the axes
      var xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(5);

      var yAxis = d3.svg.axis().scale(y)
          .orient("left").ticks(5);

      // Define the line
      var valueline = d3.svg.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.close); });
          
      // Adds the svg canvas
      var svg = d3.select("body")
          .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
          .append("g")
              .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");

      // Get the data
      d3.csv("data.csv", function(error, data) {
          data.forEach(function(d) {
              d.date = parseDate(d.date);
              d.close = +d.close;
          });

          // Scale the range of the data
          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain([0, d3.max(data, function(d) { return d.close; })]);

          // Add the valueline path.
          svg.append("path")
              .attr("class", "line")
              .attr("d", valueline(data));

          // Add the X Axis
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          // Add the Y Axis
          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis);

      });
    });

    graph.init();
  });
  