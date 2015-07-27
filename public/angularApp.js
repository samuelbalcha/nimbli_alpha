'use strict';


angular.module('nimbliApp', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap', 'satellizer', 'angular-storage', 'angularMoment', 'truncate', 'ngAnimate'])
    .config(function($stateProvider, $urlRouterProvider, $authProvider, USER_ROLES, AUTH_EVENTS) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'partials/project/list-project.html',
                controller: 'ProjectListCtrl'
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
            .state('upload', {
                url :'/upload',
                templateUrl: 'partials/avatar_uploader.html',
                controller: 'UploadCtrl'
            }).state('projectcreate',{
                url: '/createproject',
                templateUrl: 'partials/project/create-project.html',
                controller: 'ProjectCreateCtrl',
                access :{
                    loginRequired : true
                }
                
            }).state('projectlist', {
                url: '/projects',
                templateUrl: 'partials/project/list-project.html',
                controller: 'ProjectListCtrl'
            }).state('projectview', {
                url : '/projects/:id',
                templateUrl : 'partials/project/view-project.html'
            }).state('notAllowed', {
                url : '/notallowed',
                template: '<h1>You are not allowed to view this!</h1>'
            }).state('dashboard', {
                url:'/dashboard',
                templateUrl : 'partials/dashboard.html',
                access : {
                    loginRequired :true
                }
            }).state('userview', {
                url:'/users/:id',
                templateUrl: 'partials/user/view-user.html'
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
        
    }).run(['$rootScope','$location','$state', 'AuthorizationService','AUTH_EVENTS', 'AccountService', 
   
     function($rootScope, $location, $state, AuthorizationService, AUTH_EVENTS, AccountService){
         
          var bypass = false;
         
          $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
           
            if(bypass){
                bypass = false;
                return;
            }
            
            if(toState.access !== undefined && toState.access.loginRequired !== undefined && toState.access.permissions !== undefined){
               
                event.preventDefault();
                AccountService.getUserAccess().then(function(user){
                    
                    var authorizationResult = new AuthorizationService(user);
                    var canAccess =  authorizationResult.canAccess(toParams.id, toState.access.loginRequired, toState.access.permissions);
                    
                    if( canAccess === AUTH_EVENTS.notAuthenticated){
                        $location.path('/login').replace();
                    }
                    if(canAccess === AUTH_EVENTS.notAuthorized){
                        $location.path('/notallowed').replace();
                    }
                    if(canAccess === AUTH_EVENTS.authorized){
                        bypass = true;
                        $state.go(toState, toParams);
                    }
                }).catch(function(response){
                    $location.path('/login').replace();
                });
              
            }
         });
  }]);
 


 


 
