(function() {
    'use strict';
    angular.module('myApp.activity', ['ngRoute','app.configEnv'])

        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.when('/activity', {
                    templateUrl: '/views/activity.html',
                    controller: 'activityCtrl'
                });

            }
        ])
    angular.module('myApp.activity').controller('activityCtrl',
        ['$rootScope','$scope', '$location', '$http', '$timeout','CONFIG','$localStorage','$route',
            function($rootScope,$scope,$location,$http,$timeout,CONFIG,$localStorage,$route) {
                $scope.addToCartLocal=function(activity){
                    $localStorage['cartIds'][activity.id]=true;
                    if ($localStorage['cart'] && $localStorage['cart']['activities']) {
                        $localStorage['cart']['activities'].push(activity);
                    }
                    $rootScope.checkForExist('num',function(resp){});
                }
                $scope.remFromCartLocal=function(activity){
                    delete $localStorage['cartIds'][activity.id];
                    for(var i=0;i<$localStorage['cart']['activities'].length;i++){
                        if(activity.id==$localStorage['cart']['activities'][i].id){
                            $localStorage.cart['activities'].splice(i,1);
                        }
                    }
                    $rootScope.checkForExist('num',function(resp){});
                }
                $scope.getRelatedActivity = function(label){
                    $http({
                        method: 'GET',
                        url: $scope.base_url+'/api/v1/activities?city_id='+label,
                    }).then(function successCallback(response) {
                        $scope.relatedActivity = response.data.results;
                        $scope.relatedActivity = $scope.relatedActivity.splice(0,3);
                    }, function errorCallback(response) {
                        console.log('Error: '+response);
                    });
                };
                $scope.getCityDetails = function(label){
                    var url = $scope.base_url+'/api/v1/cities/'+label+'/';
                    $http({
                        method: 'GET',
                        url: url,
                    }).then(function successCallback(response) {
                        $scope.cityinfo = response.data;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                };
                $scope.getActCatDetails = function(label){
                    var url = $scope.base_url+'/api/v1/activity-categories/'+label+'/';
                    $http({
                        method: 'GET',
                        url: url,
                    }).then(function successCallback(response) {
                        $scope.actCatInfo = response.data;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                };
                $scope.getActivityDetail = function(){
                    var url = $location.absUrl().split('?')[1];
                    $scope.url_id = url.split('=')[1];
                    $http({
                        method: 'GET',
                        url: $scope.base_url+'/api/v1/activities/'+$scope.url_id,
                    }).then(function successCallback(response) {
                        $scope.activityData = response.data;
                        $scope.getCart();
                        $rootScope.checkForExist($scope.url_id,function(resp){
                            if (resp) {
                                $scope.existInCart=true;
                            }else {
                                $scope.existInCart=false;
                            }
                            $scope.loading=false;
                        });
                        var id = $scope.activityData.id;
                        if($scope.userLoggedIn && $scope.cartIds[id]){
                            $scope.addButtonText = 'Remove this activity';
                        }
                        $scope.activityData.incList=[];
                        $scope.activityData.excList=[];
                        $scope.getCityDetails($scope.activityData.city);
                        $scope.getActCatDetails($scope.activityData.category);
                        $scope.getRelatedActivity($scope.activityData.city);
                        if ($scope.activityData.pricing_unit=='pax') {
                            $scope.basePriceOri = $scope.activityData.adult_price;
                            $scope.basePrice = $scope.activityData.adult_price;
                            $scope.basePriceOriAdlt=parseInt($scope.activityData.adult_price);
                            $scope.basePriceOriChild=parseInt($scope.activityData.child_price);
                        }else if($scope.activityData.pricing_unit=='item'){
                            $scope.basePriceOri = $scope.activityData.item_price;
                            $scope.basePrice = $scope.activityData.item_price;
                        }

                    }, function errorCallback(response) {
                        console.log(response);
                    });
                };
                $scope.updatePeeps = function(label,factor){
                    if (label=='adult') {
                        if (factor=='neg' && $scope.person>0) {
                            $scope.person=$scope.person-1;
                            $scope.basePrice = parseInt($scope.basePrice)-parseInt($scope.basePriceOriAdlt);
                        }else if(factor=='pos'){
                            $scope.person=$scope.person+1;
                            $scope.basePrice = parseInt($scope.basePrice)+parseInt($scope.basePriceOriAdlt);
                        }

                    }else {
                        if (factor=='neg' && $scope.child>0) {
                            $scope.child=$scope.child-1;
                            $scope.basePrice = parseInt($scope.basePrice)-parseInt($scope.basePriceOriChild);
                        }else if (factor=='pos'){
                            $scope.child=$scope.child+1;
                            $scope.basePrice = parseInt($scope.basePrice)+parseInt($scope.basePriceOriChild);
                        }
                    }
                };
                $scope.refreshToken = function(cb){
                    if($scope.userLoggedIn){
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
                    else{
                        // console.log('User Not Logged In');
                    }
                }

                $scope.addToCart = function(){
                    $scope.cartLoadin=true;
                    $scope.refreshToken(function(resp){
                        if(!$localStorage['cartIds'][$scope.url_id]){
                            if($scope.activityData.pricing_unit=='pax'){
                                var data1={
                                    'cart':$localStorage['user']['cart_id'],
                                    'pax_adult':$scope.person,
                                    'pax_child':$scope.child,
                                    'activity':$scope.activityData.id,
                                    'slot':$scope.activityData.slot
                                };
                            }else{
                                var data1={
                                    'quantity':1,
                                    'activity':$scope.activityData.id,
                                    'cart':$localStorage['user']['cart_id'],
                                    'slot':$scope.activityData.slot
                                };
                            }
                            var url = $scope.base_url+'/api/v1/cart/activities/';
                            $http({
                                method: 'POST', url: url,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'authorization': 'JWT '+$localStorage['user']['token']
                                },
                                data: data1
                            }).then(function successCallback(response) {
                                $localStorage['cartIds'][$scope.url_id]=true;
                                $scope.getCart();
                                $rootScope.checkForExist(response.data.id,function(resp){
                                    if(resp) {
                                        $scope.existInCart=true;
                                    }else {
                                        $scope.existInCart=false;
                                    }
                                    $scope.loading=false;
                                });
                                $rootScope.addRemoveMessage = 'Activity Has Been added!';
                                angular.element('.NotificationDiv').css('display', 'block');
                                window.setTimeout(function(){
                                    angular.element('.NotificationDiv').css('display', 'none');
                                    $rootScope.$apply();
                                },800);
                                $scope.addButtonText = 'Remove This Activity';
                            }, function errorCallback(response) {
                                console.log(response);
                                $scope.addButtonText = 'Add This Activity';
                                if(response.data.slot){
                                    $('#activity-slot').css('border-color', 'tomato');
                                }
                                if(response.data.city=='You can only add same city activity in cart'){
                                    var label = 'Activity Has Been added!';
                                    $rootScope.wantToChangeCityPopUp(url, data1, $scope.url_id, label);
                                    if($rootScope.is_cart_deleted){
                                        $localStorage['cartIds'][$scope.url_id]=true;
                                        $scope.addButtonText = 'Remove This Activity';
                                        $rootScope.is_cart_deleted = false;
                                    }
                                }
                            });
				
                        }else{
                            alert('The activity is already in cart');
                            $scope.addButtonText = 'Add This Activity';
                        }

                    });

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
                                $scope.loading=false;
                            });

                        }, function errorCallback(response) {

                            console.log(response);
                        });
                    });
                }
                $scope.remFromCart = function(id){
                    $scope.cartLoadin=true;
                    $scope.refreshToken(function(resp){
                        var cartItem= $localStorage['cart']['activities'];
                        for(var i=0;i<cartItem.length;i++){
                            if(id==cartItem[i].activity);
                            var activityToDel=cartItem[i].id;
                        }
                        $http({
                            method: 'DELETE',
                            url: $scope.base_url+'/api/v1/cart/activities/'+activityToDel + '/',
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': 'JWT '+$localStorage['user']['token']
                            },
                        }).then(function successCallback(response) {
                            $scope.cartLoadin=false;
                            $scope.addedToCart=false;
                            delete $localStorage['cart']['activities'][cartItem.activity];
                            delete $localStorage['cartIds'][$scope.url_id];
                            $scope.getCart();
                            $rootScope.addRemoveMessage = 'Activity Has Been removeds!';
                            angular.element('.NotificationDiv').addClass('RemoveItem');
                            angular.element('.NotificationDiv').css('display', 'block');
                            window.setTimeout(function(){
                                angular.element('.NotificationDiv').removeClass('RemoveItem');
                                angular.element('.NotificationDiv').css('display', 'none');
                                $rootScope.$apply();
                            },800);
                            $scope.addButtonText = 'Add This Activity';
                        }, function errorCallback(response) {
                            console.log(response);
                            $scope.addButtonText = 'Add This Activity';
                        });
                    });
                };
                $scope.addRemoveCart = function () {
                    if($scope.userLoggedIn && !$scope.cartIds[$scope.activityData.id]){
                        $scope.addToCart();
                    } else if($scope.userLoggedIn && $scope.cartIds[$scope.activityData.id]){
                        $scope.remFromCart($scope.activityData.id)

                    } else if(!$scope.userLoggedIn && !$scope.cartIds[$scope.activityData.id]) {
                        $scope.openLoginModal('lg', [], $scope.base_url)
                    } else if(!$scope.userLoggedIn && $scope.cartIds[$scope.activityData.id]){
                        $scope.addButtonText = 'Add This Activity';
                        $scope.remFromCartLocal($scope.activityData);
                    }
                };
                function init(){
                    angular.element('.profileDropdownCont').css('display','none');
                    $scope.activityData = {};
                    $scope.loading=true;
                    $scope.cartLoadin =false;
                    $scope.cartIds = $localStorage['cartIds'];
                    $scope.base_url=CONFIG.base_url;
                    $scope.popup2={};
                    $scope.popup1={};
                    $scope.person=1;
                    $scope.child=0;
                    $scope.getActivityDetail();
                    $scope.limit=700;
                    $scope.addButtonText = 'Add this activity';
                };
                init();
            }]);
})();