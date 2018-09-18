
(function() {
    'use strict';
    angular.module('myApp.detail', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/details', {
                templateUrl: '/views/details.html',
                controller: 'detailCtrl'
            });
            
        }
    ])
  angular.module('myApp.detail').controller('detailCtrl', ['$rootScope','$scope', '$location', '$http', 'CONFIG','$localStorage','$route',
  function($rootScope,$scope,$location,$http,CONFIG,$localStorage,$route) {
    $scope.openED=function(){$scope.popup2.opened=true;};
    $scope.openSD=function(){$scope.popup1.opened=true;};
    $scope.getRelatedPlaces = function(label){
      $http({
        method: 'GET',
        url: $scope.base_url+'/api/v1/places?city_id='+label,
      }).then(function successCallback(response) {
        $scope.relatedPlaces = response.data.results;
        $scope.relatedPlaces = $scope.relatedPlaces.splice(0,5);
        console.log($scope.relatedPlaces);
      }, function errorCallback(response) {
        console.log(response);
      });
    };
    $scope.getCityDetails = function(label){
      var url = $scope.base_url+'/api/v1/cities/'+label+'/';
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
    $scope.getPlaceDetail = function(){
      var url = $location.absUrl().split('?')[1];
      $scope.url_id = url.split('=')[1];
      // console.log($scope.url_id);
      $http({
        method: 'GET',
        url: $scope.base_url+'/api/v1/places/'+$scope.url_id,
      }).then(function successCallback(response) {
        $scope.placeData = response.data;
        if($scope.userLoggedIn && $scope.cartIds[$scope.url_id]){
          $scope.addButtonText = 'Remove this Place';
        }
        $rootScope.checkForExist(response.data.id,function(resp){
          if (resp) {
            $scope.existInCart=true;
          }else {
            $scope.existInCart=false;
          }
          $scope.loading=false;
        });
        $scope.joinedDesc = "";
        for (var i = 0;i<$scope.placeData.long_desc_tokenized.length; i++) {
          $scope.joinedDesc = $scope.joinedDesc + $scope.placeData.long_desc_tokenized[i];
        };
        $scope.getRelatedPlaces($scope.placeData.city);
        $scope.getCityDetails($scope.placeData.city);
      }, function errorCallback(response) {
        console.log(response);
      });
    };

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

    $scope.addToCart = function(){
      if(!$localStorage['cartIds'][$scope.url_id]){
        $scope.loading=true;
        var check_in = new Date().getTime();
        check_in=check_in+86400000;
        check_in=new Date(check_in);
        var y = check_in.getFullYear();
        var m = check_in.getMonth()+1;
        var d = check_in.getDate();
        check_in = y+'-'+m+'-'+d;
        var data1= {
          "cart":$localStorage['cart']['id'],
          "place": $scope.url_id,
          "check_in": check_in,
          "pax": 1
        }
        var url = $scope.base_url+'/api/v1/cart/places/';
      
          $http({
            method: 'POST',
            url: url,
            headers: {
              'Content-Type': 'application/json',
              'authorization': 'JWT '+$localStorage['user']['token']
            },
            data: data1
          }).then(function successCallback(response) {
            // $scope.getCart();
            $localStorage['cartIds'][$scope.url_id]=true;
            $rootScope.checkForExist($scope.url_id,function(resp){
              if (resp) {
                $scope.existInCart=true;
              }else {
                $scope.existInCart=false;
              }
              $scope.loading=false;
            });
            $rootScope.addRemoveMessage = 'Place Has Been added!';
            $scope.addButtonText = 'Remove this Place';
            angular.element('.NotificationDiv').css('display', 'block');
            window.setTimeout(function(){
                angular.element('.NotificationDiv').css('display', 'none');
                $rootScope.$apply();
            },800);
          }, function errorCallback(response) {
            if(response.data.place=='You can only add same city places in cart'){
              var label = 'Place Has Been added!';
              $rootScope.wantToChangeCityPopUp(url, data1, $scope.url_id, label);
              if($rootScope.is_cart_deleted){
                $localStorage['cartIds'][$scope.url_id]=true;
                $scope.addButtonText = 'Remove This Place';
                $rootScope.is_cart_deleted = false;
              }
            }
          });
        }
      else{
          alert('The Place already in Cart');
          $scope.addButtonText = 'Remove This Place';
        }  
    }

      $scope.addToCartLocal = function(place){
          $localStorage['cartIds'][place.id]=true;
          if($localStorage['cart'] && $localStorage['cart']['places']){
          $localStorage['cart']['places'].push(place);
        }
        $rootScope.checkForExist('id',function(resp){});
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
    }

    $scope.remFromCartLocal = function(place){
      delete $localStorage['cartIds'][place.id];
      
      for(var i=0; i<$localStorage['cart']['places'].length; i++){
        if ($localStorage['cart']['places'][i]['id']==place.id) {
          $localStorage.cart['places'].splice(i,1);
        }
      }
      $rootScope.checkForExist('hhhh',function(resp){});
    }

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
          url: $scope.base_url+'/api/v1/cart/places/'+placeToDel +'/',
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'JWT '+$localStorage['user']['token']
          },
        }).then(function successCallback(response) {
          $scope.cartLoadin=false;
          $scope.addedToCart=false;
          delete $localStorage['cart']['places'][cartItem.place];
          delete $localStorage['cartIds'][$scope.url_id];
             // $route.reload();
          $scope.getCart();
          $scope.addButtonText = 'Add this Place';
          $rootScope.addRemoveMessage = 'Place Has Been removed!';
          angular.element('.NotificationDiv').addClass('RemoveItem');
          angular.element('.NotificationDiv').css('display', 'block');
            window.setTimeout(function(){
                angular.element('.NotificationDiv').removeClass('RemoveItem');
                angular.element('.NotificationDiv').css('display', 'none');
                $rootScope.$apply();
            },800);
        }, function errorCallback(response) {
          console.log(response);
          $scope.addButtonText = 'Remove This Place';
        });
      });
    }

    $scope.addRemoveCart = function () {
      if($scope.userLoggedIn && !$scope.cartIds[$scope.placeData.id]){
          $scope.addToCart();
      } else if($scope.userLoggedIn && $scope.cartIds[$scope.placeData.id]){
          $scope.remFromCart($scope.placeData.id)
      } else if(!$scope.userLoggedIn && !$scope.cartIds[$scope.placeData.id]) {
          $scope.openLoginModal('lg', [], $scope.base_url)
      } else if(!$scope.userLoggedIn && $scope.cartIds[$scope.placeData.id]){
          $scope.addButtonText = 'Add This Place';
          $scope.remFromCartLocal($scope.placeData);
      }
  };
    
    function init(){
      angular.element('.profileDropdownCont').css('display','none');
      $scope.loading=true;
      $scope.base_url=CONFIG.base_url;
      $scope.cartIds = $localStorage['cartIds'];
      $scope.popup2={};
      $scope.popup1={};
      $scope.addButtonText = 'Add This Place';

      $scope.getPlaceDetail();
      $scope.limit=700;
    };
    init();
  }]);


})();