'use strict';

angular.module('nimbliApp')
    .controller('ProjectListCtrl',  function($scope, ProjectService, $location)
    {
        
       $scope.projects = [];
       $scope.projectview = goTo;
       listProjects();
       
      function listProjects(){
         console.log("list projects");
         ProjectService.getProjects().then(function(projects){
             $scope.projects = projects;
         });
      }
      
      function goTo(project){
          $location.path('/projects/' + project.id);
      }
});