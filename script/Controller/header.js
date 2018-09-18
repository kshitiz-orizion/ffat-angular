(function() {
    'use strict';
    angular.module('myApp.header', ['ngRoute','app.configEnv'])

        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.when('/header', {
                    templateUrl: '/views/header.html',
                    controller: 'headerCtrl'
                });

            }
        ]);
    angular.module('myApp.header').controller('headerCtrl',
        ['$rootScope','$scope','$location','$uibModal','parallaxHelper','$http','$localStorage','$auth','$window','jwtHelper','CONFIG',
            function($rootScope,$scope,$location,$uibModal,parallaxHelper,$http,$localStorage,$auth,$window,jwtHelper,CONFIG) {
                $rootScope.changeCityPopUpCancel = function(){
                    angular.element('.PopupDiv').css('display','none');
                    angular.element('.PopOverlayBlack').css('display','none');
                };

                $rootScope.wantToChangeCityPopUp = function(url, data, add_id, label){
                    angular.element('.PopupDiv').css('display','block');
                    angular.element('.PopOverlayBlack').css('display','block');
                    $scope.addData = data;
                    $scope.addUrl = url;
                    $scope.addLable = label;
                    $scope.addID = add_id;
                }

                $rootScope.removeCartOnChangeCity = function(){
                    $rootScope.changeCityPopUpCancel();
                    $scope.currentCart = $localStorage['cart'];
                    var cart_id = $localStorage['user']['cart_id'];
                    var url = $scope.base_url + '/api/v1/cart/' + cart_id + '/empty/';
                    $http({
                        method: 'POST', url: url,
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': 'JWT '+$localStorage['user']['token']
                        }
                    }).then(function successCallback(response) {
                        $rootScope.showAlertCartEmpty=true;
                        window.setTimeout(function(){
                            $rootScope.showAlertCartEmpty=false;
                            $rootScope.$apply();
                        },2000);
                        $scope.emptyCart = response.data;
                        $localStorage['cartIds'] = {};
                        // $http({
                        //     method: 'POST', url: $scope.addUrl,
                        //     headers: {
                        //         'Content-Type': 'application/json',
                        //         'authorization': 'JWT '+$localStorage['user']['token']
                        //     },
                        //     data: $scope.addData,
                        // }).then(function successCallback(response) {
                        //     $localStorage['cartIds'][$scope.addID]=true;
                        //     $rootScope.addRemoveMessage = $scope.addLable;
                        //     angular.element('.NotificationDiv').css('display', 'block');
                        //     window.setTimeout(function(){
                        //         angular.element('.NotificationDiv').css('display', 'none');
                        //         $rootScope.$apply();
                        //     },800);
                        // }, function errorCallback(response) {
                        //     console.log(response);
                        // });
                        $scope.getCart();

                    }, function errorCallback(response) {
                        console.log(response);
                    });
                };

                $scope.openSearchBoxFunc = function(){
                    $scope.openSearchBox=false;
                };

                $scope.closeSearch = function(){
                    $scope.mainSearchText="";
                    $scope.searchData={};
                };

                $scope.search = function(){
                    if ($scope.mainSearchText.length>3) {
                        var request = $http.get(
                            $scope.base_url+'/api/v1/search/?query='+$scope.mainSearchText
                        ).then(function(result){
                            //console.log('result');
                            $scope.searchData = result.data.results;
                            //console.log($scope.searchData);
                        },function(error){
                            //console.log(error);
                        });
                    }
                };
                $scope.signOut= function(){
                    //console.log(socialLoginService);
                    //socialLoginService.logout();
                    //console.log(socialLoginService);
                    delete $localStorage.user;
                    delete $localStorage.cartIds;
                    delete $localStorage.order;
                    delete $localStorage.orderEnd;
                    delete $localStorage.orderInit;
                    delete $localStorage.orderInitSend;
                    delete $localStorage.cart;
                    //console.log($localStorage);
                    $rootScope.userLoggedIn=false;
                    $rootScope.openMenuBool=!$rootScope.openMenuBool;
                    $window.location.href = '/';
                    // $scope.$apply(function(){
                    //     delete $localStorage.user;
                    //     $rootScope.userLoggedIn=false;
                    // });

                };
                $scope.openMenu=function(){
                    $rootScope.openMenuBool=!$rootScope.openMenuBool;
                };

                $rootScope.openLoginModal = function (size,selectedUser,base_url) {
                    var uibModalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'myModalContent.html',
                        controller:function($rootScope,$uibModalInstance ,$scope,user,base_url){
                            $scope.base_url=CONFIG.base_url;
                            $scope.closeAlert = function(){
                                $scope.errorMsgs=[];
                            }
                            $scope.ok = function (label,user) {
                                if (label == 'register') {
                                    $scope.loading=true;
                                    if (user['uname1'] && user['pass1'] && user['pass2'] && (user['pass1']==user['pass2'])) {

                                        var data1={};
                                        data1['role']='customer';
                                        data1['email']=user.uname1;
                                        data1['name']=user.uname0;
                                        data1['phone']=user.mphno;
                                        data1['password1']=user.pass1;
                                        data1['password2']=user.pass2;
                                        $http({
                                            method: 'POST',
                                            url: base_url+'/api/v1/accounts/register/',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            data: data1
                                        }).then(function successCallback(response) {

                                            $scope.mailSent=true;
                                            setTimeout(function() {
                                                $uibModalInstance.dismiss();
                                            }, 5000)();

                                        }, function errorCallback(response) {
                                            $scope.errorMsgs=response.data.non_field_errors;
                                        });
                                    }else {
                                        console.log($scope.uname1+','+$scope.pass1+','+$scope.pass2);
                                    }
                                }else if (label == 'login') {

                                    var data1={};

                                    data1['email']=$scope.userName;
                                    data1['password']=$scope.password;
                                    $http({
                                        method: 'POST',
                                        url: $scope.base_url+'/api/v1/accounts/login/',
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

                                            //$scope.$apply(function(){
                                                $rootScope.user=$localStorage['user'];
                                            $rootScope.userLoggedIn=true;
                                            //});

                                            if($localStorage.user['is_superuser']&&$localStorage.user['is_superuser']==true){
                                                $window.location.href = '/admin';
                                            }else if($localStorage.user['role']=='vendor'){
                                                $http({
                                                    method: 'GET',
                                                    url: $scope.base_url+'/api/v1/vendors/',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'authorization': 'JWT '+$localStorage['user']['token']
                                                    },
                                                }).then(function successCallback(response) {

                                                    $localStorage['user']['vendorInfo']=response.data.results[0];
                                                    $localStorage['user']['vendor_id']=response.data.results[0]['id'];

                                                    $http({
                                                        method: 'GET',
                                                        url:$scope.base_url+'/api/v1/cart/',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'authorization': 'JWT '+$localStorage['user']['token']
                                                        },
                                                    }).then(function successCallback(response) {
                                                        $localStorage['cart']=response.data;
                                                        $rootScope.cartLength = 0;
                                                        var dataCart = $localStorage['cart'];
                                                        for(var i=0;i<dataCart['places'].length;i++){
                                                            $localStorage['cartIds'][dataCart['places'][i].place]=true;
                                                            $rootScope.cartLength += 1;
                                                        }
                                                        for(var i=0;i<dataCart['activities'].length;i++){
                                                            $localStorage['cartIds'][dataCart['activities'][i].activity]=true;
                                                            $rootScope.cartLength += 1;
                                                        }
                                                        for(var i=0;i<dataCart['bikes'].length;i++){
                                                            $localStorage['cartIds'][dataCart['bikes'][i].id]=true;
                                                            $rootScope.cartLength += 1;
                                                        }
                                                        for(var i=0;i<dataCart['cars'].length;i++){
                                                            $localStorage['cartIds'][dataCart['cars'][i].id]=true;
                                                            $rootScope.cartLength += 1;
                                                        }
                                                        if($rootScope.cartLength > 9){
                                                            $rootScope.cartLengthBeta = 9;
                                                        }
                                                        else{
                                                            $rootScope.cartLengthBeta = $rootScope.cartLength;
                                                        }
                                                        //$window.location.href = '/';
                                                    }, function errorCallback(response) {

                                                        console.log(response);
                                                    });

                                                }, function errorCallback(response) {
                                                    console.log(response);
                                                });
                                            }else {
                                                $http({
                                                    method: 'GET',
                                                    url:$scope.base_url+'/api/v1/cart/',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'authorization': 'JWT '+$localStorage['user']['token']
                                                    },
                                                }).then(function successCallback(response) {
                                                    $localStorage['cart']=response.data;
                                                    $rootScope.cartLength = 0;
                                                    var dataCart = $localStorage['cart'];
                                                    for(var i=0;i<dataCart['places'].length;i++){
                                                        $localStorage['cartIds'][dataCart['places'][i].place]=true;
                                                        $rootScope.cartLength += 1;
                                                    }
                                                    for(var i=0;i<dataCart['activities'].length;i++){
                                                        $localStorage['cartIds'][dataCart['activities'][i].activity]=true;
                                                        $rootScope.cartLength += 1;
                                                    }
                                                    for(var i=0;i<dataCart['bikes'].length;i++){
                                                        $localStorage['cartIds'][dataCart['bikes'][i].id]=true;
                                                        $rootScope.cartLength += 1;
                                                    }
                                                    for(var i=0;i<dataCart['cars'].length;i++){
                                                        $localStorage['cartIds'][dataCart['cars'][i].id]=true;
                                                        $rootScope.cartLength += 1;
                                                    }
                                                    if($rootScope.cartLength > 9){
                                                        $rootScope.cartLengthBeta = 9;
                                                    }
                                                    else{
                                                        $rootScope.cartLengthBeta = $rootScope.cartLength;
                                                    }
                                                    //$window.location.href = '/';
                                                }, function errorCallback(response) {

                                                    console.log(response);
                                                });

                                            }
                                            setTimeout(function() {
                                                $uibModalInstance.dismiss();
                                            }, 2000);

                                        }
                                    }, function errorCallback(response) {
                                        //console.log('ERROR'+JSON.stringify(response));
                                        $scope.errorMsgs=response.data.non_field_errors;
                                    });
                                }else if(label=='fb'){
                                    console.log('hereFB');
                                    $auth.authenticate('facebook');
                                }else if(label=='ggl'){
                                    console.log('hereGGL');
                                    $auth.authenticate('google');
                                }

                            };
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };

                            $scope.forgot = function(){
                                setTimeout(function() {
                                    $uibModalInstance.dismiss();
                                }, 0);
                            }
                        },
                        size: size,
                        resolve: {
                            user: function () {
                                return selectedUser;
                            },
                            base_url: function () {
                                return base_url;
                            }
                        }
                    });
                };

                $rootScope.checkForExist= function(id,cb){
                    if ($rootScope.userLoggedIn) {
                        $scope.getCart();
                        var cartData = $localStorage['cartIds'];
                        var cart = $localStorage['cart'];
                        //console.log('check',id,$localStorage['cart'],cartData);
                        if (cart){
                            $rootScope.cartLength = cart.activities.length+cart.places.length+cart.bikes.length+cart.cars.length;
                            if($rootScope.cartLength>9){
                                $rootScope.cartLengthBeta=9;
                            }
                            else{
                                $rootScope.cartLengthBeta=$rootScope.cartLength;
                            }
                        }else {
                            $rootScope.cartLength = 0;
                        }

                        if (cartData[id]) {
                            cb(true);
                        }else {
                            cb(false);
                        }
                    }else{
                        var cartData = $localStorage['cartIds'];
                        var cart = $localStorage['cart'];
                        if ($scope.cart){
                            $rootScope.cartLength = $scope.cart.activities.length+$scope.cart.places.length+$scope.cart.bikes.length+$scope.cart.cars.length;
                            if($rootScope.cartLength>9){
                                $rootScope.cartLengthBeta=9;
                            }
                            else{
                                $rootScope.cartLengthBeta=$rootScope.cartLength;
                            }
                        }else {
                            $rootScope.cartLength = 0;
                        }

                        if (cartData[id]) {
                            cb(true);
                        }else {
                            cb(false);
                        }
                    }
                };

                $scope.getCart = function(label){
                    $http({
                        method: 'GET',
                        url: $scope.base_url+'/api/v1/cart/',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': 'JWT '+$localStorage['user']['token']
                        },
                    }).then(function successCallback(response) {
                        $localStorage['cart']=response.data;
                        $scope.cart = $localStorage['cart'];
                        $rootScope.cartLength = $scope.cart.activities.length + $scope.cart.places.length + $scope.cart.bikes.length+$scope.cart.cars.length;
                        if($rootScope.cartLength>9){
                            $rootScope.cartLengthBeta=9;
                        }
                        else{
                            $rootScope.cartLengthBeta=$rootScope.cartLength;
                        }
                        if(label=='red') {
                            $window.location.href = '/';
                        }

                    }, function errorCallback(response) {
                        console.log(response);
                    });
                };

                var init = function(){
                    $rootScope.cartLengthBeta = 0;
                    $rootScope.cartLength = 0;
                    angular.element('.profileDropdownCont').css('display','none');
                    if (!$localStorage['cartIds']) {
                        $localStorage['cartIds']={};
                    }
                    $rootScope.openDropHeader=false;
                    $scope.base_url=CONFIG.base_url;
                    $rootScope.user = $localStorage['user'];
                    if ($rootScope.user) {
                        $rootScope.userLoggedIn=true;
                    }
                    else{
                        $rootScope.userLoggedIn=false;
                    }

                    if (!$rootScope.userLoggedIn && !$localStorage['cart']) {
                        $localStorage['cart']={
                            'activities':[],
                            'places':[],
                            'bikes':[],
                            'cars':[],
                            'prodMap':{}
                        };
                    } else if (!$localStorage['cart'] && $rootScope.userLoggedIn) {
                        $scope.getCart('init');
                    }else{
                        $scope.cart = $localStorage['cart'];
                        $rootScope.cartLength = $scope.cart.activities.length + $scope.cart.places.length + $scope.cart.bikes.length+$scope.cart.cars.length;
                        if($rootScope.cartLength>9){
                            $rootScope.cartLengthBeta=9;
                        }
                        else{
                            $rootScope.cartLengthBeta=$rootScope.cartLength;
                        }
                    }
                    $scope.regUser={};
                    $scope.loading=true;
                    $scope.addData = {};
                    $scope.addUrl = '';
                    $scope.addLable = '';
                    $scope.addID = '';
                    $rootScope.is_cart_deleted = false;
                };
                init();
            }
        ]);
})();