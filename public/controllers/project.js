'use strict';

angular.module('nimbliApp')
    .controller('ProjectCtrl',  function($scope, $stateParams, projectService, $location)
    {
        // Create New Project
        $scope.newProject =  {
            title : '',
            company : '',
            coverPicture: 'http://placehold.it/1250x250',
            description : '',
            location : '',
            url : ''
        };

       $scope.editMode = false;

       $scope.create = function(){
          // $http.post('/api/projects', { project : $scope.project });
          projectService.createProject($scope.newProject)
                        .then(function (data) {
                              $location.path('/projects/' + data._id);
                        }).error(function(err){
                             //err
                        });
       };
   
     
      projectService.listProjects().then(function(data){
            $scope.projects = data;
      });
     
      $scope.id = $stateParams.id;
      
      projectService.viewProject($stateParams.id).then(function(data){
           console.log($stateParams.id);
            $scope.project = data;
      });
     
    
       
    });