(function() {
    'use strict';
    angular.module('myApp.guidePlaces', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/guidePlaces', {
                templateUrl: '/views/guidePlaces.html',
                controller: 'guidePlacesCtrl'
            });
            
        }
    ])
  angular.module('myApp.guidePlaces').controller('guidePlacesCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage', 'CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            var init = function (){
                angular.element('.profileDropdownCont').css('display','none');
                $scope.base_url = CONFIG.base_url;
            };
            init();
        }
    ]);
})();