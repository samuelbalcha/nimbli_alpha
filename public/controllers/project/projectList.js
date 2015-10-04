angular.module('nimbliApp')
    .controller('ProjectListCtrl',  function($scope, ProjectService, $location)
    {
       'use strict';
       
       $scope.projects = [];
       $scope.projectview = goTo;
       listProjects();
       
      function listProjects(){
         ProjectService.getProjects().then(function(projects){
             $scope.projects = projects;
         });
      }
      
      function goTo(project){
          $location.path('/projects/' + project.id);
      }
});