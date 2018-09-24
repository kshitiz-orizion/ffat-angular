(function() {
    'use strict';
    angular.module('myApp.analysis', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/analysis', {
                templateUrl: '/views/analysis.html',
                controller: 'analysisCtrl'
            });
            
        }
    ])
  angular.module('myApp.analysis').controller('analysisCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage', 'CONFIG','$window',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG,$window) {
            $scope.enable = function(label){
                $scope.enableList = label;
            }

            $scope.getSearchata = function(){
                $http({
                    method: 'GET',
                    url: $scope.base_url+'/records/analytics/searches/',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer '+$localStorage['user']['token']
                    }
                }).then(function successCallback(response) {
                    if (response) {
                        $scope.recordSata = response.data;
                        console.log($scope.recordSata);
                        $scope.recordSr1=[];
                        for (var key in $scope.recordSata) {
                            var obj={'c':[]};
                            var obbj1={'v': key};
                            obj.c.push(obbj1);
                            var obbj1={'v': $scope.recordSata[key]};
                            obj.c.push(obbj1);
                            $scope.recordSr1.push(obj);
                        }
                        
                        $scope.recordsr1={};
                        $scope.recordsr1.type = "PieChart";
                        $scope.recordsr1.options = {
                            'title':'search'
                        };
                        $scope.recordsr1.data = {
                            "cols": [
                                {id: "t", label: "Topping", type: "string"},
                                {id: "s", label: "Slices", type: "number"}
                            ], "rows": $scope.recordSr1
                        };
                        
                    }
                }, function errorCallback(response) {
                        //console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
            };

            $scope.getCountata = function(){
                $http({
                    method: 'GET',
                    url: $scope.base_url+'/records/analytics/counts/',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer '+$localStorage['user']['token']
                    }
                }).then(function successCallback(response) {
                    if (response) {
                        $scope.recordCata = response.data;
                        //$scope.records1={};
                        $scope.recordC1=[];
                        for (var key in $scope.recordCata) {
                            var obj={'c':[]};
                            var obbj1={'v': key};
                            obj.c.push(obbj1);
                            var obbj1={'v': $scope.recordCata[key]};
                            obj.c.push(obbj1);
                            $scope.recordC1.push(obj);
                        }
                        
                        $scope.recorddc1={};
                        $scope.recorddc1.type = "PieChart";
                        $scope.recorddc1.options = {
                            'title':'counts'
                        };
                        $scope.recorddc1.data = {
                            "cols": [
                                {id: "t", label: "Topping", type: "string"},
                                {id: "s", label: "Slices", type: "number"}
                            ], "rows": $scope.recordC1
                        };
                        
                    }
                }, function errorCallback(response) {
                        //console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
            }

            $scope.getRecordata = function(){
                $http({
                    method: 'GET',
                    url: $scope.base_url+'/records/analytics/records/',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer '+$localStorage['user']['token']
                    }
                }).then(function successCallback(response) {
                    if (response) {
                        $scope.recordData = response.data;
                        //$scope.records1={};
                        $scope.recordD1=[];
                        for (var key in $scope.recordData['ages']) {
                            var obj={'c':[]};
                            var obbj1={'v': key};
                            obj.c.push(obbj1);
                            var obbj1={'v': $scope.recordData['ages'][key]};
                            obj.c.push(obbj1);
                            $scope.recordD1.push(obj);
                        }
                        $scope.recordD2=[];
                        for (var key in $scope.recordData['crimes']) {
                            var obj={'c':[]};
                            var obbj1={'v': key};
                            obj.c.push(obbj1);
                            var obbj1={'v': $scope.recordData['crimes'][key]};
                            obj.c.push(obbj1);
                            $scope.recordD2.push(obj);
                        }
                        $scope.recordD3=[];
                        for (var key in $scope.recordData['genders']) {
                            var obj={'c':[]};
                            var obbj1={'v': key};
                            obj.c.push(obbj1);
                            var obbj1={'v': $scope.recordData['genders'][key]};
                            obj.c.push(obbj1);
                            $scope.recordD3.push(obj);
                        }
                        $scope.recordD4=[];
                        for (var key in $scope.recordData['offences']) {
                            var obj={'c':[]};
                            var obbj1={'v': key};
                            obj.c.push(obbj1);
                            var obbj1={'v': $scope.recordData['offences'][key]};
                            obj.c.push(obbj1);
                            $scope.recordD4.push(obj);
                        }
                        $scope.recordD5=[];
                        for (var key in $scope.recordData['religions']) {
                            var obj={'c':[]};
                            var obbj1={'v': key};
                            obj.c.push(obbj1);
                            var obbj1={'v': $scope.recordData['religions'][key]};
                            obj.c.push(obbj1);
                            $scope.recordD5.push(obj);
                        }
                        $scope.records1={};
                        $scope.records1.type = "PieChart";
                        $scope.records1.options = {
                            'title':'ages'
                        };
                        $scope.records1.data = {
                            "cols": [
                                {id: "t", label: "Topping", type: "string"},
                                {id: "s", label: "Slices", type: "number"}
                            ], "rows": $scope.recordD1
                        };
                        $scope.records2={};
                        $scope.records2.type = "PieChart";
                        $scope.records2.options = {
                            'title':'crimes'
                        };
                        $scope.records2.data = {
                            "cols": [
                                {id: "t", label: "Topping", type: "string"},
                                {id: "s", label: "Slices", type: "number"}
                            ], "rows": $scope.recordD2
                        };
                        $scope.records3={};
                        $scope.records3.type = "PieChart";
                        $scope.records3.options = {
                            'title':'genders'
                        };
                        $scope.records3.data = {
                            "cols": [
                                {id: "t", label: "Topping", type: "string"},
                                {id: "s", label: "Slices", type: "number"}
                            ], "rows": $scope.recordD3
                        };
                        $scope.records4={};
                        $scope.records4.type = "PieChart";
                        $scope.records4.options = {
                            'title':'offences'
                        };
                        $scope.records4.data = {
                            "cols": [
                                {id: "t", label: "Topping", type: "string"},
                                {id: "s", label: "Slices", type: "number"}
                            ], "rows": $scope.recordD4
                        };
                        $scope.records5={};
                        $scope.records5.type = "PieChart";
                        $scope.records5.options = {
                            'title':'religions'
                        };
                        $scope.records5.data = {
                            "cols": [
                                {id: "t", label: "Topping", type: "string"},
                                {id: "s", label: "Slices", type: "number"}
                            ], "rows": $scope.recordD5
                        };
                        console.log($scope.recordData);
                    }
                }, function errorCallback(response) {
                        //console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
            };

            var init = function (){
                $scope.base_url = CONFIG.base_url;
                $rootScope.locationCrumb = 'Criminals-analysis';
                $scope.enableList = 'records';
                $scope.getRecordata();
                $scope.getSearchata();
                $scope.getCountata();
            };
            init();
        }
    ]);
})();