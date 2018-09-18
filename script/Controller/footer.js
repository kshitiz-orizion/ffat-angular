(function() {
    'use strict';
    angular.module('myApp.footer', ['ngRoute','app.configEnv'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/footer', {
                templateUrl: '/views/footer.html',
                controller: 'footerCtrl'
            });
            
        }
    ])
  angular.module('myApp.footer').controller('footerCtrl', ['$rootScope','$scope', '$location', '$http','CONFIG',
  function($rootScope,$scope,$location,$http,CONFIG) {


    $scope.addToEmail = function(){
      var data1 ={
        name: $scope.mailName,
        email: $scope.mailMail
      };
      $http({
        method: 'POST',
        url: $scope.base_url+'/api/v1/email-subscriptions/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data1
      }).then(function successCallback(response) {
        $scope.mailName="";
        $scope.mailMail="";
        console.log(response);
      }, function errorCallback(response) {
        console.log(response);
      });
    };

    var init = function(){
      angular.element('.profileDropdownCont').css('display','none');
      $scope.base_url = CONFIG.base_url;
    }
    init();
  }]);


})();