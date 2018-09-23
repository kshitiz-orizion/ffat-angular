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
          },
          function errorCallback(response) {
            ////console.log('ERROR'+JSON.stringify(response));
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
              for (var i = 0; i < $scope.cases.length; i++) {
                for (var j = 0; j < $scope.users.length; j++) {
                  if ($scope.cases[i].assignee == $scope.users[j].id) {
                    $scope.cases[i].assigneeName = $scope.users[j].name;
                    $scope.cases[i].assigneeMobile = $scope.users[j].mobile;
                  }
                }
              }
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
