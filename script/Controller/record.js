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
                    angular.element('.createDiv').css('background-color','orange');
                    angular.element('.usersDiv').css('background-color','#F5F5F6');
                    angular.element('.casesDiv').css('background-color','#F5F5F6');
                    $scope.create=true;
                    $scope.user=false;
                    $scope.case=false;
                }
                else if(label=='user'){
                    angular.element('.usersDiv').css('background-color','orange');
                    angular.element('.casesDiv').css('background-color','#F5F5F6');
                    angular.element('.createDiv').css('background-color','#F5F5F6');
                    $scope.create=false;
                    $scope.user=true;
                    $scope.case=false;
                }
                else{
                    angular.element('.casesDiv').css('background-color','orange');
                    angular.element('.createDiv').css('background-color','#F5F5F6');
                    angular.element('.usersDiv').css('background-color','#F5F5F6');
                    $scope.create=false;
                    $scope.user=false;
                    $scope.case=true;
                }
            }
            $scope.getUserData = async function(){
                await $http({
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

            $scope.getCaseData=async function(){
                await $http({
                    method:'GET',
                    url:$scope.base_url+'/records/cases/',
                    headers:{
                       'Content-Type': 'application/json',
                       'authorization': 'Bearer '+$localStorage['user']['token'] 
                    }
                }).then(function successCallback(response){
                    if(response){
                        $scope.cases=response.data.results;
                        for(var i=0;i<$scope.cases.length;i++){
                            for(var j=0;j<$scope.users.length;j++){                               
                                if($scope.cases[i].assignee==$scope.users[j].id){
                                     $scope.cases[i].assigneeName=$scope.users[j].name;
                                     $scope.cases[i].assigneeMobile=$scope.users[j].mobile;
                                }
                            }
                        }
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
                angular.element('.createDiv').css('background-color','orange');
                angular.element('.usersDiv').css('background-color','#F5F5F6');
                angular.element('.casesDiv').css('background-color','#F5F5F6');
            }
            init();
        }
    ]);


})();