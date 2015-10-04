angular.module('nimbliApp').controller('SharedReflectionsCtrl', function($scope, ProjectService, ReflectionService, NotificationService){
    'use strict';
    
    $scope.project = ProjectService.getCurrentProject();
    $scope.userRole = ProjectService.getUserProjectRole();
   
    getAll();
    
    function getAll(){
      
        ReflectionService.getSharedReflections($scope.project._id, $scope.userRole).then(function(response){
            $scope.posts = response.data;
        });
    }
});