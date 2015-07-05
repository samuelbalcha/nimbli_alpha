angular.module('nimbliApp', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap', 'satellizer', 'xeditable', 'ngImgCrop'])
    .config(function($stateProvider, $urlRouterProvider, $authProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'partials/home.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'partials/signup.html',
                controller: 'SignupCtrl'
            })
            .state('logout', {
                url: '/logout',
                template: null,
                controller: 'LogoutCtrl'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'partials/profile.html',
                controller: 'ProfileCtrl',
                resolve: {
                    authenticated: function($q, $location, $auth) {
                        var deferred = $q.defer();

                        if (!$auth.isAuthenticated()) {
                            $location.path('/login');
                        } else {
                            deferred.resolve();
                        }

                        return deferred.promise;
                    }
                }
            }).state('upload', {
                url :'/upload',
                templateUrl: 'partials/avatar_uploader.html',
                controller: 'UploadCtrl'
            }).state('projectcreate',{
                url: '/createproject',
                templateUrl: 'partials/create-project.html',
                controller: 'ProjectCtrl'
            }).state('projectlist', {
                url: '/projects',
                templateUrl: 'partials/list-project.html',
                controller: 'ProjectCtrl'
            }).state('projectview', {
                url : '/projects/:id',
                templateUrl : 'partials/view-project.html',
                controller : 'ProjectCtrl'
            });

        $urlRouterProvider.otherwise('/');

        $authProvider.google({
            clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
        });

        $authProvider.github({
            clientId: '45ab07066fb6a805ed74'
        });

        $authProvider.linkedin({
            clientId: '77cw786yignpzj'
        });

    }).config(function($modalProvider) {
        angular.extend($modalProvider.defaults, {
            html: true
        });
    }).run(function(editableOptions){
        editableOptions.theme = 'bs3';
    });
