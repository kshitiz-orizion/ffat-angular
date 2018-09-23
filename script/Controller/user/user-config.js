(function() {
  'use strict';
  angular
    .module('myApp.user', ['ngRoute', 'app.configEnv'])

    .config([
      '$routeProvider',
      function($routeProvider) {
        $routeProvider
          .when('/user/list', {
            templateUrl: 'views/user/user-list.html',
            controller: 'listUserCtrl',
          })
          .when('/user/create', {
            templateUrl: 'views/user/user-create.html',
            controller: 'createUserCtrl',
          })
          .when('/user/:id', {
            templateUrl: 'views/user/user-create.html',
            controller: 'editUserCtrl',
          });
      },
    ]);
})();
