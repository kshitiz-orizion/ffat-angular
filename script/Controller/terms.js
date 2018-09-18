(function() {
    'use strict';
    angular.module('myApp.terms', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/termsCondition', {
                templateUrl: '/views/termsandconditions.html',
                controller: 'termsCtrl'
            });
            
        }
    ])
  angular.module('myApp.terms').controller('termsCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            function init(){
               angular.element('.profileDropdownCont').css('display','none'); 
            };
            init();
        }
    ]);


})();