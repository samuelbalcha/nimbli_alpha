angular.module('nimbliApp')
    .controller('ProjectOwnerCtrl',  function($scope, ProjectService, AccountService, USER_ROLES, Upload)
    {
        'use strict';
       $scope.currentProject;
       $scope.projectRequests = [];
       $scope.load = load;
       
       $scope.load();
       
        function load(){
            $scope.currentProject = ProjectService.getCurrentProject();
            AccountService.getProjectRequests($scope.currentProject._id).then(function(response){
                 $scope.projectRequests = response.data;
            });
        }
    });