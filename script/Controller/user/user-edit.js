(function() {
  'use strict';
  angular.module('myApp.user').controller('editUserCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$http',
    '$localStorage',
    'CONFIG',
    '$window',
    '$routeParams',
    function($rootScope, $scope, $location, $http, $localStorage, CONFIG, $window, $routeParams) {
      $scope.submitUser = function(user) {
        $scope.isSavingUser = true;
        if (!user.is_active) {
          user.is_active = false;
        }
        if (!user.is_staff) {
          user.is_staff = false;
        }
        $http({
          method: 'PUT',
          url: $scope.base_url + '/users/users/' + user.id,
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

      function getUser(userId) {
        $http({
          method: 'GET',
          url: $scope.base_url + '/users/users/' + userId,
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        })
          .then(function(res) {
            $scope.user = res.data;
          })
          .catch(function(error) {});
      }

      function init() {
        $rootScope.locationCrumb = 'Create-user';
        $scope.base_url = CONFIG.base_url;
        var userId = $routeParams.id;
        getUser(userId);
      }
      init();
    },
  ]);
})();
