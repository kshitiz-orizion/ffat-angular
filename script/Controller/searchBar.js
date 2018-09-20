(function() {
    'use strict';
    angular.module('myApp.searchBar', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/searchBar', {
                templateUrl: '/views/searchbar.html',
                controller: 'searchBarCtrl'
            });
            
        }
    ])
  angular.module('myApp.searchBar').controller('searchBarCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            $scope.hideRes = function(){
                delete $scope.searchData;
                $scope.mainSearchText = "";
            };

            $scope.search = function(){
                if ($scope.mainSearchText!==undefined && $scope.mainSearchText.length>3) {
                    $http({
                        method: 'GET',
                        url: $scope.base_url+'/records/records/?search='+$scope.mainSearchText,
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': 'Bearer '+$localStorage['user']['token']
                        }
                    }).then(function successCallback(response) {
                        if (response) {
                            $scope.searchData = response.data.results;
                        }
                    }, function errorCallback(response) {
                            //console.log('ERROR'+JSON.stringify(response));
                            $scope.errorMsgs=response.data.non_field_errors;
                    });
                    
                }
            };
            function init(){
                $scope.base_url = CONFIG.base_url;
                
            }
            init();
        }
    ]);


})();