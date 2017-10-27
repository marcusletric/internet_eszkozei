bb8_control.controller("colorPicker", function ($scope,$element,dataService,microphoneService,$timeout) {
  $timeout(function(){
    $scope.renderDom($element[0]);
  },200);

  $scope.knobMoved = function(x,y){
    var colorData = $scope.getColorAt(x,y);
    $($scope.knob).css('background-color','rgba(' + colorData[0] + ',' + colorData[1] + ',' + colorData[2]  + ',1)');
    dataService.postCommand('setRgbLed', [{red: colorData[0], green: colorData[1], blue: colorData[2]}]);
  };

  microphoneService.setCallback(function() {
    if ($scope.audioVisualisation) {
      $scope.knobMoved(90 + (microphoneService.gainValue/255*140), 90+(microphoneService.gainValue/255*140));
    }
  });
});
