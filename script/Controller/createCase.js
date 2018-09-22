

(function() {
    'use strict';
    angular.module('myApp.createCase', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/createcase', {
                templateUrl: '/views/createCase.html',
                controller: 'createCaseCtrl'
            });
            
        }
    ])
  angular.module('myApp.createUser').controller('createCaseCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG','$window',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG,$window) {
        	$scope.records=[{}];
        	$scope.comments=[{}];
        	$scope.recForCase=[];
        	$scope.commForCase=[]
        	$scope.addRecord=function(){
        		$scope.records.push({});
        	}
        	$scope.addComment=function(){
        		$scope.comments.push({});
        	}
        	$scope.submitCase= async function(value){
        		angular.element('.CaseCreate').css('display','block');
        		angular.element('.CaseForm').css('display','none');
        		if(value.comment){
        		$scope.NewComments=Object.values(value.comment);
        		}
        		 await $http({
        			method:'POST',
        			url:$scope.base_url+'/records/cases/',
        			headers:{
        				'Content-type':'application/json',
        				'authorization':'Bearer '+$localStorage['user']['token']
        			},
        			data:value
        		}).then(function successCallback(response) {
                    if (response) {
                        $scope.caseId=response.data.id;
                    }
                }, function errorCallback(response) {
                        $scope.errorMsgs=response.data.non_field_errors;
                });
                	if($scope.recForCase.length!==0){
	          			for(var i=0;i<$scope.recForCase.length;i++){
	          				await $http({
	                			method:'POST',
	                			url:$scope.base_url+'/records/cases/'+$scope.caseId+'/record/',
	                			headers:{
	        						'Content-type':'application/json',
	        						'authorization':'Bearer '+$localStorage['user']['token']
	        					},
	        					data:{"record":$scope.recForCase[i]}
	                		})
	          			}
          			}
          			if($scope.NewComments.length!==0){
	          			for(var i=0;i<$scope.NewComments.length;i++){
	          				await $http({
	                			method:'POST',
	                			url:$scope.base_url+'/records/case-comments/',
	                			headers:{
	        						'Content-type':'application/json',
	        						'authorization':'Bearer '+$localStorage['user']['token']
	        					},
	        					data:{"case":$scope.caseId,"comment":$scope.NewComments[i]}
	                		})
	          			}
          			}
          			angular.element('.CaseCreate').css('display','block');
          			$location.path('/record');
          			$scope.$apply();
           
        	}
        	$scope.submitRecordId=function(rec){
        		$scope.recForCase.push(rec);
        	}
        	$scope.submitComment=function(comm){
        		$scope.commForCase.push(comm);
        	}
        	$scope.getRecords=async function(){
        		angular.element('.CaseCreate').css('display','block');
        		await $http({
        			method:'GET',
        			url:$scope.base_url+'/records/records/',
        			headers:{
        				'Content-type':'application/json',
        				'authorization':'Bearer '+$localStorage['user']['token']
        			}
        		}).then(function successCallback(response) {
                        $scope.recordsCase = response.data.results;
                        angular.element('.CaseCreate').css('display','none');
                }, function errorCallback(response) {
                        ////console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });

        	}
        	$scope.getUsers=async function(){
        		angular.element('.CaseCreate').css('display','block');
        		await $http({
        			method:'GET',
        			url:$scope.base_url+'/users/users/',
        			headers:{
        				'Content-type':'application/json',
        				'authorization':'Bearer '+$localStorage['user']['token']
        			}
        		}).then(function successCallback(response) {
                        $scope.assignee = response.data.results;
                        angular.element('.CaseCreate').css('display','none');
                }, function errorCallback(response) {
                        ////console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
                
        	}
            function init(){
            	
                $rootScope.locationCrumb = 'Create-case';
                $scope.base_url = CONFIG.base_url;
                $scope.getRecords();
                $scope.getUsers();
                $scope.case={};
                $scope.case.comment={};
                
            }
            init();
        }
    ]);


})();