(function() {
    'use strict';
    angular.module('myApp.about', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/contact', {
                templateUrl: '/views/contactUs.html',
                controller: 'contactCtrl'
            });
            
        }
    ])
  angular.module('myApp.about').controller('contactCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            angular.element('.profileDropdownCont').css('display','none');
        }
    ]);


})();