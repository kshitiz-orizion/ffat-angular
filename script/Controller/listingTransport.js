(function() {
	'use strict';
	angular.module('myApp.listingTransport', ['ngRoute','app.configEnv'])

	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/listTransport', {
				templateUrl: '/views/listTransport.html',
				controller: 'listTransportCtrl'
			});
			
		}
	])
  angular.module('myApp.listingTransport').controller('listTransportCtrl', ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG',
  function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
  	$scope.addToCartLocal=function(car){
  		$localStorage['cartIds'][car.id]=true;
  		if ($localStorage['cart'] && $localStorage['cart']['cars']) {
  			  	$localStorage['cart']['cars'].push(car);
  			}
  			$rootScope.checkForExist('num',function(resp){});
  	}
	$scope.getCab = function(){
		var url;
		if ($scope.url_id == 'featured') {
			url = $scope.base_url+'/api/v1/cars';
		}else{
			url = $scope.base_url+'/api/v1/cars?city_id='+$scope.url_id;
		}
		$http({
			method: 'GET',
			url: url,
		}).then(function successCallback(response) {
  
			$scope.cabList = response.data.results;
			console.log($scope.cabList);
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	$scope.getBike = function(){
		var url;
		if ($scope.url_id == 'featured') {
			url = $scope.base_url+'/api/v1/bikeList';
		}else{
			url = $scope.base_url+'/api/v1/bikes?city_id='+$scope.url_id;
		}
		$http({
			method: 'GET',
			url: url,
		}).then(function successCallback(response) {
  
			$scope.bikeList = response.data.results;
			console.log($scope.cabList);
		}, function errorCallback(response) {
			console.log(response);
		});
	}
	$scope.refreshToken = function(cb){
		var thisToken = $localStorage['user']['token'];
		var token={
			'token': thisToken
		};
		//console.log(thisToken);
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
	$scope.addToCart = function(label,data){
		console.log($rootScope.userLoggedIn);
		$scope.cartLoadin=true;
		if(!$localStorage['cartIds'][data.id]){
			$scope.refreshToken(function(resp){
				if (label=='cab') {
					var data1={
						"cart":$localStorage['user']['cart_id'],
						'car':data.id
					};
					var url = $scope.base_url+'/api/v1/cart/cars/';
					$http({
						method: 'POST',
						url: url,
						headers: {
							'Content-Type': 'application/json',
							'authorization': 'JWT '+$localStorage['user']['token']
						},
						data: data1
					}).then(function successCallback(response) {
						$localStorage['cartIds'][data.id]=true; 
						if ($localStorage['cart'] && $localStorage['cart']['car']) {
							$localStorage['cart']['car'][response.data['car']]=response.data; 
						}else if ($localStorage['cart'] && !$localStorage['cart']['car']){
							$localStorage['cart']['car']={};
							$localStorage['cart']['car'][response.data['car']]=response.data; 
						}else {
							$localStorage['cart']={};
							$localStorage['cart']['car']={};
							$localStorage['cart']['car'][response.data['car']]=response.data;
						}
						$rootScope.checkForExist(data.id,function(resp){
						  if (resp) {
						    $scope.existInCart=true;
						  }else {
						    $scope.existInCart=false;
						  }
						});
						$rootScope.addRemoveMessage = 'Car Has Been added!';
			          	angular.element('.NotificationDiv').css('display', 'block');
						window.setTimeout(function(){
							angular.element('.NotificationDiv').css('display', 'none');
							$rootScope.$apply();
						},800);
					}, function errorCallback(response) {
						console.log(response);
						if(response.data.car=='You can only add same city car in cart'){
			              var label = 'Car Has Been added!';
			              $rootScope.wantToChangeCityPopUp(url, data1, data.id, label);
			              if($rootScope.is_cart_deleted){
			                $rootScope.is_cart_deleted = false;
			              }
			            }
					});
				}else {
					var data1={
						"cart":$localStorage['user']['cart_id'],
						'bike':data.id,
						'total_days':1
					};
					var url = $scope.base_url+'/api/v1/cart/bikes/';
					$http({
						method: 'POST',
						url: url,
						headers: {
							'Content-Type': 'application/json',
							'authorization': 'JWT '+$localStorage['user']['token']
						},
						data: data1
					}).then(function successCallback(response) {
						$localStorage['cartIds'][data.id]=true; 
						if ($localStorage['cart'] && $localStorage['cart']['bike']) {
							$localStorage['cart']['bike'][response.data['bike']]=response.data; 
						}else if ($localStorage['cart'] && !$localStorage['cart']['bike']){
							$localStorage['cart']['bike']={};
							$localStorage['cart']['bike'][response.data['bike']]=response.data; 
						}else {
							$localStorage['cart']={};
							$localStorage['cart']['bike']={};
							$localStorage['cart']['bike'][response.data['bike']]=response.data;
						}

						$rootScope.checkForExist(data.id,function(resp){
						  if (resp) {
						    $scope.existInCart=true;
						  }else {
						    $scope.existInCart=false;
						  }
						});
						$rootScope.addRemoveMessage = 'Bike Has Been added!';
			          	angular.element('.NotificationDiv').css('display', 'block');
			          	window.setTimeout(function(){
							angular.element('.NotificationDiv').css('display', 'none');
							$rootScope.$apply();
						},800);
					
					}, function errorCallback(response) {
						console.log(response);
						if(response.data.bike=='You can only add same city bike in cart'){
			              var label = 'Bike Has Been added!';
			              $rootScope.wantToChangeCityPopUp(url, data1, data.id, label);
			              if($rootScope.is_cart_deleted){
			                $rootScope.is_cart_deleted = false;
			              }
			            }
					});
				}
				
				
			});
		}
		else{
			alert('already there in cart');
		}
	};
	$scope.getCityDetails = function(label){
		var url = $scope.base_url+'/api/v1/cities/'+$scope.url_id+'/';
		$http({
			method: 'GET',
			url: url,
		}).then(function successCallback(response) {
			//console.log(response);
			$scope.cityinfo = response.data;
		}, function errorCallback(response) {
			console.log(response);
		});
	};
	$scope.changeType= function(label){
		console.log(label);
		if (label=='cab') {
			$scope.transType='cab';
			delete $scope.bikeList;
			delete $scope.cabList;
			$scope.getCab();
		
		}else {
			$scope.transType='bike';
			delete $scope.cabList;
			delete $scope.bikeList;
			$scope.getBike();
		}
	}
	$scope.getCart = function(){
		$scope.cartLoadin=true;
		$scope.refreshToken(function(resp){
			$http({
				method: 'GET',
				url: $scope.base_url+'/api/v1/cart/',
				headers: {
					'Content-Type': 'application/json',
					'authorization': 'JWT '+$localStorage['user']['token']
				},
			}).then(function successCallback(response) {
				$scope.cartLoadin=false;
				
				$scope.cartData = response.data;
				console.log($scope.cartData);
			}, function errorCallback(response) {

				console.log(response);
			});
		});
	}
	function init(){
		angular.element('.profileDropdownCont').css('display','none');
		$scope.base_url=CONFIG.base_url;
		$scope.disableBtn={};
		
		if(!$localStorage['cart']){
			$localStorage['cart']={};
		}
		if(!$localStorage['cart']['cab']){
			$localStorage['cart']['cab']={};
		}
		if($localStorage['cart'] && $localStorage['cart']['cab']){
			for(var key in $localStorage['cart']['cab']){
				$scope.disableBtn[key]=true;
			}
		};
		$scope.url = $location.absUrl().split('?')[1];
			if ($scope.url!=undefined) {
			$scope.url_id = $scope.url.split('=')[1];
			$scope.getCityDetails($scope.url_id);
		}else {
			$scope.url_id='featured';
		}
  
		if ($rootScope.userLoggedIn) {
			$scope.getCart();
		}
		$scope.itinItems = [{id:1,person:1},{id:2,person:2},{id:3,person:3},{id:4,person:4},{id:5,person:5}];
		$scope.persons = 4;
		$scope.transType={};
		$scope.transType='cab';
		
		$scope.getCab();
	};
	init();
  }]);


})();