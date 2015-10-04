angular.module('nimbliApp').controller('MyReflectionsCtrl', function($scope, ProjectService, ReflectionService, NotificationService){
    'use strict';
    
    $scope.project = ProjectService.getCurrentProject();
    $scope.userRole = ProjectService.getUserProjectRole();
    
    $scope.$on('reflectionAdded', function(data){
        console.log(data);
        $scope.posts.unshift(data);
    });
    
    getAll();
    
    function getAll(){
      
        ReflectionService.getReflections($scope.project._id, $scope.userRole).then(function(response){
            $scope.posts = response.data;
        });
    }
});