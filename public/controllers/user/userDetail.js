'use strict';

angular.module('nimbliApp')
    .controller('UserDetailCtrl', function($scope, $stateParams, AccountService, $location, USER_ROLES)
{
   
    $scope.user = {};
    $scope.editMode = false;
    $scope.edit = edit;
    $scope.save = save;
    $scope.isOwner = false;
    $scope.userProjects = [];
    
    loadUser();
   
    function loadUser(){
       AccountService.getUser($stateParams.id).then(function(data){
           $scope.user = data.user;
           $scope.userProjects = data.userProjects;
           
       }, function(err){
           //show modal
           console.log(err);
       });
       
       isUserOwner();
       
    }
    
    function edit(){
        $scope.editMode = true;
    }
    
    function save(){
        AccountService.updateProfile($scope.user);
        $scope.editMode = false;
    }
    
    function isUserOwner(){
        
        
        if(AccountService.isUserAuthenticated()){
            var currentUser = AccountService.getCurrentUser();
            
            if(currentUser === undefined){
                AccountService.getProfile().then(function(user){
                    if(user !== undefined && user._id === $stateParams.id){
                        $scope.isOwner = true;
                    }     
                });
            }
            else{
                if( currentUser._id === $stateParams.id){
                    $scope.isOwner = true;
                }
            }
        }
        
    }
});