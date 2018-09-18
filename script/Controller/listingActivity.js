(function() {
		'use strict';
		angular.module('myApp.listingActivity', ['ngRoute','app.configEnv'])

		.config(['$routeProvider',
			function($routeProvider) {
				$routeProvider.when('/listActivity', {
					templateUrl: '/views/listActivity.html',
					controller: 'listActivityCtrl'
				});
					
			}
		])
	angular.module('myApp.listingActivity').controller('listActivityCtrl', ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG', 
	function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
		
		$scope.updatePeeps = function(id,label){
			if (label=='neg') {
				$scope.itinItems[id-1].person= $scope.itinItems[id-1].person-1;
			}else {
				$scope.itinItems[id-1].person= $scope.itinItems[id-1].person+1;
			}
		};
		$scope.applyFilter = function(){
			var url = $scope.base_url+'/api/v1/activities?city_id='+$scope.url_id;
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
				method: 'GET',
				url: url,
			}).then(function successCallback(response) {
				$scope.activityList = response.data.results;
				$scope.actByCat=[];
				$scope.actByCatMap={};
				$scope.actByVen=[];
				$scope.actByVenMap={};
				if ($scope.activityList.length>0) {
					for(var i=0; i<$scope.activityList.length; i++){
						var thisAct = $scope.activityList[i];
						var compAct = thisAct.category;
						if ($scope.actByCatMap[compAct]>-1) {
							var index = $scope.actByCatMap[compAct];
							($scope.actByCat[index]).push(thisAct);
						}else {
							var index= $scope.actByCat.length;
							$scope.actByCat[index]=[];
							($scope.actByCat[0]).push(thisAct);
							$scope.actByCatMap[compAct]=index;
						}
						var venAct=thisAct.vendor;
						if ($scope.actByVenMap[venAct]>-1) {
							var index = $scope.actByVenMap[venAct];
							($scope.actByVen[index]).push(thisAct);
						}else {
							var index= $scope.actByVen.length;
							$scope.actByVen[index]=[];
							($scope.actByVen[0]).push(thisAct);
							$scope.actByVenMap[venAct]=index;
						}
					}
				
				}
			}, function errorCallback(response) {
				console.log(response);
			});
		};
		$scope.addToCart = function(data){
			// if($localStorage['cart']['activity']){
			// 	$localStorage['cart']['activity'][data.id]=data;
			// }else{
			// 	$localStorage['cart']['activity']={};
			// 	$localStorage['cart']['activity'][data.id]=data;
			// };
			// $scope.disableBtn[data.id]=true;
		};
		$scope.getActivitiesData = function(){
			var url;
			if ($scope.url_id == 'featured') {
				url = $scope.base_url+'/api/v1/activities?recommend=True';
			}else{
				url = $scope.base_url+'/api/v1/activities?city_id='+$scope.url_id;
			}
			$http({
				method: 'GET',
				url: url,
			}).then(function successCallback(response) {
				$scope.activityList = response.data.results;
				console.log(response.data);
				$scope.actByCat=[];
				$scope.actByCatMap={};
				$scope.actByVen=[];
				$scope.actByVenMap={};
				if ($scope.activityList.length>0) {
					for(var i=0; i<$scope.activityList.length; i++){
						var thisAct = $scope.activityList[i];
						var compAct = thisAct.category;
						if ($scope.actByCatMap[compAct]>-1) {
							var index = $scope.actByCatMap[compAct];
							($scope.actByCat[index]).push(thisAct);
						}else {
							var index= $scope.actByCat.length;
							$scope.actByCat[index]=[];
							($scope.actByCat[0]).push(thisAct);
							$scope.actByCatMap[compAct]=index;
						}
						var venAct=thisAct.vendor;
						if ($scope.actByVenMap[venAct]>-1) {
							var index = $scope.actByVenMap[venAct];
							($scope.actByVen[index]).push(thisAct);
						}else {
							var index= $scope.actByVen.length;
							$scope.actByVen[index]=[];
							($scope.actByVen[0]).push(thisAct);
							$scope.actByVenMap[venAct]=index;
						}
					}
				//console.log($scope.actByCatMap);
				}
			}, function errorCallback(response) {
				console.log(response);
			});
		}
		$scope.getCategory = function(){
			var url = $scope.base_url+'/api/v1/activity-categories?city_id='+$scope.url_id;
			
			$http({
				method: 'GET',
				url: url,
			}).then(function successCallback(response) {
				//console.log(response);
				var categoryList = response.data.results;
				$scope.categoryMap={};
				$scope.categoryMapData={};
				for (var i = 0; i< categoryList.length; i++) {
					var thisCat = categoryList[i];
					$scope.categoryMap[thisCat.id] = thisCat.name;
					$scope.categoryMapData[thisCat.id]=thisCat;
				}
				// console.log(JSON.stringify($scope.categoryMapData));

			}, function errorCallback(response) {
				console.log(response);
			});
		}
		$scope.activateCat = function (label){

			if (label=='all') {
				$scope.openActList=true;
				$scope.selActCatName='All category';
				$scope.activityListSel=$scope.activityList;
				$scope.activitySelectedData={};
			}else if(label=='none'){
				$scope.openActList=false;
				$scope.selActCatName='';
				$scope.activityListSel=[];
				$scope.activitySelectedData={};
			}else{
				$scope.openActList=true;
				var index = $scope.actByCatMap[label];
				$scope.selActCatName=$scope.categoryMap[label];
				$scope.activityListSel=$scope.actByCat[index];
				$scope.activitySelectedData=$scope.categoryMapData[label];
				
			}
		}
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
	    $scope.addToCartLocal = function(id,place){
	    	$localStorage.cartIds[id]=true;
	    	$localStorage.cart.activities.push(place);
	    }
	    $scope.remFromCartLocal = function(id,place){
	    	delete $localStorage.cartIds[id];
	    	for(var i=0; i<$localStorage.cart['activities'].length; i++){
	    		if ($localStorage.cart['activities'][i]['id']==id) {
	    			$localStorage.cart['activities'].splice(i,1);
	    		}
	    	}
	    	$rootScope.checkForExist(id,function(resp){

	    	})
	    }
		function init(){
			angular.element('.profileDropdownCont').css('display','none');
			$scope.disableBtn={};
			//$localStorage['cart']={};
			$scope.base_url=CONFIG.base_url;
			if($rootScope.userLoggedIn && !$localStorage['cart']){
				$localStorage['cart']={};
			}else if($rootScope.userLoggedIn && !$localStorage['cart']['activity']){
				$localStorage['cart']['activity']={};
			}else if($rootScope.userLoggedIn && $localStorage['cart'] && $localStorage['cart']['activity']){
				for(var key in $localStorage['cart']['activity']){
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
	
			$scope.cartIds = $localStorage['cartIds'];
			$scope.itinItems = [{id:1,person:1},{id:2,person:2},{id:3,person:3},{id:4,person:4},{id:5,person:5}];
			$scope.persons = 4;
			$scope.getCategory();
			$scope.getActivitiesData();
	
		};
		init();
	}]);


})();