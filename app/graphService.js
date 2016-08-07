'use strict';
angular
  .module('rvgStockMarket')
  .factory('graph', function($rootScope){
    var vis,
        format;
    
    var stockValues = [];

    var WIDTH = 1000,
          HEIGHT = 500,
          MARGINS = {
              top: 20,
              right: 20,
              bottom: 20,
              left: 50
          }
    return {
      init: function(){
        vis = d3.select("#visualisation");

        format = d3.time.format("%Y-%m-%d");
      },
      clear: function(){
        vis.selectAll('.line').remove();
      },
      add: function(stock, color){
        stock.values.forEach(function(value){
          stockValues.push(value);  
        })

        var xScale = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain(d3.extent(stockValues, function(d) { return format.parse(d.date); })),
        
        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain(d3.extent(stockValues, function(d) { return d.stock; })),
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
              return xScale(format.parse(d.date));
          })
          .y(function(d) {
              return yScale(d.stock);
          });

        vis.append('svg:path')
          .attr('class', 'line')
          .attr('d', lineGen(stock.values))
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('fill', 'none');        
      }
    }
  });