'use strict';

angular.module('nimbliApp')
    .controller('ProjectListCtrl',  function($scope, projectService, $location)
    {
        
       $scope.projects = [];
      
       listProjects();
       
      function listProjects(){
         console.log("list projects");
         projectService.getProjects().then(function(projects){
             $scope.projects = projects;
         });
      }
      
      function logErr(err){
          console.log(err);
      }
     
});