(function() {
	'use strict';
	angular.module('myApp.vendorActivity', ['ngRoute','app.configEnv'])

	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/vendorActivity', {
				templateUrl: '/views/vendorActivity.html',
				controller: 'vendorActivityCtrl'
			});
			
		}
	])
	angular.module('myApp.vendorActivity').controller('vendorActivityCtrl',
	['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG','$window','$uibModal',
		function($rootScope,$scope,$location,$http,$localStorage,CONFIG,$window,$uibModal) {
			$scope.categoryUpdate = function(){
				console.log($scope.activity.category);
			};
			$scope.refreshToken = function(cb){
				var thisToken = $localStorage['user']['token'];
				var token={
					'token': thisToken
				};
				console.log(thisToken);
				$http({
					method: 'POST',
					url: $scope.base_url+'/api/v1/accounts/refresh-token/',
					headers: {
					  'Content-Type': 'application/json',
					  'authorization': 'JWT '+$localStorage['user']['token']
					},
					data: token
				}).then(function successCallback(response) {
					$localStorage['user']['token']=response.data.token;
					cb($localStorage['user']['token']);
				}, function errorCallback(response) {
					console.log(response);
				});
			}

			$scope.createActivity = function(){
				$scope.refreshToken(function(resp){
					//console.log($scope.addAct);
					var data1=$scope.addAct;
					data1.vendor=$localStorage['user']['vendor_id'];
					data1.city=$scope.activity.city;
					data1.inclusion=$scope.addAct.inclusion.split(',');
					data1.exclusion=$scope.addAct.exclusion.split(',');
					data1.pricing_unit=$scope.activity.priceType;
					data1.parent=$scope.activity.parent;
					data1.category=$scope.activity.category;
					data1.coordinate={
						"type": "Point",
						"coordinates": [parseInt($scope.addAct.latitude),parseInt($scope.addAct.longitude)]
					};
					data1.recommend=false;
					console.log($scope.activity.city);
					$http({
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'authorization': 'JWT '+$localStorage['user']['token']
						},
						url: $scope.base_url+'/api/v1/activities/',
						data: data1,
					}).then(function successCallback(response) {
						console.log(response);
						$scope.addAct={
							"vendor":"",
							"name":"",
							"category":"",
							"tagline":"",
							"city":"",
							"duration":"",
							"short_description":"",
							"description":"",
							"inclusion":"",
							"exclusion":"",
							"latitude":"",
							"longitude":"",
							"dfc":"",
							"rating":"",
							"images":"",
						};
						$scope.activity={};
						$scope.openAddForm=!$scope.openAddForm;
						$scope.getMyAct();
					}, function errorCallback(response) {
						console.log(response);
					});
				});
			}
			$scope.deleteActivity = function(act){
				$scope.refreshToken(function(resp){
					//console.log($scope.addAct);
					console.log(act);
					
					$http({
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							'authorization': 'JWT '+$localStorage['user']['token']
						},
						url: $scope.base_url+'/api/v1/activities/'+act.id+'/',
					}).then(function successCallback(response) {
						console.log(response);
					}, function errorCallback(response) {
						console.log(response);
					});
				});
			}
			$scope.getCategory = function (){
				$http({
				  method: 'GET',
				  url: $scope.base_url+'/api/v1/activity-categories/?is_root=True',
				}).then(function successCallback(response) {
				  
					var categoryList = response.data.results;
					$scope.categorys=[];
					for (var i=0; i<categoryList.length;i++) {
						if (categoryList[i]['children'].length==1) {
							$scope.categorys.push(categoryList[i]['children'][0]);
						}else if (categoryList[i]['children'].length==0){
							//$scope.categorys.push(categoryList[i]);
						}else {
							for (var j=0; j<categoryList[i]['children'].length;j++) {
								$scope.categorys.push(categoryList[i]['children'][j]);
							}
						}
					}
					console.log($scope.categorys);
				
				}, function errorCallback(response) {
				  console.log(response);
				});
			};
			$scope.getCity = function (){
				$http({
				  method: 'GET',
				  url: $scope.base_url+'/api/v1/cities?recommend=True',
				}).then(function successCallback(response) {
				  
					$scope.cities=response.data.results;
					console.log($scope.cities);
				
				}, function errorCallback(response) {
				  console.log(response);
				});
			};
			$scope.getMyAct = function(){
				$http({
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'authorization': 'JWT '+$localStorage['user']['token']
					},
					url: $scope.base_url+'/api/v1/activities/?vendor_id='+$localStorage['user']['vendor_id']
				}).then(function successCallback(response) {
					$scope.myActivityList=response.data.results;
					console.log(response);
				}, function errorCallback(response) {
					console.log(response);
				});
			};
			$scope.priceUpdate = function(){
				console.log($scope.activity.priceType);
			}
			$scope.editThisAct = function(activity){
				
			    var modalInstance = $uibModal.open({
					animation: $scope.animationsEnabled,
					templateUrl: 'editActivity.html',
					controller: 'ModalInstanceCtrl',
					size: 'lg',
					resolve: {
						activity: function(){
							return activity;
						},
						category: function(){
							return $scope.categorys;
						},
						city: function(){
							return $scope.cities;
						},
						vendor: function(){
							return $localStorage['user']['vendor_id'];
						},
						token: function(){
							return $localStorage['user']['token']
						}
					}
				});

				modalInstance.result.then(function (selectedItem) {
					
				}, function () {
					
				});
			};
			function init(){
				$scope.base_url=CONFIG.base_url;
				$scope.slickConfig = {
					enabled:true,
					autoPlay:false,
					slidesToShow:4,
					slidesToScroll:2
				};
				$scope.getMyAct();
				$scope.addAct={
					"vendor":"",
					"name":"",
					"category":"",
					"tagline":"",
					"city":"",
					"duration":"",
					"short_description":"",
					"description":"",
					"inclusion":"",
					"exclusion":"",
					"latitude":"",
					"longitude":"",
					"dfc":"",
					"rating":"",
					"images":"",
				};
				$scope.getCategory();
				

				$scope.getCity();
			};
			init();
		}
	]);

	angular.module('myApp.vendorActivity').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, activity,category,city,vendor,token) {

		$scope.activity=activity;
		//console.log($scope.activity);
		$scope.categorys=category;
		$scope.cities=city;
		$scope.vendor=vendor;
		$scope.addAct={
			"vendor":"",
			"name":"",
			"category":"",
			"tagline":"",
			"city":"",
			"duration":"",
			"short_description":"",
			"description":"",
			"inclusion":"",
			"exclusion":"",
			"dfc":"",
			"rating":"",
			"images":"",
		};
		
		$scope.refreshToken = function(cb){
			var thisToken = $localStorage['user']['token'];
			var token={
				'token': thisToken
			};
			console.log(thisToken);
			$http({
				method: 'POST',
				url: $scope.base_url+'/api/v1/accounts/refresh-token/',
				headers: {
				  'Content-Type': 'application/json',
				  'authorization': 'JWT '+$localStorage['user']['token']
				},
				data: token
			}).then(function successCallback(response) {
				$localStorage['user']['token']=response.data.token;
				cb($localStorage['user']['token']);
			}, function errorCallback(response) {
				console.log(response);
			});
		}
		$scope.createActivity = function(){
			$scope.refreshToken(function(resp){
				//console.log($scope.addAct);
				var data1=$scope.activity;
				data1.vendor=$scope.vendor;
				data1.city=$scope.activity.city;
				data1.inclusion=$scope.activity.inclusion.split(',');
				data1.exclusion=$scope.activity.exclusion.split(',');
				data1.pricing_unit=$scope.activity.priceType;
				data1.parent=$scope.activity.parent;
				data1.category=$scope.activity.category;
				data1.coordinate={
					"type": "Point",
					"coordinates": [parseInt($scope.activity.latitude),parseInt($scope.activity.longitude)]
				};
				data1.recommend=false;
				console.log($scope.activity.city);
				$http({
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'authorization': 'JWT '+$localStorage['user']['token']
					},
					url: $scope.base_url+'/api/v1/activities/'+data1.id+'/',
					data: data1,
				}).then(function successCallback(response) {
					$uibModalInstance.dismiss('success');
				}, function errorCallback(response) {
					console.log(response);
				});
			});
		}

		$scope.ok = function () {
			$scope.createActivity();

			
			// console.log($scope.activity);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})();