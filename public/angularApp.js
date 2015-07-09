'use strict';


angular.module('nimbliApp', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap', 'satellizer', 'ngImgCrop'])
    .config(function($stateProvider, $urlRouterProvider, $authProvider, USER_ROLES, AUTH_EVENTS) {
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
                access : {
                    loginRequired : true,
                    permissions : USER_ROLES.owner
                }
            }).state('upload', {
                url :'/upload',
                templateUrl: 'partials/avatar_uploader.html',
                controller: 'UploadCtrl'
            }).state('projectcreate',{
                url: '/createproject',
                templateUrl: 'partials/project/create-project.html',
                controller: 'ProjectCreateCtrl',
                resolve :{
                    authenticated : canAccess
                }
            }).state('projectlist', {
                url: '/projects',
                templateUrl: 'partials/project/list-project.html',
                controller: 'ProjectListCtrl',
                access : {
                    loginRequired : true,
                    permissions : USER_ROLES.owner
                }
            }).state('projectview', {
                url : '/projects/:id',
                templateUrl : 'partials/project/view-project.html',
                controller : 'ProjectDetailCtrl',
                access : {
                    loginRequired : true
                }
            }).state('projectupdate', {
                url : '/projects/:id/update',
                templateUrl : 'partials/project/update-project.html',
                controller : 'ProjectUpdateCtrl'
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
    }).run(['$rootScope','$location','$stateParams', 'AuthorizationService','AUTH_EVENTS', 'AccountService', 
    function($rootScope, $location, $stateParams, AuthorizationService, AUTH_EVENTS, AccountService){
          $rootScope.$on('$stateChangeStart', function(event, next){
            var id = ($stateParams !== null) ? $stateParams.id : null;
            
            if(next.access !== undefined){
                
               var user = AccountService.currentUser();
               
               if(user === undefined){
                    AccountService.getUserRoles().then(function(data) {
                        user = data; 
                    });     
               }
               
                var authorizationResult = new AuthorizationService(user);
                    
                if(authorizationResult.canAccess(id, next.access.loginRequired, next.access.permissions) === AUTH_EVENTS.notAuthenticated){
                    $location.path('/login').replace();
                }
                if(authorizationResult.canAccess(id, next.access.loginRequired, next.access.permissions) === AUTH_EVENTS.notAuthorized){
                    $location.path('/notallowed').replace();
                }      
            }
         });
    }]);
 
 

function isAuthenticated($q, $location, $auth) {
    var deferred = $q.defer();

    if (!$auth.isAuthenticated()) {
        $location.path('/login');
    } else {
        deferred.resolve();
    }
    
    return deferred.promise;
}



 


 
