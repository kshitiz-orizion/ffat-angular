(function() {
  'use strict';
  angular
    .module('myApp.showRecord', ['ngRoute', 'app.configEnv'])

    .config([
      '$routeProvider',
      function($routeProvider) {
        $routeProvider.when('/showRecord', {
          templateUrl: '/views/showRecord.html',
          controller: 'showRecordCtrl',
        });
      },
    ]);
  angular.module('myApp.showRecord').controller('showRecordCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$http',
    '$localStorage',
    'CONFIG',
    'blockUI',
    function($rootScope, $scope, $location, $http, $localStorage, CONFIG, blockUI) {
      $scope.getRecordDetails = function(id) {
        blockUI.start();
        $http({
          method: 'GET',
          url: $scope.base_url + '/records/records/' + id,
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        }).then(
          function successCallback(response) {
            if (response) {
              $scope.record = response.data;
            }
            blockUI.stop();
          },
          function errorCallback(response) {
            console.log(response);
            //console.log('ERROR'+JSON.stringify(response));
            blockUI.stop();
            // $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };
      $scope.enable=function(label){
        $scope.infoContent=label;
        $scope.newMenu= label;
      }
      function init() {
        $scope.menuItems=['Basic Information','Physical Information','Location Information','Criminal Record','Identities'];
        $scope.infoContent='Basic Information';
        $scope.newMenu='Basic Information';
        $rootScope.locationCrumb = 'Show-record';
        $scope.base_url = CONFIG.base_url;
        var criminalId = $location.search().id;
        if (criminalId) {
          $scope.getRecordDetails(criminalId);
        } else {
          $scope.url_id = 'featured';
        }
      }
      init();
    },
  ]);
})();
