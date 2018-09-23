(function() {
  'use strict';
  angular.module('myApp.root', []);
  angular.module('myApp.root').controller('rootCtrl', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      $rootScope.$on('$routeChangeSuccess', function($event, next, current) {
        if (next && next.$$route.originalPath === '/admin') {
          $scope.showSearchBar = true;
        } else {
          $scope.showSearchBar = false;
        }
      });
    },
  ]);
})();
