bb8_control.controller("HomeCtrl", function ($scope, dataService) {
  $scope.connect = function(){
    dataService.postCommand('connect');
  };

  $scope.disconnect = function(){
    dataService.postCommand('disconnect');
  };
});
