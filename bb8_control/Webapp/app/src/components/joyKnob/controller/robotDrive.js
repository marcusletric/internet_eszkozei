bb8_control.controller("robotDrive", function ($scope,$element,dataService,microphoneService) {
  $scope.knobMoved = function(x,y){
    x = x - $scope.radius;
    y = y - $scope.radius;

    var power = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    var angle = Math.atan2(y, x);

    angle = angle + (Math.PI / 2);

    if(y < 0 && x < 0){
     angle = angle + (Math.PI*2);
    }
    console.log((angle/Math.PI)*180);
    dataService.postCommand('roll', [power,(angle/Math.PI)*180]);
  };

  microphoneService.setCallback(function() {
    if ($scope.audioVisualisation) {
      $scope.knobMoved(90 + (microphoneService.gainValue/255*200), 90+(microphoneService.gainValue/255*200));
      $scope.$digest();
    }
  });

});
