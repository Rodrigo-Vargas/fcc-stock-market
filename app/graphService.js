'use strict';
angular
  .module('rvgStockMarket')
  .factory('graph', function($rootScope){
    var xs = {};
    var columns = [];
    var colors = {};    

    return {
      clear : function(){
        xs = {};
        columns = [];
        colors = {};  
      },
      addStock : function(name, values, color){
        colors[name] = color;
        xs[name] = 'x' + name;
        // Build x array
        var newXArray = [];
        var newColumnArray = [];
        newXArray.push('x' + name);
        newColumnArray.push(name);

        values.forEach(function(value){
          newXArray.push(value.date);
          newColumnArray.push(value.stock);
        });

        columns.push(newXArray);
        columns.push(newColumnArray); 
      },
      build : function(){
        var chart = c3.generate({
          bindto: '#chart',
          data: {
            colors : colors,
            xs: xs,
            xFormat: '%Y-%m-%d', // how the date is parsed
            columns: columns,
          },
          axis: {
              x: {
                  type: 'timeseries',
                  tick: {
                      format: '%Y-%m-%d' // how the date is displayed
                  }
              }
          }
      });
      }
    }
  });