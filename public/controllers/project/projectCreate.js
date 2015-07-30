'use strict';

angular.module('nimbliApp')
    .controller('ProjectCreateCtrl',  function($scope, $http, $location, AccountService, ProjectService)
    {
       $scope.project =  {
            title : '',
            company : '',
            coverPicture: 'http://placehold.it/1250x250',
            description : '',
            location : '',
            url : ''
       };

       $scope.create = createProject;
       $scope.status = '';
       $scope.cancel = cancel;
     
       function createProject(){
           ProjectService.createProject($scope.project).then(function(currentProject){
              $location.path('/projects/' + currentProject._id);
           }); 
       }
      
       function cancel(){
          $scope.editMode = false;
          $location.path('/projects');
       }
});