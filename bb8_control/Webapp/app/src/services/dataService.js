/**
 * Created by Administrator on 2015.12.09..
 */
bb8_control.run(function($rootScope){
    $rootScope.loading = false;
});

bb8_control.service('dataService',function($http, $q, backendConfig, $rootScope){
    var self = this;

    var backendUrl = 'http://' + backendConfig.address;

    var reqCnf = function(url,data,mock){
        return {
            method: mock ? 'GET' : 'POST',
            url: mock ? url + '/app/mock/' + data.table + '.json': url,
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    };

    this.pendingRequests = 0;
    this.err = 0;

    this.setLoadingState = function(pendingReqDelta){
        this.pendingRequests += pendingReqDelta;
        $rootScope.loading = this.pendingRequests > 0;
        if(!$rootScope.loading){
            if(this.err > 0){
                $.notify("Hiba történt a kiszolgáló elérése során", "error");
            }
            this.err = 0;
        }
    };

    this.getData = function(table,entity,filterCondition){
        var deferred = $q.defer();
        self.setLoadingState(1);
        for(key in filterCondition){
            if(!angular.isArray(filterCondition[key])){
                filterCondition[key] = [filterCondition[key]];
            }
        }

        $http(reqCnf(backendUrl,{'fuggveny':'listazas', 'table' : table, 'data':angular.toJson(filterCondition)})).then(function(res){
            if(res.data[table] && !angular.isArray(res.data[table][entity]) && angular.isObject(res.data[table][entity])){
                var newList = [];
                newList.push(res.data[table][entity]);
                res.data[table][entity] = newList;
            }
            deferred.resolve(res.data[table] && res.data[table][entity]);
            self.setLoadingState(-1);
        },function(err){
            deferred.reject(err);
            self.err++;
            self.setLoadingState(-1);
        });

        return deferred.promise;
    };

    this.setData = function(table,dataSet){
        var deferred = $q.defer();
        var postData = {};
        postData.fuggveny = 'modositas';
        postData.table = table;
        postData.data = angular.toJson(dataSet);
        self.setLoadingState(1);
        $http(reqCnf(backendUrl,postData)).then(function(res){
            deferred.resolve(res.data);
            self.setLoadingState(-1);
        },function(err){
            deferred.reject(err);
            self.err++;
            self.setLoadingState(-1);
        });

        return deferred.promise;
    };

    this.saveData = function(table,dataSet){
        var deferred = $q.defer();
        var postData = {};
        postData.fuggveny = 'hozzaadas';
        postData.table = table;
        postData.data = angular.toJson(dataSet);
        self.setLoadingState(1);
        $http(reqCnf(backendUrl,postData)).then(function(res){
            deferred.resolve(res.data);
            self.setLoadingState(-1);
        },function(err){
            deferred.reject(err);
            self.err++;
            self.setLoadingState(-1);
        });

        return deferred.promise;
    };

    this.deleteRecord = function(table,dataSet){
        var deferred = $q.defer();
        var postData = {};
        postData.fuggveny = 'torles';
        postData.table = table;
        postData.data = angular.toJson(dataSet);
        self.setLoadingState(1);
        $http(reqCnf(backendUrl,postData)).then(function(res){
            deferred.resolve(res.data);
            self.setLoadingState(-1);
        },function(err){
            deferred.reject(err);
            self.err++;
            self.setLoadingState(-1);
        });

        return deferred.promise;
    };
});
