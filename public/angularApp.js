'use strict';

angular.module('nimbliApp', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap', 'satellizer', 'angular-storage', 
                             'angularMoment', 'truncate', 'ngAnimate', 'ngFileUpload', 'toaster', 'datePicker',
                             'nya.bootstrap.select', 'afkl.lazyImage', 'ngMaterial', 'vAccordion', 'smoothScroll', 'angularSpinners'])
    .value('GoogleApp', {
        apiKey: 'AIzaSyDEgL-EiVFkoekLipiIvoU_usHCSNH2oSs',
        clientId: '895486469121-o1kenpcafsn0a1k2710ecu3ol0jvvegg.apps.googleusercontent.com',
        scopes: [ 'https://www.googleapis.com/auth/drive' ]
    })
    .config(function($stateProvider, $urlRouterProvider, $authProvider, USER_ROLES, AUTH_EVENTS, POST_VISIBILITY, POST_TYPE) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'partials/project/common/list-projects.html',
                controller: 'ProjectListCtrl'
            }).state('logout', {
                url: '/logout',
                template: null,
                controller: 'LogoutCtrl'
            }).state('projectcreate',{
                url: '/createproject',
                templateUrl: 'partials/project/common/create-project.html',
                controller: 'ProjectCreateCtrl',
                access :{
                    loginRequired : true
                }  
            }).state('projectlist', {
                url: '/projects',
                templateUrl: 'partials/project/common/list-projects.html',
                controller: 'ProjectListCtrl'
            }).state('projectview', {
                url : '/projects/:id',
                templateUrl : 'partials/project/common/view-project.html'
            }).state('notAllowed', {
                url : '/notallowed',
                template: '<h1>You are not allowed to view this!</h1>'
            }).state('dashboard', {
                url:'/dashboard',
                templateUrl : 'partials/dashboard.html'
            }).state('userview', {
                url:'/users/:id',
                templateUrl: 'partials/user/view-user.html',
                cache: false
            });

        $urlRouterProvider.otherwise('/');

        $authProvider.google({
            clientId: '701735845992-7sp1sl65pb8o42hapvj0qdu5e4iash2o.apps.googleusercontent.com'
        });  

    }).config(function($modalProvider) {
        angular.extend($modalProvider.defaults, {
            html: true
        });   
    }).run(['$rootScope','$location','$state', 'AuthorizationService','AUTH_EVENTS', 'AccountService',
   
     function($rootScope, $location, $state, AuthorizationService, AUTH_EVENTS, AccountService){
          
          var bypass = false;
         
          $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            /**
            if(bypass){
                bypass = false;
                return;
            } */
          
            
            if(toState.access !== undefined && toState.access.loginRequired !== undefined && toState.access.permissions !== undefined){
           
                event.preventDefault();
                var user = AccountService.getCurrentUser();
                if(user){
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
                }
               else{
                   $location.path('/notallowed').replace();
               }
            }
         });
  }]);


 


 
