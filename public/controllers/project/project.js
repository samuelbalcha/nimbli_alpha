'use strict';

angular.module('nimbliApp')
    .controller('ProjectCtrl',  function($scope, $stateParams, projectService, $location)
    {
         
        // Create New Project
        
       $scope.project =  {
            title : '',
            company : '',
            coverPicture: 'http://placehold.it/1250x250',
            description : '',
            location : '',
            url : ''
       };

       $scope.projects = [];
       $scope.editMode = false;
       $scope.create = createProject;
       $scope.id = $stateParams.id;
       $scope.detail = detailProject;
       $scope.update = updateProject;
       $scope.cancel = cancel;
     
       listProjects();
       //detailProject();
       
       function createProject(){
          projectService.createProject($scope.project)
                        .then(function(data){
                              $scope.project = data;
                             // $location.path('/projects/' + data._id);
                 }).error(logErr);
       }
   
      function listProjects(){
         console.log("list projects");
         projectService.listProjects().then(function(projects){
             $scope.projects = projects;
         });
      }
      
      function detailProject(){
          console.log("detailProject");
         projectService.viewProject($stateParams.id).then(getProjectForScope); 
      }
      
      function updateProject(project){
          projectService.updateProject(project).then(getProjectForScope);
      }
      
      function cancel(){
          console.log("cancel")
          $scope.editMode = false;
          $location.path('/profile');
      }
      
      function getProjectForScope (project){
          $scope.project = project;
      } 
      
      function logErr(err){
          console.log(err);
      }
     
     
});