var app = angular.module("myApp",
    ['ngRoute',
        'angular-jwt',
        'slickCarousel',
        'duParallax',
        'ngAnimate',
        'satellizer',
        'ui.bootstrap',
        
        'ngStorage',
        'googlechart',
        "myApp.main",
        "myApp.admin",
        "myApp.analysis",
        "myApp.faceSearch",
        "myApp.record",
        "myApp.createRecord",
        "ngFileUpload",
        
    ])
    .config(['$locationProvider',
        '$routeProvider','$localStorageProvider','$authProvider', function($locationProvider,$routeProvider,$localStorageProvider,$authProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true
            });
            $authProvider.facebook({
                clientId: '174143832961027',
                responseType: 'token'
            });

            $authProvider.google({
                clientId: '181876223826-9lv3ckloh1hp4ptrurnc6eog034sj1jf.apps.googleusercontent.com',
                url: '/',
                redirectUri: 'https://staging.bmyraahi.com/',
            });

            //$googleDefaultsProvider.useConfig({
            //    client_id: '181876223826-9lv3ckloh1hp4ptrurnc6eog034sj1jf.apps.googleusercontent.com',
            //    client_secret: 'QJkcvEaghXeb9JFJAE2ko-wU',
            //scope: 'YOUR SCOPES, E.G.: https://www.googleapis.com/auth/userinfo.email'
            //});
            //socialProvider.setGoogleKey("181876223826-9lv3ckloh1hp4ptrurnc6eog034sj1jf.apps.googleusercontent.com");
            // var fbAppId = '174143832961027';
            // FacebookProvider.init(fbAppId);
            // var user = $localStorageProvider.get('user');
            // if(user && user.name && user.token){
            //   $rootScope.userLoggedIn=true;
            // }

        }]);

app.filter('capitalizeWord', function() {
    return function(text) {
        return (!!text) ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : '';
    }
});

app.controller('faqController', ['$rootScope','$scope', '$location', '$http', function($rootScope,$scope,$location,$http) {

}]);
app.service("searchService", function($http, $q) {
    var deferred = $q.defer();
    this.getResult = function(label,cb) {
        return $http.get('https://api.bmyraahi.com/api/v1/search/?query='+label)
            .then(function(response) {
                deferred.resolve(response);
                return deferred.promise;
            }, function(response) {
                // the following line rejects the promise
                deferred.reject(response);
                return deferred.promise;
            });
    };
});
app.filter('cutText', function () {
    return function (value, max, tail,wordwise) {
        if (!value) return '--';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' �');
    };
});
app.filter('splitByLine', function () {
    return function (value, wordwise, max, tail) {
        if (value.indexOf('#p#')>0) {
            return value.replace('#p#','<br/>');
        }else if (value.indexOf('#P#')>0) {
            return value.replace('#P#','<br/>');
        }else{
            return value;
        }
    };
});
app.filter('myDateFilter', ['$filter', function($filter) {

    return function(input) {
        var seconds = input * 60

        var hours = Math.floor(seconds / 3600) % 24;
        seconds -= hours * 3600;

        var minutes = Math.floor(seconds / 60) % 60;
        if(hours>0){
            return  hours + 'h ' + minutes + 'm ';
        }
        else{
            return minutes +'m '
        }
    }
}
]);

app.filter('formatTime', function ($filter) {
    return function (time, format) {
        if(time){
            var parts = time.split(':');
            var date = new Date(0, 0, 0, parts[0], parts[1], parts[2]);
            return $filter('date')(date, format || 'hh:mm a');
        }
    };
});

app.directive("matchPassword", function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=matchPassword"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.matchPassword = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});

// })();