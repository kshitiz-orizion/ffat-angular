(function() {
	'use strict';
	angular.module('myApp.listingPlaces', ['ngRoute','app.configEnv'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/listPlaces', {
				templateUrl: '/views/listPlaces.html',
				controller: 'listPlacesCtrl'
			});
		}
	])
	angular.module('myApp.listingPlaces').controller('listPlacesCtrl', ['$rootScope','$scope', '$location', '$http','$localStorage','$route','CONFIG',
	function($rootScope,$scope,$location,$http,$localStorage,$route,CONFIG) {
		$scope.updatePeeps = function(id,label){
			if (label=='neg') {
				$scope.itinItems[id-1].person= $scope.itinItems[id-1].person-1;
			} else {
				$scope.itinItems[id-1].person= $scope.itinItems[id-1].person+1;
			}
		};
		
		$scope.applyFilter = function(){
			var url = $scope.base_url+'/api/v1/places?city_id='+$scope.url_id;
			if ($scope.lteKm&&$scope.lteKm!=NaN) {
				url=url+'&dfc_lte='+$scope.lteKm;
			}
			
			if ($scope.gteKm&&$scope.gteKm!=NaN) {
				url=url+'&dfc_gte='+$scope.gteKm;
			}
			
			if ($scope.lteRat&&$scope.lteRat!=NaN) {
				url=url+'&rating_lte='+$scope.lteRat;
			}
			if ($scope.gteRat&&$scope.gteRat!=NaN) {
				url=url+'&rating_gte='+$scope.gteRat;
			}
			if ($scope.recoTrue) {
				url=url+'&recommend=True';
			}
			$http({
				method: 'GET', url: url,
			}).then(function successCallback(response) {
				console.log(response);
				$scope.placesList = response.data.results;
			}, function errorCallback(response) {
				console.log(response);
			});
		};

		$scope.getPlaces = function(){
			var url;
			if ($scope.url_id == 'featured') {
				url = $scope.base_url+'/api/v1/places?recommend=True&city_id=ecedacaf-e816-4d1d-86e8-6b50f6603899';
			} else{
				url = $scope.base_url+'/api/v1/places?city_id='+$scope.url_id;
			}
			
			$http({
				method: 'GET', url: url,
			}).then(function successCallback(response) {
				console.log(response);
				$scope.placesList = response.data.results;
			}, function errorCallback(response) {
				console.log(response);
			});
		};

		$scope.getCityDetails = function(label){
			var url = $scope.base_url+'/api/v1/cities/'+$scope.url_id+'/';
			$http({
				method: 'GET',
				url: url,
			}).then(function successCallback(response) {
				console.log(response);
				$scope.cityinfo = response.data;
			}, function errorCallback(response) {
				console.log(response);
			});
		};

		$scope.getCities = function(){
			$http({
				method: 'GET', url: $scope.base_url+'/api/v1/cities?recommend=True',
			}).then(function successCallback(response) {
				$scope.cities=response.data.results;
				for (var i = 0; i< $scope.cities.length; i++) {
					if($scope.cities[i].id==$scope.url_id){
						$scope.model=$scope.cities[i].id;
					} else{
						// $scope.cities.push({'id':$scope.url_id});
						$scope.model=$scope.url_id;
					};
				}
			}, function errorCallback(response) {
				console.log(response);
			});
		};

		$scope.dropdownCity = function(id){
			var url='/listPlaces?city='+id;
			window.location.href=url;
		};

		$scope.refreshToken = function(cb){
			var thisToken = $localStorage['user']['token'];
			var token = {'token': thisToken};
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

		$scope.addToCart = function(id){
			if ($rootScope.userLoggedIn) {
				var check_in = new Date().getTime();
				check_in=check_in + 86400000;
				check_in=new Date(check_in);
				var y = check_in.getFullYear();
				var m = check_in.getMonth()+1;
				var d = check_in.getDate();
				check_in = y+'-'+m+'-'+d;
				var url = $scope.base_url+'/api/v1/cart/places/';
				var data1= {
					"place": id,
					"check_in": check_in,
					"pax": 1,
					"cart":$localStorage['user']['cart_id']
				}
				$http({
					method: 'POST', url: url,
					headers: {
						'Content-Type': 'application/json',
						'authorization': 'JWT '+$localStorage['user']['token']
					},
					data: data1
				}).then(function successCallback(response) {
					$localStorage['cartIds'][id]=true;
					$rootScope.addRemoveMessage = 'Place Has Been added!';
					angular.element('.NotificationDiv').css('display', 'block');
					window.setTimeout(function(){
						angular.element('.NotificationDiv').css('display', 'none');
	            		$rootScope.$apply();
	        		},800);
					$rootScope.checkForExist(id,function(resp){
						if (resp) {		
							$scope.existInCart=true;
						}else {
							$scope.existInCart=false;
						}
					});
				}, function errorCallback(response) {
					if(response.data.place=='You can only add same city places in cart'){
						var label = 'Place Has Been added!';
						$rootScope.wantToChangeCityPopUp(url, data1, id, label);
						if($rootScope.is_cart_deleted){
							$localStorage['cartIds'][id]=true;
							$rootScope.is_cart_deleted = false;
						}
					}
				});
			} else {
				$localStorage['cartIds'][id]=true;
			}
		};

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
					var cartData = response.data;
					$rootScope.checkForExist($scope.url_id,function(resp){
						if (resp) {
							$scope.existInCart=true;
						}else {
							$scope.existInCart=false;
						}
					});
				}, function errorCallback(response) {
					console.log(response);
				});
			});
		};

		$scope.remFromCart = function(id){
			$scope.cartLoadin=true;
			$scope.refreshToken(function(resp){
				var cartItem= $localStorage['cart']['places'];
				for(var i=0;i<cartItem.length;i++){
					if(id==cartItem[i].place);
					var placeToDel=cartItem[i].id;
				}
				
				$http({
					method: 'DELETE',
					url: $scope.base_url+'/api/v1/cart/places/'+placeToDel + '/',
					headers: {
						'Content-Type': 'application/json',
						'authorization': 'JWT '+$localStorage['user']['token']
					},
				}).then(function successCallback(response) {
					$scope.cartLoadin=false;
					$scope.addedToCart=false;
					delete $localStorage['cart']['places'][cartItem.place];
					delete $localStorage['cartIds'][id];
					$scope.getCart();
					$rootScope.addRemoveMessage = 'Place Has Been removed!';
					angular.element('.NotificationDiv').addClass('RemoveItem');
					angular.element('.NotificationDiv').css('display', 'block');
	        		window.setTimeout(function(){
	            		angular.element('.NotificationDiv').css('display', 'none');
	            		angular.element('.NotificationDiv').removeClass('RemoveItem');
	            		$rootScope.$apply();
	        		},800);
				}, function errorCallback(response) {
					console.log(response);
				});
			});
		};

		$scope.addToCartLocal = function(id,place){
			$localStorage.cartIds[id]=true;
			$localStorage.cart.places.push(place);
			$rootScope.checkForExist('id',function(resp){});
		};

		$scope.remFromCartLocal = function(id,place){
			delete $localStorage.cartIds[id];
			for(var i=0; i<$localStorage.cart['places'].length; i++){
				if ($localStorage.cart['places'][i]['id']==id) {
					$localStorage.cart['places'].splice(i,1);
				}
			}
			$rootScope.checkForExist(id,function(resp){});
		}

		$scope.changeDate = function(argument) {
			// $scope.dateItin={};
			// $scope.dateItin.dateItinT= new Date($localStorage['date']);
			$localStorage['date']=$scope.dateItin.dateItinT;
		}

		function init(){
			angular.element('.profileDropdownCont').css('display','none');
			$scope.base_url=CONFIG.base_url;
			$scope.disableBtn={};
			
			if($rootScope.userLoggedIn && !$localStorage['cart']){
				$localStorage['cart']={};
			}else if($rootScope.userLoggedIn && !$localStorage['cart']['place']){
				$localStorage['cart']['place']={};
			}else if($rootScope.userLoggedIn && $localStorage['cart'] && $localStorage['cart']['place']){
				for(var key in $localStorage['cart']['place']){
					$scope.disableBtn[key]=true;
				}
			}else if (!$rootScope.userLoggedIn) {
				$rootScope.checkForExist('emp',function (resp) {
				});
			};
			$scope.minDate = new Date();
			$scope.url = $location.absUrl().split('?')[1];
			if ($scope.url!=undefined) {
				//console.log();
				$scope.url_id = $scope.url.split('=')[1];
				$scope.getCityDetails($scope.url_id);
				//console.log($scope.url_id);
			}else {
				$scope.url_id='featured';
			}
			$scope.cartIds = $localStorage['cartIds'];
			$scope.getPlaces();
			$scope.getCities();
		};
		init();
	}]);
})();