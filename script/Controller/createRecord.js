(function() {
    'use strict';
    angular.module('myApp.createRecord', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/createrecord', {
                templateUrl: '/views/createRecord.html',
                controller: 'createRecordCtrl'
            });
            
        }
    ])
  angular.module('myApp.createRecord').controller('createRecordCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            $scope.submitRecord=async function(record){
                
                $scope.creating=true;
                var recordfor=record;
                var recordId;
                await $http({
                            method:'POST',
                            url: 'https://ssl.ffat.kindkonnect.in/records/records/',
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': 'Bearer '+$localStorage['user']['token']
                            },
                            data:record
                        })
                        .then(function successCallback(response) {
                            recordId=response.data.id;

                        }, function errorCallback(response) {
                            console.log(response);
                        });
                if(recordfor.image){
                                    if(recordfor.image.image_left){
                                    var fd_left=new FormData();
                                    fd_left.append('image_type','left');
                                    fd_left.append('image',recordfor.image.image_left);
                                    fd_left.append('record',recordId);
                                    await $http({
                                    method:'POST',
                                    url:'https://ssl.ffat.kindkonnect.in/records/images/',
                                    headers: {
                                                    'Content-Type': undefined,
                                                    'authorization': 'Bearer '+$localStorage['user']['token']
                                                },
                                    data:fd_left
                                    })
                                    .then(function successCallback(response) {
                                                console.log(response);
                                            }, function errorCallback(response) {
                                                console.log(response);
                                            });
                                    }
                                    if(recordfor.image.image_right){
                                    var fd_right=new FormData();
                                    fd_right.append('image_type','right');
                                    fd_right.append('image',recordfor.image.image_right);
                                    fd_right.append('record',recordId);
                                    await $http({
                                    method:'POST',
                                    url:'https://ssl.ffat.kindkonnect.in/records/images/',
                                    headers: {
                                                    'Content-Type': undefined,
                                                    'authorization': 'Bearer '+$localStorage['user']['token']
                                                },
                                    data:fd_right
                                    })
                                    .then(function successCallback(response) {
                                                console.log(response);
                                            }, function errorCallback(response) {
                                                console.log(response);
                                            });
                                    }
                                    if(recordfor.image.image_front){
                                    var fd_front=new FormData();
                                    fd_front.append('image_type','front');
                                    fd_front.append('image',recordfor.image.image_front);
                                    fd_front.append('record',recordId);
                                    await $http({
                                    method:'POST',
                                    url:'https://ssl.ffat.kindkonnect.in/records/images/',
                                    headers: {
                                                    'Content-Type': undefined,
                                                    'authorization': 'Bearer '+$localStorage['user']['token']
                                                },
                                    data:fd_front
                                    })
                                    .then(function successCallback(response) {
                                                console.log(response);
                                            }, function errorCallback(response) {
                                                console.log(response);
                                            });
                                    }
            }
            if(recordfor.identities){
            if(recordfor.identities.aadhar){
                var fd_aadhar=new FormData();
                fd_aadhar.append('identity_type','aadhar');
                fd_aadhar.append('image_front',recordfor.identities.aadhar.image_front);
                fd_aadhar.append('image_back',recordfor.identities.aadhar.image_back);
                fd_aadhar.append('identity_number',recordfor.identities.aadhar.identity_number);
                fd_aadhar.append('record',recordId);
                await $http({
                    method:'POST',
                    url:'https://ssl.ffat.kindkonnect.in/records/idproofs/',
                    headers: {
                                'Content-Type': undefined,
                                 'authorization': 'Bearer '+$localStorage['user']['token']
                             },
                    data:fd_aadhar
                })
                .then(function successCallback(response) {
                         console.log(response);
                         }, function errorCallback(response) {
                            console.log(response);
                        });
            }
            if(recordfor.identities.driving){
                var fd_driving=new FormData();
                fd_driving.append('identity_type','driving');
                fd_driving.append('image_front',recordfor.identities.driving.image_front);
                fd_driving.append('image_back',recordfor.identities.driving.image_back);
                fd_driving.append('identity_number',recordfor.identities.driving.identity_number);
                fd_driving.append('record',recordId);
                await $http({
                    method:'POST',
                    url:'https://ssl.ffat.kindkonnect.in/records/idproofs/',
                    headers: {
                                'Content-Type': undefined,
                                 'authorization': 'Bearer '+$localStorage['user']['token']
                             },
                    data:fd_driving
                })
                .then(function successCallback(response) {
                         console.log(response);
                         }, function errorCallback(response) {
                            console.log(response);
                        });
            }
            if(recordfor.identities.ration){
                var fd_ration=new FormData();
                fd_ration.append('identity_type','ration');
                fd_ration.append('image_front',recordfor.identities.ration.image_front);
                fd_ration.append('image_back',recordfor.identities.ration.image_back);
                fd_ration.append('identity_number',recordfor.identities.ration.identity_number);
                fd_ration.append('record',recordId);
                await $http({
                    method:'POST',
                    url:'https://ssl.ffat.kindkonnect.in/records/idproofs/',
                    headers: {
                                'Content-Type': undefined,
                                 'authorization': 'Bearer '+$localStorage['user']['token']
                             },
                    data:fd_ration
                })
                .then(function successCallback(response) {
                         console.log(response);
                         }, function errorCallback(response) {
                            console.log(response);
                        });
            }
            if(recordfor.identities.passport){
                var fd_passport=new FormData();
                fd_passport.append('identity_type','passport');
                fd_passport.append('image_front',recordfor.identities.passport.image_front);
                fd_passport.append('image_back',recordfor.identities.passport.image_back);
                fd_passport.append('identity_number',recordfor.identities.passport.identity_number);
                fd_passport.append('record',recordId);
                await $http({
                    method:'POST',
                    url:'https://ssl.ffat.kindkonnect.in/records/idproofs/',
                    headers: {
                                'Content-Type': undefined,
                                 'authorization': 'Bearer '+$localStorage['user']['token']
                             },
                    data:fd_passport
                })
                .then(function successCallback(response) {
                         console.log(response);
                         }, function errorCallback(response) {
                            console.log(response);
                        });
            }
            if(recordfor.identities.voter){
                var fd_voter=new FormData();
                fd_voter.append('identity_type','voter');
                fd_voter.append('image_front',recordfor.identities.voter.image_front);
                fd_voter.append('image_back',recordfor.identities.voter.image_back);
                fd_voter.append('identity_number',recordfor.identities.voter.identity_number);
                fd_voter.append('record',recordId);
                await $http({
                    method:'POST',
                    url:'https://ssl.ffat.kindkonnect.in/records/idproofs/',
                    headers: {
                                'Content-Type': undefined,
                                 'authorization': 'Bearer '+$localStorage['user']['token']
                             },
                    data:fd_voter
                })
                .then(function successCallback(response) {
                         console.log(response);
                         }, function errorCallback(response) {
                            console.log(response);
                        });
            }
            if(recordfor.identities.pan){
                var fd_pan=new FormData();
                fd_pan.append('identity_type','pan');
                fd_pan.append('image_front',recordfor.identities.pan.image_front);
                fd_pan.append('image_back',recordfor.identities.pan.image_back);
                fd_pan.append('identity_number',recordfor.identities.pan.identity_number);
                fd_pan.append('record',recordId);
                await $http({
                    method:'POST',
                    url:'https://ssl.ffat.kindkonnect.in/records/idproofs/',
                    headers: {
                                'Content-Type': undefined,
                                 'authorization': 'Bearer '+$localStorage['user']['token']
                             },
                    data:fd_pan
                })
                .then(function successCallback(response) {
                         console.log(response);
                         }, function errorCallback(response) {
                            console.log(response);
                        });
            }

        }
            }
            function init(){
                    $scope.creating=false;
                };
            init();
        }
    ]);


})();