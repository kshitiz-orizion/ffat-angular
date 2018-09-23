(function() {
  'use strict';
  angular.module('myApp.user').controller('listUserCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$localStorage',
    'CONFIG',
    'blockUI',
    function($rootScope, $scope, $http, $localStorage, CONFIG, blockUI) {
      $scope.getUserData = function() {
        blockUI.start();
        $http({
          method: 'GET',
          url: $scope.base_url + '/users/users/',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        }).then(
          function successCallback(response) {
            if (response) {
              $scope.users = response.data.results;
            }
            blockUI.stop();
          },
          function errorCallback(response) {
            ////console.log('ERROR'+JSON.stringify(response));
            blockUI.stop();
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };

      function init() {
        $scope.base_url = CONFIG.base_url;
        $rootScope.locationCrumb = 'User List';
        $scope.getUserData();
      }
      init();
    },
  ]);
})();
