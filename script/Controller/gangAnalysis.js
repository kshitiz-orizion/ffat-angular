(function() {
    'use strict';
    angular.module('myApp.gangAnalysis', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/gangAnalysis', {
                templateUrl: '/views/gangAnalysis.html',
                controller: 'gangAnalysisCtrl'
            });
            
        }
    ])
  angular.module('myApp.gangAnalysis').controller('gangAnalysisCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage', 'CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            
            $scope.searchGangs = function(){
                console.log($scope.searchScope);
                var addUrl ='';
                if($scope.searchScope.name){
                    addUrl = addUrl+'?name='+$scope.searchScope.name;
                }
                if($scope.searchScope.name_similar){
                    addUrl = addUrl+'?name_similar='+$scope.searchScope.name_similar;
                }
                if($scope.searchScope.search){
                    addUrl = addUrl+'?search='+$scope.searchScope.search;
                }
                if($scope.searchScope.criminal_category){
                    addUrl = addUrl+'?criminal_category='+$scope.searchScope.criminal_category;
                }
                if($scope.searchScope.offence_type){
                    addUrl = addUrl+'?offence_type='+$scope.searchScope.offence_type;
                }
                console.log(addUrl);
                $http({
                    method: 'GET',
                    url: $scope.base_url+'/records/records/'+addUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer '+$localStorage['user']['token']
                    }
                }).then(function successCallback(response) {
                    if (response) {
                        $scope.allGRecords = response.data.results;
                        console.log($scope.allGRecords);
                    }
                }, function errorCallback(response) {
                        //console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
            };


            $scope.checkForGang = function(id){
                $scope.showAnalysis = true;
                $http({
                    method: 'POST',
                    url: $scope.base_url+'/records/records/'+id+'/gang-analysis/',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer '+$localStorage['user']['token']
                    }
                }).then(function successCallback(response) {
                    if (response) {
                        $scope.analysisData = response.data;
                        console.log($scope.analysisData);
                    }
                }, function errorCallback(response) {
                        //console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
            };


            var init = function (){
                $rootScope.locationCrumb = 'Gang-analysis';
                $scope.searchScope = {};
                $scope.base_url = CONFIG.base_url;
                
            };
            init();
        }
    ]);
})();