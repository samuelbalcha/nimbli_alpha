'use strict';

angular.module('nimbliApp')
    .controller('ProjectDetailCtrl', function($scope, $stateParams, ProjectService, $location)
    {
         
       detailProject();
       
       $scope.id = $stateParams.id;
       $scope.detail = detailProject;
       
      function detailProject(){
          
         ProjectService.getProject($stateParams.id).then( function(project){
             $scope.project = project;
         }); 
      }
      
});