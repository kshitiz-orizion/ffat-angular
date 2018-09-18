(function() {
    'use strict';
    angular.module('myApp.checkout', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/checkout', {
                templateUrl: '/views/checkout.html',
                controller: 'checkoutCtrl'
            });
            
        }
    ])
  angular.module('myApp.checkout').controller('checkoutCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG','$window',
    function($rootScope,$scope,$location,$http,$localStorage,CONFIG,$window) {
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
            };

            $scope.submit = function(label){
                if (label=='cod') {
                    var data1 ={};
                    // {
                    //     "order": "ab8ca9b3-a98d-46a0-9245-fce57be31fa0",
                    //     "amount": "500.00"
                    // }
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
                            delete $localStorage['cartIds'];
                            $window.location.href = '/thank';
                        }, function errorCallback(response) {

                            console.log(response);
                        });
                    });
                }
            };
            $scope.enableCODF = function(){
                $scope.enableCOD=true;
                $scope.enableCODS=true;
            }
            function init(){
                $scope.base_url=CONFIG.base_url;
                $scope.enableCOD=false;
                $scope.enableCODS=false;
                $scope.order = $localStorage['order'];
                $scope.switchOpt='COD';
            };
            init();
    }]);


})();