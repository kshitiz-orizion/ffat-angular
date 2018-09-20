(function() {
    'use strict';
    angular.module('myApp.editProfile', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/editprofile', {
                templateUrl: '/views/editProfile.html',
                controller: 'editProfileCtrl'
            });
            
        }
    ])
    angular.module('myApp.editProfile').controller('editProfileCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG' ,
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            
            $scope.saveuser=function(){
                var data1={};
                data1['id']=$scope.user.user_id;
                data1['name']=$scope.user.name;
                data1['email']=$scope.user.email;
                data1['phone']=$scope.user.phone;
            $http({
                method: 'PUT',
                url: $scope.base_url+'/api/v1/profiles/'+$scope.user.user_id,
                headers: {
                    'Content-Type' : 'application/json',
                    'authorization': 'JWT '+$localStorage['user']['token'] },
                data: data1,
            }).then(function successCallback(response) {
                $location.path('/profile');
            }, function errorCallback(response) {
                console.log(response);
            });
            }
            function init(){
                $scope.base_url=CONFIG.base_url;
                $scope.user = $localStorage['user'];
            };
            init();
        }
    ]);


})();