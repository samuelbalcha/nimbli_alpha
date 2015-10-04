angular.module('nimbliApp').controller('SignupCtrl', function($scope, $alert, $auth, AccountService, $location) {
    'use strict';
    $scope.unique = false;
    $scope.signupInfo = '';
    
    $scope.roles = ['Student', 'Teacher', 'Organization contact'];
    $scope.user = {
        role: '',
        displayName:'',
        email: '',
        password:''
    };
    
    $scope.user.role = $scope.roles[0]; 
   // var theModal;
    $scope.signup = function(theModal) {
      console.log(theModal)
            $auth.signup({
                displayName: $scope.user.displayName,
                email: $scope.user.email,
                password: $scope.user.password,
                role : $scope.user.role
            }).then(function(data){
                theModal.closeModal();
                AccountService.setCurrentUser(data.data.newUser);
                $location.path('users/' + data.data.newUser._id);
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
    
    $scope.authenticate = function(provider, theModal) {
           
        $auth.authenticate(provider).then(function() {
            AccountService.getProfile().then(function(user){ 
                theModal.closeModal();
            });
        })
        .catch(function(response) {
        
            /**
            $alert({
                content: response.data ? response.data.message : response,
                animation: 'fadeZoomFadeDown',
                type: 'material',
                duration: 3
            });
             */
        });
    };
    
    $scope.emailSign = function(){
        $scope.emailSignup = true;
    }
});