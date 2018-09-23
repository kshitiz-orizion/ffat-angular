(function() {
  'use strict';
  angular.module('myApp.user').controller('createCaseCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$http',
    '$localStorage',
    'CONFIG',
    '$window',
    function($rootScope, $scope, $location, $http, $localStorage, CONFIG, $window) {
      $scope.case = {
        title: '',
        number: '',
        records: [{}],
        comments: [{}],
      };
      $scope.getRecords = function() {
        $http({
          method: 'GET',
          url: $scope.base_url + '/records/records/',
          headers: {
            'Content-type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        }).then(
          function successCallback(response) {
            $scope.recordsCase = response.data.results;
          },
          function errorCallback(response) {
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };
      $scope.getUsers = async function() {
        angular.element('.CaseCreate').css('display', 'block');
        await $http({
          method: 'GET',
          url: $scope.base_url + '/users/users/',
          headers: {
            'Content-type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        }).then(
          function successCallback(response) {
            $scope.assignee = response.data.results;
            angular.element('.CaseCreate').css('display', 'none');
          },
          function errorCallback(response) {
            ////console.log('ERROR'+JSON.stringify(response));
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };

      function init() {
        $rootScope.locationCrumb = 'Create-user';
        $scope.base_url = CONFIG.base_url;
      }
      init();
    },
  ]);
})();
