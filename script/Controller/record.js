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
                        //console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
            };
            function init(){
                $scope.base_url = CONFIG.base_url;
                $scope.getUserData();
            }
            init();
        }
    ]);


})();