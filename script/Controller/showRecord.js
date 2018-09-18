(function() {
    'use strict';
    angular.module('myApp.showRecord', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/showRecord', {
                templateUrl: '/views/showRecord.html',
                controller: 'showRecordCtrl'
            });
            
        }
    ])
  angular.module('myApp.showRecord').controller('showRecordCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            
            $scope.getRecordDetails  = function(id){
                console.log('here');
                
                $http({
                    method: 'GET',
                    url: $scope.base_url+'/records/records/'+id,
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer '+$localStorage['user']['token']
                    }
                }).then(function successCallback(response) {
                    if (response) {
                        $scope.record = response.data;
                    }
                }, function errorCallback(response) {
                        //console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
                    

            };
            function init(){
                $scope.base_url = CONFIG.base_url;
                $scope.url = $location.absUrl().split('?')[1];
                if ($scope.url!=undefined) {
                    $scope.url_id = $scope.url.split('=')[1];
                    $scope.getRecordDetails($scope.url_id);
                }else {
                    $scope.url_id='featured';
                }
                
            }
            init();
        }
    ]);


})();