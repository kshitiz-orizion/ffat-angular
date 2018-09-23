(function() {
  'use strict';
  angular
    .module('myApp.gangAnalysis', ['ngRoute', 'app.configEnv'])

    .config([
      '$routeProvider',
      function($routeProvider) {
        $routeProvider.when('/gangAnalysis', {
          templateUrl: '/views/gangAnalysis.html',
          controller: 'gangAnalysisCtrl',
        });
      },
    ]);
  angular.module('myApp.gangAnalysis').controller('gangAnalysisCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$http',
    '$localStorage',
    'CONFIG',
    'CommonData',
    'blockUI',
    'growl',
    function($rootScope, $scope, $location, $http, $localStorage, CONFIG, CommonData, blockUI, growl) {
      $scope.criminalTypes = CommonData.criminalTypes;
      $scope.offenceTypes = CommonData.offenceTypes;
      $scope.searchGangs = function(searchParams) {
        blockUI.start();
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
              $scope.allGRecords = response.data.results;
              console.log($scope.allGRecords);
            }
            blockUI.stop();
          },
          function errorCallback(response) {
            //console.log('ERROR'+JSON.stringify(response));
            blockUI.stop();
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };

      $scope.checkForGang = function(id) {
        $scope.showAnalysis = true;
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
              console.log($scope.analysisData);
            }
          },
          function errorCallback(response) {
            //console.log('ERROR'+JSON.stringify(response));
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };

      var init = function() {
        $rootScope.locationCrumb = 'Gang-analysis';
        $scope.searchScope = {};
        $scope.base_url = CONFIG.base_url;
      };
      init();
    },
  ]);
})();
