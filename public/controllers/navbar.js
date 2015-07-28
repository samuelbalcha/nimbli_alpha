'use strict';

angular.module('nimbliApp')
       .controller('NavbarCtrl', function($scope, $auth, AccountService, store)
        {
            $scope.isAuthenticated = function() {
                return $auth.isAuthenticated();
            };
            
            $scope.$on('currentUserUpdated', function(evt, user){
               $scope.user = user;
            });
            
            $scope.user = AccountService.getCurrentUser();
           
        });