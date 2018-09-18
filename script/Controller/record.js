(function() {
    'use strict';
    angular.module('myApp.record', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/record', {
                templateUrl: '/views/record.html',
                controller: 'recordCtrl'
            });
            
        }
    ])
  angular.module('myApp.record').controller('recordCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            function init(){
                console.log('here');
            }
            init();
        }
    ]);


})();