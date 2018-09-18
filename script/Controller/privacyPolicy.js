(function() {
    'use strict';
    angular.module('myApp.privacy', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/privacyPolicy', {
                templateUrl: '/views/privacyPolicy.html',
                controller: 'privacyCtrl'
            });
            
        }
    ])
  angular.module('myApp.privacy').controller('privacyCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            function init(){
                angular.element('.profileDropdownCont').css('display','none');
                $scope.base_url=CONFIG.base_url;
            };
            init();
        }
    ]);


})();