(function() {
    'use strict';
    angular.module('myApp.record', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/record', {
                templateUrl: '/views/record.html',
                controller: 'recordCtrl'
            });
            
        }
    ])
  angular.module('myApp.record').controller('recordCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            $scope.enable=function(label){
                if(label=='create'){
                    $scope.create=true;
                    $scope.user=false;
                    $scope.case=false;
                }
                else if(label=='user'){
                    $scope.create=false;
                    $scope.user=true;
                    $scope.case=false;
                }
                else{
                    $scope.create=false;
                    $scope.user=false;
                    $scope.case=true;
                }
            }
            $scope.getUserData = function(){
                $http({
                    method: 'GET',
                    url: $scope.base_url+'/users/users/',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer '+$localStorage['user']['token']
                    }
                }).then(function successCallback(response) {
                    if (response) {
                        $scope.users = response.data.results;
                    }
                }, function errorCallback(response) {
                        ////console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
            };

            $scope.getCaseData=function(){
                $http({
                    method:'GET',
                    url:$scope.base_url+'/records/cases/',
                    headers:{
                       'Content-Type': 'application/json',
                       'authorization': 'Bearer '+$localStorage['user']['token'] 
                    }
                }).then(function successCallback(response){
                    if(response){
                        $scope.cases=response.data.results;
                    }
                }, function errorCallback(response){
                    $scope.errorMsgs=response.data.non_field_errors;
                });
            }
            function init(){
                $rootScope.locationCrumb = 'Manage-record';
                $scope.base_url = CONFIG.base_url;
                $scope.getUserData();
                $scope.getCaseData();
                $scope.create=true;
            }
            init();
        }
    ]);


})();