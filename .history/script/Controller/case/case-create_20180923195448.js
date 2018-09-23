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
    'blockUI',
    'growl',
    '$q',
    function($rootScope, $scope, $location, $http, $localStorage, CONFIG, $window, blockUI, growl, $q) {
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

      $scope.getUsers = function() {
        angular.element('.CaseCreate').css('display', 'block');
        $http({
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

      function saveComment(comments, caseId) {
        var commentsPromise = [];
        angular.forEach(comments, function(comment) {
          var commentPromise = $http({
            method: 'POST',
            url: $scope.base_url + '/records/case-comments/',
            headers: {
              'Content-type': 'application/json',
              authorization: 'Bearer ' + $localStorage['user']['token'],
            },
            data: { case: caseId, comment: comment.comment },
          });
          commentsPromise.push(commentPromise);
        });
        return commentsPromise;
      }

      function saveRecordInfo(caseRecords, caseId) {
        var recordsPromise = [];
        angular.forEach(caseRecords, function(caseRecord) {
          var recordPromise = $http({
            method: 'POST',
            url: $scope.base_url + '/records/cases/' + caseId + '/record/',
            headers: {
              'Content-type': 'application/json',
              authorization: 'Bearer ' + $localStorage['user']['token'],
            },
            data: { record: caseRecord.id },
          });
          recordsPromise.push(recordPromise);
        });
        return recordsPromise;
      }
      $scope.submitCase = function(caseInfo) {
        blockUI.start('Saving...');
        $http({
          method: 'POST',
          url: $scope.base_url + '/records/cases/',
          headers: {
            'Content-type': 'application/json',
            authorization: 'Bearer ' + $localStorage['user']['token'],
          },
          data: { title: caseInfo.title, number: caseInfo.number, assignee: caseInfo.assignee },
        }).then(
          function successCallback(response) {
            if (response) {
              // $scope.caseId = response.data.id;
              var commentsPromise = saveComment(caseInfo.comments, response.data.id);
              var recordsPromise = saveRecordInfo(caseInfo.records, response.data.id);
              var allPromise = commentsPromise.concat(recordsPromise);
              $q.all(allPromise)
                .then(function() {
                  growl.success('Case is saved successfully.');
                  blockUI.stop();
                  $location.path('/case/list');
                })
                .catch(function(error) {
                  growl.error('Something went wrong while saving.');
                  blockUI.stop();
                });
            }
          },
          function errorCallback(response) {
            blockUI.stop();
            $scope.errorMsgs = response.data.non_field_errors;
          }
        );
      };
      function init() {
        $rootScope.locationCrumb = 'Create Case';
        $scope.base_url = CONFIG.base_url;
        $scope.getRecords();
        $scope.getUsers();
      }
      init();
    },
  ]);
})();
