'use strict';

angular.module('nimbliApp')
    .controller('ProjectDetailCtrl',  function($scope, $stateParams, projectService, $location)
    {
         
        // Create New Project
        
      // $scope.project =  { };

       detailProject();
       
       $scope.id = $stateParams.id;
       $scope.detail = detailProject;
       
      function detailProject(){
          console.log("detailProject");
         projectService.getProject($stateParams.id).then( function(project){
             $scope.project = project;
         }); 
      }
      
});