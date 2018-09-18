(function() {
    'use strict';
    angular.module('myApp.faceSearch', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/faceSearch', {
                templateUrl: '/views/faceSearch.html',
                controller: 'faceSearchCtrl'
            });
            
        }
    ])
  angular.module('myApp.faceSearch').controller('faceSearchCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage', 'CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            
            $scope.submitimage = function(){
                if ($scope.upload_form.file.$valid && $scope.file) {
                    $scope.upload('file');
                }
            }

            $scope.upload = function (file) {
                var fd=new FormData();
                fd.append("profile_pic",$scope.file);
                fd.append("name",$scope.user.name);
                fd.append("phone",$scope.user.phone);
                fd.append("email",$scope.user.email);
                $http({
                    method:'PUT',
                    url: $scope.base_url+'/api/v1/profiles/'+$scope.user.user_id,
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'authorization': 'JWT '+$localStorage['user']['token']
                    },
                    data:fd
                })
                .then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

            $scope.enableSearch = function(resE){
                $http({
                    method: 'GET',
                    url: $scope.base_url+'/records/facial-search-results/?search_id='+resE.id,
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer '+$localStorage['user']['token']
                    }
                }).then(function successCallback(response) {
                    $scope.enableSearchDisp=true;
                    if (response) {
                        $scope.faceSearchRecordData = response.data.results;
                        $scope.faceSearchRecordDataComp = resE;
                        console.log($scope.faceSearchRecordData);
                    }
                }, function errorCallback(response) {
                        //console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
            }
            
            $scope.getFSRes = function(){
                $http({
                    method: 'GET',
                    url: $scope.base_url+'/records/facial-searches/',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer '+$localStorage['user']['token']
                    }
                }).then(function successCallback(response) {
                    if (response) {
                        $scope.faceSearchData = response.data.results;
                        console.log($scope.faceSearchData);
                    }
                }, function errorCallback(response) {
                        //console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
            };

            var init = function (){
                $scope.base_url = CONFIG.base_url;
                $scope.getFSRes();
                
            };
            init();
        }
    ]);
})();