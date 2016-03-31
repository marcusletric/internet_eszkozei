/**
 * Created by Administrator on 2015.12.09..
 */
bb8_control.run(function($rootScope){
    $rootScope.loading = false;
});

bb8_control.service('dataService',function($http){
    var self = this;

    var backendUrl = 'http://localhost:8080' ;

    var reqCnf = function(url,data){
        return {
            method: 'POST',
            url: url,
            data: data,
            headers : {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
    };

    this.pendingRequests = 0;
    this.err = 0;

    this.postCommand = function(command,data){
      var postData = {};
      postData[command] = data;
      $http(reqCnf(backendUrl,postData));
    };


});
