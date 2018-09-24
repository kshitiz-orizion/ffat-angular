(function() {
  'use strict';
  angular
    .module('myApp.case', ['ngRoute', 'app.configEnv'])

    .config([
      '$routeProvider',
      function($routeProvider) {
        $routeProvider
          .when('/case/list', {
            templateUrl: 'views/case/case-list.html',
            controller: 'listCaseCtrl',
          })
          .when('/case/create', {
            templateUrl: 'views/case/case-create.html',
            controller: 'createCaseCtrl',
          })
          .when('/case/:id', {
            templateUrl: 'views/case/case-create.html',
            controller: 'editCaseCtrl',
          });
      },
    ]);
})();
