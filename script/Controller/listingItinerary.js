(function() {
	'use strict';
	angular.module('myApp.listingItinerary', ['ngRoute','app.configEnv'])

	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/listItinerary', {
				templateUrl: '/views/listItinerary.html',
				controller: 'listItineraryCtrl'
			});
			
		}
	])
  angular.module('myApp.listingItinerary').controller('listItineraryCtrl', ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG',
  function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
	$scope.remFromCartActivities=function(act){
		  delete $localStorage['cartIds'][act.id];
			for(var i=0;i<$localStorage['cart']['activities'].length;i++){
			  if(act.id==$localStorage['cart']['activities'][i].id){
				  $localStorage.cart['activities'].splice(i,1);
			  }
			}
			$rootScope.checkForExist('num',function(resp){});
		}
		$scope.remFromCartPlaces=function(act){
		  delete $localStorage['cartIds'][act.id];
			for(var i=0;i<$localStorage['cart']['places'].length;i++){
			  if(act.id==$localStorage['cart']['places'][i].id){
				  $localStorage.cart['places'].splice(i,1);
			  }
			}
			$rootScope.checkForExist('num',function(resp){});
		}
		$scope.remFromCartCabs=function(act){
		  delete $localStorage['cartIds'][act.id];
			for(var i=0;i<$localStorage['cart']['cars'].length;i++){
			  if(act.id==$localStorage['cart']['cars'][i].id){
				  $localStorage.cart['cars'].splice(i,1);
			  }
			}
			$rootScope.checkForExist('num',function(resp){});
		}
		$scope.remFromCartBikes=function(act){
		  delete $localStorage['cartIds'][act.id];
			for(var i=0;i<$localStorage['cart']['bikes'].length;i++){
			  if(act.id==$localStorage['cart']['bikes'][i].id){
				  $localStorage.cart['bikes'].splice(i,1);
			  }
			}
			$rootScope.checkForExist('num',function(resp){});
		}
		$scope.submitCart = function(){
		  var data ={
			"activities": $scope.activityCart,
			"places": $scope.placeCart,
			"bikes": [],
			"cars": $scope.cabCart,
			"name": $scope.formData.userName,
			"email": $scope.formData.userEmail,
			"mobile": $scope.formData.userPh,
			"px": $scope.formData.userNum,
			"message": $scope.formData.userComment
		  };
		  //console.log(data);
		  $http({
			method: 'POST',
			url: $scope.base_url+'/api/v1/activity-enquiries/',
			headers: {
			  'Content-Type': 'application/json'
			},
			data: data
		  }).then(function successCallback(response) {
			//console.log(response);
			$scope.responseReceived=true;
		  }, function errorCallback(response) {

		  });
		};
		$scope.updatePeeps = function(id,label){
		  if (label=='neg') {
		  $scope.itinItems[id-1].person= $scope.itinItems[id-1].person-1;
		  }else {
		  $scope.itinItems[id-1].person= $scope.itinItems[id-1].person+1;
		  }
		};
		$scope.switch = function(cb){
		  
		  var data1 ={};
		  var date = new Date($localStorage['date']);
		  date = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()
		  console.log(date);
		  data1.booked_date=date;
		  data1.cart=$scope.cartData.id;

		  $scope.refreshToken(function(resp){
			$http({
			  method: 'POST',
			  url: $scope.base_url+'/api/v1/orders/',
			  headers: {
				'Content-Type': 'application/json',
				'authorization': 'JWT '+$localStorage['user']['token']
			  },
			  data: data1
			}).then(function successCallback(response) {
			  $localStorage['order']=response;
			  $scope.order = response;
			  //$localStorage['cart']={};
			  //delete $localStorage['cart'];
			  //$window.location.href = '/checkout';
			  cb();
			}, function errorCallback(response) {

			  console.log(response);
			});
		  });

		}
		
		$scope.submit = function(label){
		  var date = new Date($localStorage[date]);
		  $scope.switch(function(){
			if (label=='cod') {
				var data1 ={};
				data1.booked_date=date;
				data1.order=$scope.order.data.id;
				data1.amount=$scope.order.data.total;
				data1.payment_method="cod";
				$scope.refreshToken(function(resp){
					$http({
						method: 'POST',
						url: $scope.base_url+'/api/v1/cod/',
						headers: {
							'Content-Type': 'application/json',
							'authorization': 'JWT '+$localStorage['user']['token']
						},
						data: data1
					}).then(function successCallback(response) {
						$localStorage['order']=response;
						$localStorage['cart']={};
						delete $localStorage['cart'];
						$window.location.href = '/thank';
					}, function errorCallback(response) {

						console.log(response);
					});
				});
			}else if (label=='paytm') {
			  var data1 ={};
			  data1.booked_date=date;
			  data1.order=$scope.order.data.id;
			  data1.amount=$scope.order.data.total;
			  data1.payment_method="paytm";
			  //console.log(data1);
			  $scope.refreshToken(function(resp){
				  $http({
					  method: 'POST',
					  url: $scope.base_url+'/api/v1/paytm/',
					  headers: {
						  'Content-Type': 'application/json',
						  'authorization': 'JWT '+$localStorage['user']['token']
					  },
					  data: data1
				  }).then(function successCallback(response) {
					  $localStorage['orderInit']=response;
					  $('#CALLBACK_URL').val(response.data.request_data.CALLBACK_URL);
							$('#CHANNEL_ID').val(response.data.request_data.CHANNEL_ID);
							$('#MID').val(response.data.request_data.MID);
							$('#CUST_ID').val(response.data.request_data.CUST_ID);
							$('#EMAIL').val(response.data.request_data.EMAIL);
							$('#MOBILE_NO').val(response.data.request_data.MOBILE_NO);
							$('#TXN_AMOUNT').val(response.data.request_data.TXN_AMOUNT);
							$('#CHECKSUMHASH').val(response.data.request_data.CHECKSUMHASH);
							$('#WEBSITE').val(response.data.request_data.WEBSITE);
							$('#INDUSTRY_TYPE_ID').val(response.data.request_data.INDUSTRY_TYPE_ID);
							$('#ORDER_ID').val(response.data.request_data.ORDER_ID);
							$localStorage['orderInitSend']=response.data.request_data.CUST_ID;
							$('#paytm-form').submit();
				  }, function errorCallback(response) {

					  console.log(response);
				  });
			  });
			}else if (label=='rzrpay') {
			  var data1 ={};
			  data1.booked_date=date;
			  data1.order=$scope.order.data.id;
			  data1.amount=$scope.order.data.total;
			  data1.payment_method="razor";
			  //console.log(data1);
			  $scope.refreshToken(function(resp){
				  $http({
					  method: 'POST',
					  url: $scope.base_url+'/api/v1/razor-pay/',
					  headers: {
						  'Content-Type': 'application/json',
						  'authorization': 'JWT '+$localStorage['user']['token']
					  },
					  data: data1
				  }).then(function successCallback(response) {
					  $localStorage['orderInit']=response.data;

					  var options = {
						  "key": CONFIG.razorpayId,
						  "amount": response.data.request_data.razor_order.amount,
						  "name": response.data.request_data.name,
						  "description": "ETTTXTTXTXT",
						  'order_id': response.data.request_data.razor_order.id,
						  'callback_url': response.data.request_data.razor_order.callback_url,
						  "prefill": {
							"name": response.data.request_data.cust_name,
							"email": response.data.request_data.cust_email,
							"contact": response.data.request_data.cust_mobile,
						  },
						  "notes": {
							"txn_id": response.data.id
						  },
						  "theme": {
							"color": "#F37254"
						  }
						};
					  //console.log(response);
					  var rzp1 = new Razorpay(options);
					  //console.log(rzp1);
						
						rzp1.open();
				  }, function errorCallback(response) {

					  console.log(response);
				  });
			  });
			}
		  })
			
		};
		$scope.addToCart = function(){
		  $scope.cartLoadin=true;
		  $scope.refreshToken(function(resp){
		  
			if($scope.activityData.pricing_unit=='pax'){
			  var data1={
			  'quantity':1,
			  'pax_adult':$scope.person,
			  'pax_child':$scope.child,
			  'activity':$scope.activityData.id,
			  };  
			}else{
			  var data1={
			  'quantity':1,
			  };  
			}
			
			$http({
			  method: 'POST',
			  url: $scope.base_url+'/api/v1/cart/activities/',
			  headers: {
				'Content-Type': 'application/json',
				'authorization': 'JWT '+$localStorage['user']['token']
			  },
			  data: data1
			}).then(function successCallback(response) {
			  $scope.cartLoadin=false;
			  $scope.addedToCart=true;
			  if ($localStorage['cart'] && $localStorage['cart']['activity']) {
				$localStorage['cart']['activity'][response.data['activity']]=response.data; 
			  }else if ($localStorage['cart'] && !$localStorage['cart']['activity']){
				$localStorage['cart']['activity']={};
				$localStorage['cart']['activity'][response.data['activity']]=response.data; 
			  }else {
				$localStorage['cart']={};
				$localStorage['cart']['activity']={};
				$localStorage['cart']['activity'][response.data['activity']]=response.data;
			  }
			  
			}, function errorCallback(response) {
				
				console.log(response)
				
			});
		  });
		  
		}
		$scope.sumActivities = function(){
		  
		  var total = 0;
		  angular.forEach($scope.cartData.activities, function(key, value) {
			total += parseFloat(key.total_amount);
		  })
		  return total;
		
		}

		$scope.sumPlaces = function(){
		  var total = 0;
		  angular.forEach($scope.cartData.places, function(key, value) {
			total += parseFloat(key.total_amount);
		  })
		  return total;
		}

			$scope.getCityDetails = function(label){
	      		var url = $scope.base_url+'/api/v1/cities/'+$scope.url_id+'/';
	      		$http({
	        		method: 'GET',
	        		url: url,
	      			}).then(function successCallback(response) {
	       			$scope.cityinfo = response.data;
	             }, function errorCallback(response) {
	            console.log(response);
	          });
	        };

		$scope.sumTransport = function(){
		  var total = 0;
		  var total1=0,total2=0,total3=0;
		  angular.forEach($scope.cartData.bikes, function(key, value) {
			total1 += parseFloat(key.total_amount);
			
		  });
		  angular.forEach($scope.cartData.cabs, function(key, value) {
			  total2 += parseFloat(key.total_amount);
			 
		  });
		  angular.forEach($scope.cartData.cars, function(key, value) {
			  total3 += parseFloat(key.total_amount);
			 
		  });

		  total= parseFloat(total1+total2+total3);
		  return total;
		
		}
		$scope.getPlaceDetail = function(id,place){
		 
		  $http({
			method: 'GET',
			url: $scope.base_url+'/api/v1/places/'+id,
		  }).then(function successCallback(response) {
			
			var joinedDesc = "";
			for (var i = 0;i<response.data.long_desc_tokenized.length; i++) {
			  joinedDesc = joinedDesc + response.data.long_desc_tokenized[i];
			};
			response.data.joinedDesc=joinedDesc;
			response.data.cartDetails=place
			$scope.placeData.push(response.data);
			
		  }, function errorCallback(response) {
			console.log(response);
		  });
		};

		$scope.getActivityDetail = function(id,activity){
		  $http({
			method: 'GET',
			url: $scope.base_url+'/api/v1/activities/'+id,
		  }).then(function successCallback(response) {
		  
			response.data.cartDetails=activity
				$scope.activityData.push(response.data);
				console.log($scope.activityData);

		  }, function errorCallback(response) {
			console.log(response);
		  });
		};

		$scope.getCars = function(id,car){
		  var url = $scope.base_url+'/api/v1/cars/'+id;
		  
		  $http({
			method: 'GET',
			url: url,
		  }).then(function successCallback(response) {
		
			response.data.cartDetails=car
				$scope.carData.push(response.data);
				console.log($scope.carData);
		  }, function errorCallback(response) {
			console.log(response);
		  });
		}

		$scope.getBikes = function(id,bike){
		  var url;
			url = $scope.base_url+'/api/v1/bikes/'+id;
		  $http({
			method: 'GET',
			url: url,
		  }).then(function successCallback(response) {
			  
			  response.data.cartDetails=bike
				$scope.bikeData.push(response.data);
				console.log($scope.bikeData);
		  
		  }, function errorCallback(response) {
			console.log(response);
		  });
		}

		$scope.getCities = function(){
		  $http({
			method: 'GET',
			url: $scope.base_url+'/api/v1/cities?recommend=True',
		  }).then(function successCallback(response) {
			$scope.cities=response.data.results;
			for (var i = 0; i< $scope.cities.length; i++) {
			  if($scope.cities[i].id==$scope.url_id){
				$scope.model=$scope.cities[i].id;
			  }else{
				// $scope.cities.push({'id':$scope.url_id});
				$scope.model=$scope.url_id;
			  };

			}
			
		
		  }, function errorCallback(response) {
			console.log(response);
		  });
		};

		$scope.cartdropdownCity = function(id){
		  if(id!=null){
			var url='/listPlaces?city='+id;
		  window.location.href=url;
		  }
		  
		};

		$scope.getCart = function(){

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
			  $rootScope.checkForExist('none',function(){});
			  $localStorage['cart']=response.data;
			  //console.log($scope.cartData);
			  $scope.placeData=[];
			  for (var i = 0; i<$scope.cartData.places.length; i++) {
				$scope.getPlaceDetail($scope.cartData.places[i]['place'],$scope.cartData.places[i]);
			  }
			  $scope.activityData=[];
			  for (var i = 0; i<$scope.cartData.activities.length; i++) {
				$scope.getActivityDetail($scope.cartData.activities[i]['activity'],$scope.cartData.activities[i]);
			  }
			  $scope.carData=[];
			  for (var i = 0; i<$scope.cartData.cars.length; i++) {
				$scope.getCars($scope.cartData.cars[i]['car'],$scope.cartData.cars[i]);
			  }
			  $scope.bikeData=[];
			  for (var i = 0; i<$scope.cartData.bikes.length; i++) {
				$scope.getBikes($scope.cartData.bikes[i]['bike'],$scope.cartData.bikes[i]);
			  }
			  if ($scope.cartData && $scope.cartData.activities.length>0) {
				$scope.sumActivities(); 
			  }
			  if ($scope.cartData && $scope.cartData.places.length>0) {
				$scope.sumPlaces();
			  }
			  if ($scope.cartData && ($scope.cartData.bikes.length>0 || $scope.cartData.cars.length>0)) {
				$scope.sumTransport();
			  }
			  
			  
			  
			  


			}, function errorCallback(response) {

			  console.log(response);
			});
		  });
		}
		$scope.remFromCart = function(label,cartItem){
		  var delId;
		  delId=cartItem.cartDetails.id;

		  $scope.refreshToken(function(resp){

			$http({
			  method: 'DELETE',
			  url: $scope.base_url+'/api/v1/cart/'+label+'/'+delId + '/',
			  headers: {
				'Content-Type': 'application/json',
				'authorization': 'JWT '+$localStorage['user']['token']
			  },
			}).then(function successCallback(response) {
			  delete $localStorage['cart'];
			  delete $localStorage['cartIds'][cartItem.id];
			  $scope.getCart();
			}, function errorCallback(response) {

			  console.log(response);
			});
		  });
		}
		$scope.changeTaby = function(label){
		  if (label=='pay') {
			$scope.changeTab='pay';
		  }else if (label=='info') {
			$scope.changeTab='info';
		  }else{
			$scope.changeTab='details';
		  }
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

		$scope.login =function(label){
		  if (label=='pay') {}
		  var data1={};
		  
		  data1['email']=$scope.userName;
		  data1['password']=$scope.password;
		  $http({
			  method: 'POST',
			  url: base_url+'/api/v1/accounts/login/',
			  headers: {
			  'Content-Type': 'application/json'
			  },
			  data: data1
		  }).then(function successCallback(response) {

			  if (response) {
				  $scope.loading=true;
				  var expToken = response.data.token;
				  var tokenPayload = jwtHelper.decodeToken(expToken);

				  $localStorage.user={};
				  $localStorage.user=tokenPayload;
				  $localStorage.user.token=response.data.token;
				  $rootScope.userLoggedIn=true;
				  
				  if($localStorage.user['role']=='vendor'){
					  $http({
						  method: 'GET',
						  url: base_url+'/api/v1/vendors/',
						  headers: {
						  'Content-Type': 'application/json',
						  'authorization': 'JWT '+$localStorage['user']['token']
						  },
					  }).then(function successCallback(response) {
						  $localStorage['user']['vendorInfo']=response.data.results[0];
						  $localStorage['user']['vendor_id']=response.data.results[0]['id'];
					  }, function errorCallback(response) {
						  console.log(response);
					  });
				  }else { 

					
					  // $http({
					  //     method: 'GET',
					  //     url:$scope.base_url+'/api/v1/cart/',
					  //     headers: {
					  //         'Content-Type': 'application/json',
					  //         'authorization': 'JWT '+$localStorage['user']['token']
					  //     },
					  // }).then(function successCallback(response) {
					  //     //$localStorage['cart']=response.data;
					  //     console.log(response);
					  // }, function errorCallback(response) {

					  //     console.log(response);
					  // });

					  
				  }
				  setTimeout(function() {
					$uibModalInstance.dismiss();  
				}, 2000);
				  
			  }
		  }, function errorCallback(response) {
			  //console.log('ERROR'+JSON.stringify(response));
			  $scope.errorMsgs=response.data.non_field_errors;
		  });
		}
		$scope.changeDate = function(){
		  $localStorage['date'] = $scope.dateItin;
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
		function init(){
			$scope.url = $location.absUrl().split('?')[1];
			if ($scope.url!=undefined) {
				$scope.url_id = $scope.url.split('=')[1];
				$scope.getCityDetails($scope.url_id);
			} else {
				$scope.url_id='featured';
			}
			angular.element('.profileDropdownCont').css('display','none');
			$scope.base_url=CONFIG.base_url;
			if($rootScope.userLoggedIn){$scope.user=$localStorage['user'];}
			$scope.order = $localStorage['order'];
			if($rootScope.userLoggedIn){$scope.user.phone=parseInt($scope.user.phone)};
			$scope.changeTab='info';
			if($rootScope.userLoggedIn && $scope.cartData){
				$scope.cartDataLength = $scope.cartData.activities.length+$scope.cartData.places.length+$scope.cartData.bikes.length+$scope.cartData.cars.length;
			} else if (!$rootScope.userLoggedIn) {
				$scope.cartData = $localStorage['cart'];
				$scope.activityData=$scope.cartData.activities;
				$scope.placeData=$scope.cartData.places;
				$scope.carData=$scope.cartData.cars;
				$scope.bikeData=$scope.cartData.bikes;
				$scope.cartDataLength = $scope.cartData.activities.length+$scope.cartData.places.length+$scope.cartData.bikes.length+$scope.cartData.cars.length;
			}
			$scope.dateItin = new Date($localStorage['date']);
			$scope.person=1;
			$scope.child=0;
			if ($rootScope.userLoggedIn) {
				$scope.activityData=[];
				$scope.placeData=[];
				$scope.carData=[];
				$scope.bikeData=[]; 
			}
			if ($rootScope.userLoggedIn) {
				$scope.getCart(); 
			}
			$scope.getCityDetails();
			$scope.getCities();
			$scope.cartCity = $localStorage['cart']['city'];
			
		};
		init();
	}]);
})();