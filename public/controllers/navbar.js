angular.module('nimbliApp').controller('NavbarCtrl', function($scope, $auth, AccountService, store)
{
    'use strict';
    init();
    
    function init(){
       
        if(AccountService.getCurrentUser() !== null && !$auth.isAuthenticated()){
            $auth.logout().then(function(){
                store.remove('currentUser');
                AccountService.setCurrentUser(null);
                AccountService.setActiveUser(null);
            });
        }
    }
    
    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };
    
    $scope.$on('currentUserUpdated', function(evt, user){
        console.log(user);
        $scope.user = user;
    });
    
    $scope.user = AccountService.getCurrentUser();
});