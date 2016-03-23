bb8_control.controller("colorPicker", function ($scope,$element,$timeout) {
  $timeout(function(){
    $scope.renderDom($element[0]);
  });

  $scope.knobMoved = function(x,y){
    var colorData = $scope.getColorAt(x,y);
    $($scope.knob).css('background-color','rgba(' + colorData[0] + ',' + colorData[1] + ',' + colorData[2]  + ',1)');
    $http.post('localhost:8080')

  };
});
