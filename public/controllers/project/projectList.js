'use strict';

angular.module('nimbliApp')
    .controller('ProjectListCtrl',  function($scope, ProjectService, $location)
    {
        
       $scope.projects = [];
      
       listProjects();
       
      function listProjects(){
         console.log("list projects");
         ProjectService.getProjects().then(function(projects){
             $scope.projects = projects;
         });
      }
      
      function logErr(err){
          console.log(err);
      }
     
});