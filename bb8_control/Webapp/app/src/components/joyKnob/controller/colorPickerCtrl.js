bb8_control.controller("colorPicker", function ($scope,$element,$timeout) {
  $timeout(function(){
    $scope.renderDom($element[0]);
  });

  $scope.knobMoved = function(x,y){
    console.log(x + ' ' + y);
    console.log($scope.getColorAt(x,y));
  };
});
