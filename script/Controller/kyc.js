(function() {
    'use strict';
    angular.module('myApp.kyc', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/kyc', {
                templateUrl: '/views/kyc.html',
                controller: 'kycCtrl'
            });
            
        }
    ])
  angular.module('myApp.kyc').controller('kycCtrl',
    ['$rootScope','$scope', '$location', '$http','$localStorage','CONFIG',
        function($rootScope,$scope,$location,$http,$localStorage,CONFIG) {
            $scope.user=$localStorage['user'];
            var x = moment.duration(1200,'minutes');
            
            console.log(x);
            function init (){
                $scope.base_url= CONFIG.base_url;
            };
            init();
        }
    ]);
})();