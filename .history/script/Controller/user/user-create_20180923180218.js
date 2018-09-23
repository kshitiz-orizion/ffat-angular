(function() {
  'use strict';
  angular.module('myApp.user').controller('createUserCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$http',
    '$localStorage',
    'CONFIG',
    '$window',
    function($rootScope, $scope, $location, $http, $localStorage, CONFIG, $window) {
      $scope.submitUser = function(user) {
        $scope.isSavingUser = true;
        if (!user.is_active) {
          user.is_active = false;
        }
        if (!user.is_staff) {
          user.is_staff = false;
        }
        $http({
          method: 'POST',
          url: $scope.base_url + '/users/users/',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
          data: user,
        }).then(
          function successCallback(response) {
            $scope.isSavingUser = false;
            $location.path('/user/list');
          },
          function errorCallback(response) {
            $scope.isSavingUser = false;
            console.log(response);
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
