(function() {
    'use strict';
    angular.module('myApp.createUser', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/createuser', {
                templateUrl: '/views/createUser.html',
                controller: 'createUserCtrl'
            });
            
        }
    ])
  angular.module('myApp.createUser').controller('createUserCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG','$window',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG,$window) {

            $scope.submitUser=function(user){
                if(!user.is_active){
                    user.is_active=false;
                }
                if(!user.is_staff){
                    user.is_staff=false;
                }
                $http({
                    method:'POST',
                    url: $scope.base_url+'/users/users/',
                    headers: {
                                'Content-Type': 'application/json',
                                'authorization': 'Bearer '+$localStorage['user']['token']
                            },
                    data:user
                })
                .then(function successCallback(response) {
                            $location.path('/record');
                        }, function errorCallback(response) {
                            console.log(response);
                        });

            }


            function init(){
                $rootScope.locationCrumb = 'Create-user';
                $scope.base_url = CONFIG.base_url;
            }
            init();
        }
    ]);


})();