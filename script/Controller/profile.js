(function() {
    'use strict';
    angular.module('myApp.profile', ['ngRoute','app.configEnv'])

        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.when('/profile', {
                    templateUrl: '/views/profile.html',
                    controller: 'profileCtrl'
                });
            }
        ])
    angular.module('myApp.profile').controller('profileCtrl',

        ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG','$filter','$route','Upload','$window',
            function($rootScope,$scope,$location,$http,$localStorage,CONFIG,$filter,$route,Upload,$window) {
                $scope.submitimage = function(){
                    if ($scope.upload_form.file.$valid && $scope.file) {
                        $scope.upload('file');
                    }
                }

                $scope.upload = function (file) {
                    $scope.refreshToken(function(resp){
                        var fd=new FormData();
                        fd.append("profile_pic",$scope.file);
                        fd.append("name",$scope.user.name);
                        fd.append("phone",$scope.user.phone);
                        fd.append("email",$scope.user.email);
                        $http({
                            method:'PUT',
                            url: $scope.base_url+'/api/v1/profiles/'+$scope.user.user_id,
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined,
                                'authorization': 'JWT '+$localStorage['user']['token']
                            },
                            data:fd
                        })
                        .then(function successCallback(response) {
                            console.log(response);
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    });
                };
                $scope.refreshToken = function(cb){
                    var thisToken = $localStorage['user']['token'];
                    var token={
                        'token': thisToken
                    };
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
                            $scope.cartData = $localStorage['cart'];
                        }, function errorCallback(response) {

                            console.log(response);
                        });
                    });
                }
                $scope.getProfile=function(){
                    $scope.refreshToken(function(resp){
                        $http({
                            method: 'GET',
                            url: $scope.base_url+'/api/v1/profiles/'+$scope.user.user_id,
                            headers: {
                                'Content-Type' : 'application/json',
                                'authorization': 'JWT '+$localStorage['user']['token'] }
                        }).then(function successCallback(response) {
                           $scope.user.profile_pic=response.data.profile_pic;
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    });
                }
                $scope.saveUser=function(){
                    $scope.refreshToken(function(resp){
                        // $localStorage['user']=$scope.user;
                        if($scope.userEdit.name!=undefined){
                            $scope.user.name=$scope.userEdit.name;
                        }
                        if($scope.userEdit.phone!=undefined ){
                            $scope.user.phone=$scope.userEdit.phone;
                        }
                        if($scope.userEdit.email!=undefined){
                            $scope.user.email=$scope.userEdit.email;
                        }
                        var data1={};
                        data1=$scope.user;
                        $http({
                            method: 'PUT',
                            url: $scope.base_url+'/api/v1/profiles/'+$scope.user.user_id,
                            headers: {
                                'Content-Type' : 'application/json',
                                'authorization': 'JWT '+$localStorage['user']['token'] },
                            data: data1,
                        }).then(function successCallback(response) {
                            $scope.$applyAsync();
                            $route.reload();
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    });
                }
                $scope.updatePwd = function(){
                    if ($scope.passOld && $scope.passNew1 && $scope.passNew2 && ($scope.passNew1==$scope.passNew2)) {
                        var data1={};
                        data1['email']=$scope.passOld;
                        data1['password1']=$scope.passNew1;
                        data1['password2']=$scope.passNew2;
                        $http({
                            method: 'POST',
                            url: $scope.base_url+'/api/v1/accounts/register/',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: data1
                        }).then(function successCallback(response) {
                            $uibModalInstance.dismiss();
                        }, function errorCallback(response) {

                        });
                    }
                };
                $scope.getOrder = function(){
                    $scope.refreshToken(function(resp){
                        $http({
                            method: 'GET',
                            url: $scope.base_url+'/api/v1/orders/',
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': 'JWT '+$localStorage['user']['token']
                            },
                        }).then(function successCallback(response) {
                            $scope.orderData = response.data.results;
                            for(var i=0; i<$scope.orderData.length; i++){
                                $scope.orderData[i].isoTime=(new Date($scope.orderData[i].booked_date)).getTime();
                            }
                            // console.log($scope.orderData);
                        }, function errorCallback(response) {

                            console.log(response);
                        });
                    });
                };

                $scope.getOrderDetail = function(order_id){
                    var url = $scope.base_url + '/api/v1/orders/' + order_id + '/order-detail/';
                    $scope.refreshToken(function(resp){
                        $http({
                            method: 'GET', url: url,
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': 'JWT ' + $localStorage['user']['token']
                            },
                        }).then(function successCallback(response) {
                            $scope.openMap = response.data;
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    });
                };

                $scope.signOut= function(){
                    delete $localStorage.user;
                    delete $localStorage.cartIds;
                    delete $localStorage.order;
                    delete $localStorage.orderEnd;
                    delete $localStorage.orderInit;
                    delete $localStorage.orderInitSend;
                    delete $localStorage.cart;
                    $rootScope.userLoggedIn=false;
                    $rootScope.openMenuBool=!$rootScope.openMenuBool;
                    $window.location.href = '/';
                };
                function init(){
                    $scope.openMap={};
                    angular.element('.profileDropdownCont').css('display','none');
                    $scope.todayDate=new Date();

                    $scope.todayDate.setHours(0,0,0,0);
                    $scope.todayDate=$scope.todayDate.getTime()-1;
                    //console.log($scope.todayDate);
                    $scope.base_url=CONFIG.base_url;
                    $scope.showPwd={};
                    $scope.user = $localStorage['user'];
                    console.log($scope.user);
                    $scope.changeTab='current';
                    $scope.getOrder();
                    $scope.getProfile();
                    //$scope.getCart();
                };
                init();
            }
        ]);


})();