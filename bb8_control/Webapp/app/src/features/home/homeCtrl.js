bb8_control.controller("HomeCtrl", function ($scope, webSocketService) {
  $scope.connect = function(){
    webSocketService.postCommand('connect', "");
  };

  $scope.disconnect = function(){
    webSocketService.postCommand('disconnect', "");
  };
});
