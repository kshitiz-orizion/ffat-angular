(function() {
    'use strict';
    angular.module('myApp.thank', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/thank', {
                templateUrl: '/views/thank.html',
                controller: 'thankCtrl'
            });
            
        }
    ])
  angular.module('myApp.thank').controller('thankCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG','$window',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG,$window) {
            $scope.getStatus = function(){
                $localStorage['orderEnd'] = {};
                $scope.orderStorage =  $localStorage['orderInit'];
                var url = $scope.base_url;
                if ($scope.orderStorage.data['payment_method']=='paytm') {
                    url = url +'/api/v1/paytm/'+$scope.orderStorage.data['id']+'/';
                }else if ($scope.orderStorage.data['payment_method']=='razor') {
                    url = url + '/api/v1/razor-pay/'+$scope.orderStorage.data['id']+'/';
                } else{
                    $scope.paymentStatus = $localStorage['orderInit'];
                    return;
                }
                $http({
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'JWT '+$localStorage['user']['token']
                    },
                    url: url,
                }).then(function successCallback(response) {
                    $localStorage['orderEnd']=response;
                    $scope.paymentStatus = response;
                    if ($scope.paymentStatus.data.status=='success') {
                        $localStorage['order'] = response;
                        $localStorage['cartIds']={};
                        $localStorage['cart']['activities']=[];
                        $localStorage['cart']['places']=[];
                        $localStorage['cart']['bikes']=[];
                        $localStorage['cart']['cars']=[];
                        $localStorage['cart']['cabs']=[];
                        $scope.cartLength = 0;
                        $scope.cartLengthBeta = 0;
                        // setTimeout(function() {
                        //     $window.location.href = '/';
                        // }, 5000);
                    }else if ($scope.paymentStatus.data.status=='initiated') {
                        setTimeout(function() {
                            if ($scope.countPend<10) {
                                $scope.countPend=$scope.countPend+1;
                                $scope.getStatus();
                            }else {
                                $window.location.href = '/cart';
                            }
                        }, 10000);
                    }else if ($scope.paymentStatus.data.status=='fail') {
                        // setTimeout(function() {
                        //     $window.location.href = '/cart';
                        // }, 5000);
                    }else if ($scope.paymentStatus.data.status=='pending') {
                        setTimeout(function() {
                            $scope.getStatus();
                        }, 10000);
                        
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

            function init(){
                angular.element('.profileDropdownCont').css('display','none');
                $scope.countPend=0;
                $scope.base_url=CONFIG.base_url;
                setTimeout(function() {
                    //$window.location.href = '/';
                }, 5000);
                $scope.getStatus();
            };
            init();
        }
    ]);


})();