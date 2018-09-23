(function() {
  'use strict';
  angular
    .module('myApp.main', ['ngRoute', 'app.configEnv'])

    .config([
      '$routeProvider',
      function($routeProvider) {
        $routeProvider.when('/', {
          templateUrl: '/views/main.html',
          controller: 'MainCtrl',
        });
      },
    ]);
  angular.module('myApp.main').controller('MainCtrl', [
    '$rootScope',
    '$scope',
    'parallaxHelper',
    '$http',
    '$localStorage',
    'searchService',
    '$window',
    'CONFIG',
    'jwtHelper',
    '$location',
    function(
      $rootScope,
      $scope,
      parallaxHelper,
      $http,
      $localStorage,
      searchService,
      $window,
      CONFIG,
      jwtHelper,
      $location
    ) {
      $scope.getOtp = function() {
        var data1 = {};

        data1['mobile'] = $scope.userNameOTP;
        $http({
          method: 'POST',
          url: $scope.base_url + '/users/auth/get-otp/',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data1,
        }).then(
          function successCallback(response) {
            if (response) {
              $scope.getOtpBool = true;
            }
          },
          function errorCallback(response) {
            //console.log('ERROR'+JSON.stringify(response));
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };

      $scope.loginOtp = function(label, user) {
        $scope.loading = true;
        var data1 = {};

        data1.mobile = $scope.userNameOTP;
        data1.otp = $scope.otp.val;
        console.log(data1);
        $http({
          method: 'POST',
          url: $scope.base_url + '/users/auth/otp-login/',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data1,
        }).then(
          function successCallback(response) {
            if (response) {
              $scope.loading = false;
              var expToken = response.data.token;
              var tokenPayload = jwtHelper.decodeToken(expToken);
              console.log(tokenPayload);
              $localStorage.user = {};
              $localStorage.user = tokenPayload;
              $localStorage.user.token = response.data.token;

              $rootScope.user = $localStorage['user'];
              $rootScope.userLoggedIn = true;
              $location.path('/admin');
            }
          },
          function errorCallback(response) {
            //console.log('ERROR'+JSON.stringify(response));
            $scope.loginOtpValidate = 'true';
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };

      $scope.loginPwd = function() {
        var data1 = {};

        data1['mobile'] = $scope.userName;
        data1['password'] = $scope.password;
        $http({
          method: 'POST',
          url: $scope.base_url + '/users/auth/login/',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data1,
        }).then(
          function successCallback(response) {
            if (response) {
              $scope.loading = false;
              var expToken = response.data.token;
              var tokenPayload = jwtHelper.decodeToken(expToken);
              console.log(tokenPayload);
              $localStorage.user = {};
              $localStorage.user = tokenPayload;
              $localStorage.user.token = response.data.token;

              $rootScope.user = $localStorage['user'];
              $rootScope.userLoggedIn = true;
              $location.path('/analysis');
            }
          },
          function errorCallback(response) {
            // $rootScope.mainOP = true;
            $scope.loginPwdValidate = true;
            //console.log('ERROR'+JSON.stringify(response));
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };
      var init = function() {
        // $rootScope.mainOP = true;
        // temproray fix
        delete $localStorage.user;

        $scope.otp = {};
        $scope.base_url = CONFIG.base_url;
      };
      init();
    },
  ]);
})();
