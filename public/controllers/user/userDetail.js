'use strict';

angular.module('nimbliApp')
    .controller('UserDetailCtrl', function($scope, $stateParams, AccountService)
{
    $scope.user = {};
    $scope.editMode = false;
    $scope.edit = edit;
    $scope.save = save;
    $scope.isOwner = false;
    $scope.userProjects = [];
    $scope.cancel = cancel;
    
    AccountService.getUser($stateParams.id).then(function(data){
       $scope.user = data.user;
       $scope.userProjects = data.userProjects;
       var currentUser = AccountService.getCurrentUser();
       if(currentUser && ($stateParams.id === currentUser._id)){
           $scope.isOwner = true;
       }
           
       }, function(err){
           console.log(err);
    });
   
    function edit(){
        $scope.editMode = true;
    }
    
    function save(){
        AccountService.updateProfile($scope.user);
        $scope.editMode = false;
    }
   
    function cancel(){
        $scope.editMode = false;
    }
});