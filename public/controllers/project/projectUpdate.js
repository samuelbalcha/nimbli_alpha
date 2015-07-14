'use strict';

angular.module('nimbliApp')
    .controller('ProjectUpdateCtrl',  function($scope, ProjectService, $stateParams, $location)
    {
        $scope.project = {};
     
        getProject();
       
       function getProject(){
         projectService.getProject($stateParams.id).then(function(project){
             $scope.project = project;
         });   
       }

      function cancel(){
          console.log("cancel")
          $location.path('/projects');
      }
      
      function logErr(err){
          console.log(err);
      }
});