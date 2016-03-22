/**
 * Created by Administrator on 2015.12.05..
 */
bb8_control.service('innerTransfer',function(){
        this.set = function(data){
            this.data = data;
        };

        this.get = function(){
            return this.data;
        };
});

bb8_control.run(function($rootScope,$timeout){
    $rootScope.Utils = {
        keys : Object.keys
    };
    $rootScope.reloadView = function(){
        $rootScope.loading = true;
        $rootScope.reload = true;
        $timeout(function(){
            $rootScope.reload = false;
            $rootScope.loading = false;
        });
    };
});
