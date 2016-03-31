bb8_control.controller("robotDrive", function ($scope,$element,dataService,$timeout) {
  $scope.knobMoved = function(x,y){
    x = x - $scope.radius;
    y = y - $scope.radius;

    var power = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    var angle = Math.atan2(y, x);

    angle = angle + (Math.PI/2);

    if(x < 0 && y < 0){
     angle = angle + (Math.PI/2) + ((Math.PI/2)*3);
    }

    dataService.postCommand('roll', [power,(angle/Math.PI)*180]);
  };
});
