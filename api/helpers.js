function Helpers () { }

Helpers.generateColor = function(){
  var characters = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']

  var randomColor = '#';
  for (var x = 1; x <=6; x++){
    var index = Math.trunc(Math.random() * 16);
    randomColor += characters[index];
  }

  return randomColor;
}

module.exports = Helpers;