bb8_control.controller("HomeCtrl", function ($scope, dataService, microphoneService) {
  /*microphoneService.setCallback(function () {
    $scope.volume = microphoneService.gainValue;
    $scope.$digest();
  });*/

  $scope.connect = function(){
    dataService.postCommand('connect', "");
  };

  $scope.disconnect = function(){
    dataService.postCommand('disconnect', "");
  };
});
