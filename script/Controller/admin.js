(function() {
    'use strict';
    angular.module('myApp.admin', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/admin', {
                templateUrl: '/views/admin.html',
                controller: 'adminCtrl'
            });
            
        }
    ])
  angular.module('myApp.admin').controller('adminCtrl',
    ['$rootScope','$scope','Upload','$location', '$http','$localStorage','$window','jwtHelper','CONFIG',
        function($rootScope,$scope,Upload,$location,$http,$localStorage,$window,jwtHelper,CONFIG) {

            $scope.editSave = function(label){
                if (label=='cancel') {
                    $scope.editCriminalEnable=false;
                    delete $scope.thisCriminal;
                    delete $scope.thisCriminalImg
                    delete $scope.thisCriminalId
                    delete $scope.thisCriminalImgL;
                    delete $scope.thisCriminalImgR;
                    delete $scope.thisCriminalImgF;
                }else{
                    var data1 ={};
                    data1 = $scope.thisCriminal;
                    if ($scope.thisCriminalId) {
                        data1['id']= $scope.thisCriminalId;
                        $http({
                            method: 'PATCH',
                            url: $scope.base_url+'/records/records/'+$scope.thisCriminalId,
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': 'Bearer '+$localStorage['user']['token']
                            },
                            data:data1  
                        }).then(function successCallback(response) {
                           console.log(response);
                           $scope.editCriminalEnable=false;
                           delete $scope.thisCriminal;
                           delete $scope.thisCriminalImg
                           delete $scope.thisCriminalId
                           delete $scope.thisCriminalImgL;
                           delete $scope.thisCriminalImgR;
                           delete $scope.thisCriminalImgF;
                        }, function errorCallback(response) {
                                $scope.errorMsgs=response.data.non_field_errors;
                        });   
                    }else {
                        $http({
                            method: 'POST',
                            url: $scope.base_url+'/records/records/',
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': 'Bearer '+$localStorage['user']['token']
                            },
                            data:data1  
                        }).then(function successCallback(response) {
                            console.log(response);
                            $scope.editCriminalEnable=false;
                            delete $scope.thisCriminal;
                            delete $scope.thisCriminalImg
                            delete $scope.thisCriminalId
                            delete $scope.thisCriminalImgL;
                            delete $scope.thisCriminalImgR;
                            delete $scope.thisCriminalImgF;
                        }, function errorCallback(response) {
                            $scope.errorMsgs=response.data.non_field_errors;
                        });    
                    }
                    
                    console.log(data1);
                    
                }
            };
            $scope.thisCriminalImgfileSave = function(label,image){
                var id;
                var type;
                var file;
                if (label=='L') {
                    type = 'left';
                    file = image;
                }else if (label=='R') {
                    type = 'right';
                    file = image;
                }else {
                    type = 'front';
                    file = image;
                }
                var fd=new FormData();
                fd.append("image",file);
                fd.append("image_type",type);
                fd.append("record",$scope.thisCriminalId);
                $http({
                    method:'POST',
                    url: $scope.base_url+'/records/images/',
                    headers: {
                        'Content-Type': undefined,
                        'authorization': 'Bearer '+$localStorage['user']['token']
                    },
                    data:fd
                })
                .then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

            $scope.addCriminalEn = function(){
                $scope.editCriminalEnable=true;
                $scope.thisCriminal={
                    'address1':'',
                    'address2':'',
                    'build':'',
                    'city':'',
                    'community':'',
                    'complexion':'',
                    'criminal_category':'',
                    'district':'',
                    'dob':'',
                    'eyes':'',
                    'face':'',
                    'fir_num':'',
                    'guardian_name':'',
                    'guardian_rel':'',
                    'hair':'',
                    'height':'',
                    'identities':'',
                    'name':'',
                    'offence_area':'',
                    'offence_type':'',
                    'police_post':'',
                    'police_station':'',
                    'religion':'',
                    'sex':'',
                    'state':'',
                    'yob':''
                };
            };

            $scope.editCriminal = function(id){
                $scope.editCriminalEnable=true;
                $scope.thisCriminal = {};
                $scope.thisCriminalId= id.id;
                for(var key in id){
                    if (key =='id') {
                        $scope.thisCriminalId= id.id;
                    }else if(key =='images' && id.images.length>0){
                        $scope.thisCriminalImg= id.images;
                        for (var i = 0; i < $scope.thisCriminalImg.length; i++) {
                            if($scope.thisCriminalImg[i]['image_type']=='left'){
                                $scope.thisCriminalImgL=$scope.thisCriminalImg[i];
                            }else if($scope.thisCriminalImg[i]['image_type']=='right'){
                                $scope.thisCriminalImgR=$scope.thisCriminalImg[i];
                            }else{
                                $scope.thisCriminalImgF=$scope.thisCriminalImg[i];
                            }
                        }
                    }else if(id.images.length==0){
                        $scope.thisCriminalImgL='';
                        $scope.thisCriminalImgR='';
                        $scope.thisCriminalImgF='';
                        $scope.thisCriminal[key]=id[key];
                    }
                    else {
                        $scope.thisCriminal[key]=id[key];
                    }
                    
                }
                 console.log($scope.thisCriminal);
            };

            $scope.submit = function(label){
                var url ='';
                if (label=='Places'){
                    url = '';
                }else if (label=='Activities'){

                }else if (label=='Users'){

                }else if (label=='All'){

                }
                $http({
                  method: 'GET',
                  url: $scope.base_url+'/api/v1/places/'+$scope.url_id,
                }).then(function successCallback(response) {
                  $scope.placeData = response.data;
                  $scope.getRelatedPlaces($scope.placeData.city);
                }, function errorCallback(response) {
                  console.log(response);
                });
            };

            $scope.uploadFile = function(files) {
                var fd = new FormData();
                fd.append("file", files[0]);

                // $http.post('localhost:8000/api/v1/places/bulk-upload/', fd, {
                //     withCredentials: true,
                //     headers: {'Content-Type': undefined },
                //     transformRequest: angular.identity
                // }).success(function(response){
                //     console.log(response);
                // }).error(function(response){
                //     console.log(response);
                // });



                $http({
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT '+$localStorage['user']['token']
                  },
                  url: 'https://api.bmyraahi.com/api/v1/places/bulk-upload/',
                  'file':fd
                }).then(function successCallback(response) {
                  $scope.placeData = response.data;
                  $scope.getRelatedPlaces($scope.placeData.city);
                }, function errorCallback(response) {
                  console.log(response);
                });

            };

            $scope.getCriminalData = function(){
                $http({
                    method: 'GET',
                    url: $scope.base_url+'/records/records/',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer '+$localStorage['user']['token']
                    }
                }).then(function successCallback(response) {
                    if (response) {
                        $scope.criminals = response.data.results;
                    }
                }, function errorCallback(response) {
                        //console.log('ERROR'+JSON.stringify(response));
                        $scope.errorMsgs=response.data.non_field_errors;
                });
            };

            

            $scope.getPeople = function(){
                if (!$scope.userEnable) {
                    $scope.getCriminalData();
                }else {
                    $scope.getUserData();
                }
            };

            function init(){
                $scope.base_url=CONFIG.base_url;
                var expToken = $localStorage['user']['token'];
                var tokenPayload = jwtHelper.decodeToken(expToken);
                var user = $localStorage['user'];
                $scope.userEnable = false;
                $scope.getPeople();
                
            };
            init();

        }
    ]);


})();