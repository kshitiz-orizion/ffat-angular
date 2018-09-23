(function() {
  'use strict';
  angular.module('myApp.user').controller('createCaseCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$http',
    '$localStorage',
    'CONFIG',
    '$window',
    function($rootScope, $scope, $location, $http, $localStorage, CONFIG, $window) {
      $scope.case = {
        title: '',
        number: '',
        records: [{}],
        comments: [{}],
      };
      $scope.addRecord = function() {
        $scope.case.records.push({});
      };
      $scope.addComment = function() {
        $scope.case.comments.push({});
      };
      $scope.getRecords = function() {
        $http({
          method: 'GET',
          url: $scope.base_url + '/records/records/',
          headers: {
            'Content-type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        }).then(
          function successCallback(response) {
            $scope.recordsCase = response.data.results;
          },
          function errorCallback(response) {
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };
      $scope.getUsers = async function() {
        angular.element('.CaseCreate').css('display', 'block');
        await $http({
          method: 'GET',
          url: $scope.base_url + '/users/users/',
          headers: {
            'Content-type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
        }).then(
          function successCallback(response) {
            $scope.assignee = response.data.results;
            angular.element('.CaseCreate').css('display', 'none');
          },
          function errorCallback(response) {
            ////console.log('ERROR'+JSON.stringify(response));
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };
      $scope.submitCase =  function(value) {
        // if (value.comment) {
        //   $scope.NewComments = Object.values(value.comment);
        // }
        await $http({
          method: 'POST',
          url: $scope.base_url + '/records/cases/',
          headers: {
            'Content-type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
          data: value,
        }).then(
          function successCallback(response) {
            if (response) {
              $scope.caseId = response.data.id;
            }
          },
          function errorCallback(response) {
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
        if ($scope.recForCase.length !== 0) {
          for (var i = 0; i < $scope.recForCase.length; i++) {
            await $http({
              method: 'POST',
              url: $scope.base_url + '/records/cases/' + $scope.caseId + '/record/',
              headers: {
                'Content-type': 'application/json',
                authorization: 'Bearer ' + $localStorage['user']['token'],
              },
              data: { record: $scope.recForCase[i] },
            });
          }
        }
        if ($scope.NewComments.length !== 0) {
          for (var i = 0; i < $scope.NewComments.length; i++) {
            await $http({
              method: 'POST',
              url: $scope.base_url + '/records/case-comments/',
              headers: {
                'Content-type': 'application/json',
                authorization: 'Bearer ' + $localStorage['user']['token'],
              },
              data: { case: $scope.caseId, comment: $scope.NewComments[i] },
            });
          }
        }
        angular.element('.CaseCreate').css('display', 'block');
        $location.path('/record');
        $scope.$apply();
      };
      function init() {
        $rootScope.locationCrumb = 'Create-case';
        $scope.base_url = CONFIG.base_url;
        $scope.getRecords();
        $scope.getUsers();
      }
      init();
    },
  ]);
})();
