'use strict';

angular.module('nimbliApp')
    .controller('ProjectDetailCtrl', function($scope, $stateParams, ProjectService, AccountService, $location, USER_ROLES)
    {
       $scope.isOwner = false;
       $scope.edit = edit;
       $scope.delete = deleteProject;
       $scope.publish = publish;
       $scope.editMode = false;
       $scope.save = save;
       $scope.cancel = cancel;
       
       var user = AccountService.getCurrentUser();
       if(user !== undefined && user.userRole === USER_ROLES.owner){
           $scope.isOwner = true;
       }
       
       detailProject();
       
       $scope.id = $stateParams.id;
       $scope.detail = detailProject;
       
      function detailProject(){
         ProjectService.getProject($stateParams.id).then(handleSuccess); 
      }
      
      function edit(){
          $scope.editMode = true;
      }
      
      function deleteProject(){
          //show confirmation modal
         ProjectService.removeProject($scope.project._id);
         $location.path('/projects');
      }
      
      function publish(){
          console.log("publish");
      }
      
      function save(){
        ProjectService.updateProject($scope.project);
         $scope.editMode = false;
      }
      
      function cancel(){
          $scope.editMode = false;
          detailProject();
      }
      
      function handleSuccess(project){
          $scope.project = project;
      }
});