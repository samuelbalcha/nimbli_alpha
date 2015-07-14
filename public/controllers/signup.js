'use strict';

angular.module('nimbliApp')
    .controller('SignupCtrl', function($scope, $alert, $auth) {
        $scope.unique = false;
        $scope.signupInfo = '';
        
        $scope.signup = function() {
            $auth.signup({
                displayName: $scope.displayName,
                email: $scope.email,
                password: $scope.password
            }).catch(function(response) {
                 
                  if(response.status === 409){
                      // User already exists
                      $scope.unique = true;
                      $scope.signupInfo = 'Email is already taken.';
                  }
                  if(response.status === 403){
                      $scope.signupInfo = 'User could not be registered. Please try again.';
                  }  
            }).finally(function(data){
               
            });
        };
    });