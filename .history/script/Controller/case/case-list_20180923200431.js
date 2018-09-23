(function() {
  'use strict';
  angular.module('myApp.case').controller('listCaseCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$localStorage',
    'CONFIG',
    'blockUI',
    function($rootScope, $scope, $http, $localStorage, CONFIG, blockUI) {
      function getUsers() {
        $http({
          method: 'GET',
          url: $scope.base_url + '/users/users/',
          headers: {
            'Content-type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        }).then(
          function successCallback(response) {
            $scope.users = response.data.results;
            $scope.userHash = {};
            response.data.results.forEach(user => {
              $scope.userHash[user.id] = user;
            });
          },
          function errorCallback(response) {
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      }

      $scope.getCaseData = function() {
        blockUI.start();
        $http({
          method: 'GET',
          url: $scope.base_url + '/records/cases/',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        }).then(
          function successCallback(response) {
            if (response) {
              $scope.cases = response.data.results;
            }
            blockUI.stop();
          },
          function errorCallback(response) {
            blockUI.stop();
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };

      function init() {
        $scope.base_url = CONFIG.base_url;
        $rootScope.locationCrumb = 'Case List';
        getUsers();
        $scope.getCaseData();
      }
      init();
    },
  ]);
})();
