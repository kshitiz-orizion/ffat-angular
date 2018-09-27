(function() {
  'use strict';
  angular
    .module('myApp.admin', ['ngRoute', 'app.configEnv'])

    .config([
      '$routeProvider',
      function($routeProvider) {
        $routeProvider.when('/admin', {
          templateUrl: '/views/admin.html',
          controller: 'adminCtrl',
        });
      },
    ]);
  angular.module('myApp.admin').controller('adminCtrl', [
    '$rootScope',
    '$scope',
    'Upload',
    '$location',
    '$http',
    '$localStorage',
    '$window',
    'jwtHelper',
    'CONFIG',
    '$q',
    'blockUI',
    'CommonData',
    function(
      $rootScope,
      $scope,
      Upload,
      $location,
      $http,
      $localStorage,
      $window,
      jwtHelper,
      CONFIG,
      $q,
      blockUI,
      CommonData,
    ) {
      $scope.checkForGang=function(id){
        angular.element('.pagination').css('display','none');
        $scope.fromGangPage=false;
        $scope.gangPage=true;
        $scope.showAnalysis = true;
        $scope.analysisData={};
        angular.element('.eachCriminal').css('display','none');
        $http({
          method: 'POST',
          url: $scope.base_url + '/records/records/' + id + '/gang-analysis/',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        }).then(
          function successCallback(response) {
            if (response) {
              $scope.analysisData = response.data;
            }
          },
          function errorCallback(response) {
            //console.log('ERROR'+JSON.stringify(response));
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      }
      $scope.showMainPage=function(){
        if($scope.fromGangPage==true){
        $scope.editCriminalEnable=false;
        $scope.detailsCriminal=false;
        $scope.showAnalysis=true;
        $scope.fromGangPage=false;
        angular.element('.eachCriminal').css('display','none');
        angular.element('.advance-search').css('display','flex');
        }
        else{
        $scope.editCriminalEnable=false;
        $scope.detailsCriminal=false;
        $scope.showAnalysis=false;
        angular.element('.pagination').css('display','flex');
        angular.element('.eachCriminal').css('display','block');
        angular.element('.advance-search').css('display','flex');
         }
      }
      $scope.openDetails=function(details,label){
        angular.element('.pagination').css('display','none');
        if(label=='fromGang'){
          $scope.fromGangPage=true;
        }
        else{
          $scope.fromGangPage=false;
        }
        $scope.criminalDetail={};
        angular.element('.eachCriminal').css('display','none');
        angular.element('.advance-search').css('display','none');
        $scope.detailsCriminal=true;
        $scope.showAnalysis=false;
        $http({
          method:'GET',
          url:$scope.base_url+'/records/records/'+details.id,
          headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + $localStorage['user']['token'],
              },
        }).then(function successCallback(response){
          $scope.criminalDetail=response.data;
          $scope.editCriminalEnable = false;
          delete $scope.thisCriminal;
          delete $scope.thisCriminalImg;
          delete $scope.thisCriminalId;
          delete $scope.thisCriminalImgL;
          delete $scope.thisCriminalImgR;
          delete $scope.thisCriminalImgF;
        },
        function errorCallback(response){

        });
      }
      $scope.identityTypes = CommonData.identityTypes;
      $scope.criminalTypes = CommonData.criminalTypes;
      $scope.offenceTypes = CommonData.offenceTypes;
      $scope.fieldsShouldNotShow = ['id', 'images'];
      $scope.editSave = function(label) {
        if (label == 'cancel') {
          $scope.editCriminalEnable = false;
          $scope.detailsCriminal=false;
          delete $scope.thisCriminal;
          delete $scope.thisCriminalImg;
          delete $scope.thisCriminalId;
          delete $scope.thisCriminalImgL;
          delete $scope.thisCriminalImgR;
          delete $scope.thisCriminalImgF;
        } else {
          var data1 = {};
          data1 = $scope.thisCriminal;
          if ($scope.thisCriminalId) {
            blockUI.start('Saving...');
            data1['id'] = $scope.thisCriminalId;
            $http({
              method: 'PATCH',
              url: $scope.base_url + '/records/records/' + $scope.thisCriminalId,
              headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + $localStorage['user']['token'],
              },
              data: data1,
            }).then(
              function successCallback(response) {
                console.log(response);
                $scope.uploadIdentityProof(data1, $scope.thisCriminalId);
                $scope.editCriminalEnable = false;
                $scope.detailsCriminal=false;
                delete $scope.thisCriminal;
                delete $scope.thisCriminalImg;
                delete $scope.thisCriminalId;
                delete $scope.thisCriminalImgL;
                delete $scope.thisCriminalImgR;
                delete $scope.thisCriminalImgF;
              },
              function errorCallback(response) {
                $scope.errorMsgs = response.data.non_field_errors;
              }
            );
          } else {
            $http({
              method: 'POST',
              url: $scope.base_url + '/records/records/',
              headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + $localStorage['user']['token'],
              },
              data: data1,
            }).then(
              function successCallback(response) {
                console.log(response);
                $scope.detailsCriminal=false;
                $scope.editCriminalEnable = false;
                delete $scope.thisCriminal;
                delete $scope.thisCriminalImg;
                delete $scope.thisCriminalId;
                delete $scope.thisCriminalImgL;
                delete $scope.thisCriminalImgR;
                delete $scope.thisCriminalImgF;
                blockUI.stop();
              },
              function errorCallback(response) {
                blockUI.stop();
                $scope.errorMsgs = response.data.non_field_errors;
              }
            );
          }

          console.log(data1);
        }
      };
      $scope.addIdentity = function() {
        $scope.thisCriminal.identities.push({
          identity_type: '',
          identity_number: '',
        });
      };
      $scope.uploadIdentityProof = function(record, recordId) {
        const identityUpload = [];
        record.identities.forEach(function(identity) {
          if (identity[identity.identity_type]) {
            var fd_identity = new FormData();
            fd_identity.append('identity_type', identity.identity_type);
            if (identity[identity.identity_type].image_front) {
              fd_identity.append('image_front', identity[identity.identity_type].image_front);
            }
            if (identity[identity.identity_type].image_back) {
              fd_identity.append('image_back', identity[identity.identity_type].image_back);
            }

            fd_identity.append('identity_number', identity.identity_number);
            fd_identity.append('record', recordId);
            let identityProof;
            if (identity.id) {
              identityProof = $http({
                method: 'PUT',
                url: $scope.base_url + '/records/idproofs/' + identity.id,
                headers: {
                  'Content-Type': undefined,
                  authorization: 'Bearer ' + $localStorage['user']['token'],
                },
                data: fd_identity,
              });
            } else {
              identityProof = $http({
                method: 'POST',
                url: $scope.base_url + '/records/idproofs/',
                headers: {
                  'Content-Type': undefined,
                  authorization: 'Bearer ' + $localStorage['user']['token'],
                },
                data: fd_identity,
              });
            }
            identityUpload.push(identityProof);
          }
        });
        $q.all(identityUpload)
          .then(function(data) {
            $scope.getCriminalData();
            blockUI.stop();
          })
          .catch(function(error) {
            blockUI.stop();
          });
      };
      $scope.thisCriminalImgfileSave = function(label, image) {
        var id;
        var type;
        var file;
        if (label == 'L') {
          type = 'left';
          file = image;
        } else if (label == 'R') {
          type = 'right';
          file = image;
        } else {
          type = 'front';
          file = image;
        }
        var fd = new FormData();
        fd.append('image', file);
        fd.append('image_type', type);
        fd.append('record', $scope.thisCriminalId);
        $http({
          method: 'POST',
          url: $scope.base_url + '/records/images/',
          headers: {
            'Content-Type': undefined,
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
          data: fd,
        }).then(
          function successCallback(response) {
            console.log(response);
          },
          function errorCallback(response) {
            console.log(response);
          }
        );
      };

      $scope.addCriminalEn = function() {
        $scope.editCriminalEnable = true;
        $scope.thisCriminal = {
          address1: '',
          address2: '',
          build: '',
          city: '',
          community: '',
          complexion: '',
          criminal_category: '',
          district: '',
          dob: '',
          eyes: '',
          face: '',
          fir_num: '',
          guardian_name: '',
          guardian_rel: '',
          hair: '',
          height: '',
          identities: '',
          name: '',
          offence_area: '',
          offence_type: '',
          police_post: '',
          police_station: '',
          religion: '',
          sex: '',
          state: '',
          yob: '',
        };
      };

      $scope.editCriminal = function(criminal) {
        angular.element('.advance-search').css('display','none');
        $scope.editCriminalEnable = true;
        $scope.thisCriminal = {};
        $scope.thisCriminalId = criminal.id;
        if (criminal.images.length > 0) {
          for (var i = 0; i < criminal.images.length; i++) {
            if (criminal.images[i]['image_type'] == 'left') {
              $scope.thisCriminalImgL = criminal.images[i];
            } else if (criminal.images[i]['image_type'] == 'right') {
              $scope.thisCriminalImgR = criminal.images[i];
            } else {
              $scope.thisCriminalImgF = criminal.images[i];
            }
          }
        } else {
          $scope.thisCriminalImgL = '';
          $scope.thisCriminalImgR = '';
          $scope.thisCriminalImgF = '';
        }
        $scope.thisCriminal = angular.copy(criminal);

        // for(var key in id){
        //     if (key =='id') {
        //         $scope.thisCriminalId= id.id;
        //     }else if(key =='images' && id.images.length>0){
        //         $scope.thisCriminalImg= id.images;
        //         for (var i = 0; i < $scope.thisCriminalImg.length; i++) {
        //             if($scope.thisCriminalImg[i]['image_type']=='left'){
        //                 $scope.thisCriminalImgL=$scope.thisCriminalImg[i];
        //             }else if($scope.thisCriminalImg[i]['image_type']=='right'){
        //                 $scope.thisCriminalImgR=$scope.thisCriminalImg[i];
        //             }else{
        //                 $scope.thisCriminalImgF=$scope.thisCriminalImg[i];
        //             }
        //         }
        //     }else if(id.images.length==0){
        //         $scope.thisCriminalImgL='';
        //         $scope.thisCriminalImgR='';
        //         $scope.thisCriminalImgF='';
        //         $scope.thisCriminal[key]=id[key];
        //     }
        //     else {
        //         $scope.thisCriminal[key]=id[key];
        //     }

        // }
        //  console.log($scope.thisCriminal);
      };

      $scope.submit = function(label) {
        var url = '';
        if (label == 'Places') {
          url = '';
        } else if (label == 'Activities') {
        } else if (label == 'Users') {
        } else if (label == 'All') {
        }
        $http({
          method: 'GET',
          url: $scope.base_url + '/api/v1/places/' + $scope.url_id,
        }).then(
          function successCallback(response) {
            $scope.placeData = response.data;
            $scope.getRelatedPlaces($scope.placeData.city);
          },
          function errorCallback(response) {
            console.log(response);
          }
        );
      };

      $scope.uploadFile = function(files) {
        var fd = new FormData();
        fd.append('file', files[0]);

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
            Authorization: 'JWT ' + $localStorage['user']['token'],
          },
          url: 'https://api.bmyraahi.com/api/v1/places/bulk-upload/',
          file: fd,
        }).then(
          function successCallback(response) {
            $scope.placeData = response.data;
            $scope.getRelatedPlaces($scope.placeData.city);
          },
          function errorCallback(response) {
            console.log(response);
          }
        );
      };

      $scope.getCriminalData = function(searchParams,index) {
        $scope.criminals={};
        blockUI.start();
        if(searchParams==undefined){
          $http({
            method: 'GET',
            url: $scope.base_url+'/records/records/?limit=50&offset='+(50*index),
            headers: {
              'Content-Type': 'application/json',
              authorization: 'Bearer ' + $localStorage['user']['token'],
            },
          }).then(
            function successCallback(response) {
              if (response) {
                $scope.criminals = response.data.results;
                $scope.activeMenu= index;
                if(response.data.count%50==0){
                  $scope.pages=response.data.count/50;
                }
                else{
                  $scope.pages=new Array(Math.floor((response.data.count/50)+1));
                }
              }
              blockUI.stop();
            },
            function errorCallback(response) {
              //console.log('ERROR'+JSON.stringify(response));
              $scope.errorMsgs = response.data.non_field_errors;
              blockUI.stop();
            }
          );
        }
        if(searchParams!==undefined){
            $http({
                method: 'GET',
                url: $scope.base_url + '/records/records/',
                params: searchParams,
                headers: {
                  'Content-Type': 'application/json',
                  authorization: 'Bearer ' + $localStorage['user']['token'],
                },
              }).then(
                function successCallback(response) {
                  if (response) {
                    $scope.criminals = response.data.results;
                  }
                  blockUI.stop();
                },
                function errorCallback(response) {
                  //console.log('ERROR'+JSON.stringify(response));
                  $scope.errorMsgs = response.data.non_field_errors;
                  blockUI.stop();
                }
              );
        }
      };

      $scope.getPeople = function() {
        if (!$scope.userEnable) {
          $scope.getCriminalData(undefined,0);
        } else {
          $scope.getUserData();
        }
      };

      $scope.criminalAdvSearch = function(advSearch) {
        $scope.showAnalysis=false;
        $scope.detailsCriminal=false;
        if (!advSearch) {
          $scope.advSearch = {};
        }
        $scope.getCriminalData(advSearch);
      };

      function init() {
        $scope.base_url = CONFIG.base_url;
        $rootScope.locationCrumb = 'Criminals-record';
        var expToken = $localStorage['user']['token'];
        var tokenPayload = jwtHelper.decodeToken(expToken);
        var user = $localStorage['user'];
        $scope.userEnable = false;
        $scope.getPeople();
      }
      init();
    },
  ]);
})();
