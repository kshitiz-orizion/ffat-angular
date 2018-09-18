(function() {
    'use strict';
    angular.module('myApp.forgot', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/forgot', {
                templateUrl: '/views/forgot.html',
                controller: 'forgotCtrl'
            });
            
        }
    ])
  angular.module('myApp.forgot').controller('forgotCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','$window','CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,$window,CONFIG) {
            $scope.submit = function(){
                var data1 = {};
                var url = 'https://api.staging.bmyraahi.com/api/v1/accounts/manage/recover-password/';
                data1.email=$scope.uname1;
                $http({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data1
                }).then(function successCallback(response) {
                    $scope.errorMsgs=true;
                    setTimeout(function() {
                        $window.location.href = '/';
                    }, 2000);
                }, function errorCallback(response) {
                });
            }
            var init = function(){
                $scope.base_url = "https://api.staging.bmyraahi.com";
            }
        }
    ]);
})();