(function() {
    'use strict';
    angular.module('myApp.team', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/team', {
                templateUrl: '/views/ourTeam.html',
                controller: 'teamCtrl'
            });
            
        }
    ])
  angular.module('myApp.team').controller('teamCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage', 'CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            function init(){
                angular.element('.profileDropdownCont').css('display','none');
                $scope.base_url=CONFIG.base_url;
            };
            init();
        }
    ]);


})();