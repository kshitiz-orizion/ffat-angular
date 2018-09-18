(function() {
    'use strict';
    angular.module('myApp.registerParty', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/registerParty', {
                templateUrl: '/views/registerParty.html',
                controller: 'registerPartyCtrl'
            });
            
        }
    ])
  angular.module('myApp.registerParty').controller('registerPartyCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','$window','CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,$window,CONFIG) {
            $scope.closeSearch = function(){
                $scope.mainSearchText="";
                $scope.searchData={};
            }
            $scope.submit = function(){
                console.log($scope.vendor);
                
                if ($scope.uname1 && $scope.pass1 && $scope.pass2 && ($scope.pass1==$scope.pass2)) {
                    var data1={};
                    if($scope.vendor==true){
                        data1['role']='vendor';
                    }else{
                        data1['role']='guide';
                    }
                    data1['email']=$scope.uname1;
                    data1['name']=$scope.uname0;
                    data1['password1']=$scope.pass1;
                    data1['password2']=$scope.pass2;
                    data1['phone']=$scope.phnNum;
                    console.log(data1);
                    
                    $http({
                        method: 'POST',
                        url: $scope.base_url+'/api/v1/accounts/register/',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: data1
                    }).then(function successCallback(response) {
                        $scope.successMsgs=response.detail;
                        $window.location.href = '/';
                    
                    }, function errorCallback(response) {
                        console.log(response.data);
                        $scope.errorMsgs=response.data;
                    });
                }

            };
            $scope.change = function(label){
                $scope.base_url=CONFIG.base_url;
                if(label=='guide'){
                    $scope.vendor=false;
                }else{
                    $scope.vendor=true;
                }
            };
            function init(){
                //$scope.vendor=true;
                //$scope.guide=false;
            };
            init();
        }
    ]);


})();