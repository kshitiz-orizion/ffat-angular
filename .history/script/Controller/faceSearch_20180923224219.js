(function() {
  'use strict';
  angular
    .module('myApp.faceSearch', ['ngRoute', 'app.configEnv'])

    .config([
      '$routeProvider',
      function($routeProvider) {
        $routeProvider.when('/faceSearch', {
          templateUrl: '/views/faceSearch.html',
          controller: 'faceSearchCtrl',
        });
      },
    ]);
  angular.module('myApp.faceSearch').controller('faceSearchCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$http',
    '$localStorage',
    'CONFIG',
    'growl',
    'blockUI',
    function($rootScope, $scope, $location, $http, $localStorage, CONFIG, growl, blockUI) {
      $scope.submitimage = function() {
        $scope.isStartingFaceSearch = true;
        if ($scope.upload_form.file.$valid && $scope.file) {
          $scope.upload('file');
        }
      };

      $scope.upload = function(file) {
        var fd = new FormData();
        fd.append('image', $scope.file);
        fd.append('confidence', 50);
        $http({
          method: 'POST',
          url: $scope.base_url + '/records/facial-searches/',
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined,
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
          data: fd,
        }).then(
          function successCallback(response) {
            $scope.getFSRes('search');
          },
          function errorCallback(response) {
            console.log(response);
          }
        );
      };

      $scope.enableSearch = function(resE) {
        if (resE) {
          $http({
            method: 'GET',
            url: $scope.base_url + '/records/facial-search-results/?search_id=' + resE.id,
            headers: {
              'Content-Type': 'application/json',
              authorization: 'Bearer ' + $localStorage['user']['token'],
            },
          }).then(
            function successCallback(response) {
              $scope.enableSearchDisp = true;
              if (response) {
                $scope.faceSearchRecordData = response.data.results;
                $scope.faceSearchRecordDataComp = resE;
                console.log($scope.faceSearchRecordData);
              }
            },
            function errorCallback(response) {
              //console.log('ERROR'+JSON.stringify(response));
              $scope.errorMsgs = response.data.non_field_errors;
            }
          );
        } else {
          $scope.enableSearchDisp = false;
        }
      };

      $scope.getFSRes = function(source) {
        source || blockUI.start();
        $http({
          method: 'GET',
          url: $scope.base_url + '/records/facial-searches/',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        }).then(
          function successCallback(response) {
            if (response) {
              $scope.faceSearchData = response.data.results;
              console.log($scope.faceSearchData);
            }
            $scope.isStartingFaceSearch = false;
            if (source === 'search') {
              growl.info('Facial Search is successfully done.');
            }
            blockUI.stop();
          },
          function errorCallback(response) {
            //console.log('ERROR'+JSON.stringify(response));
            blockUI.stop();
            $scope.isStartingFaceSearch = false;
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };

      $scope.refreshCriminalData = function(criminalSearchInfo, index) {
        criminalSearchInfo.isLoading = true;
        $http({
          method: 'GET',
          url: $scope.base_url + '/records/facial-searches/' + criminalSearchInfo.id,
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        })
          .then(function(res) {
            $scope.faceSearchData[index] = angular.extend({}, res.data, { isLoading: false });
          })
          .catch(function(error) {
            $scope.faceSearchData[index] = angular.extend({}, { isLoading: false });
          });
      };

      var init = function() {
        $rootScope.locationCrumb = 'Face-search';
        $scope.base_url = CONFIG.base_url;
        $scope.getFSRes();
      };
      init();
    },
  ]);
})();
