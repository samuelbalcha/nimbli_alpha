'use strict';

angular.module('nimbliApp').controller('BriefCtrl', function($scope, ProjectService){
   
   $scope.brief = {};
   $scope.save = saveBrief;
   $scope.editMode = false;
   $scope.cancel = cancel;
   
   load();
   
   function load(){
       var project  = ProjectService.getCurrentProject();
       $scope.brief = project.brief;
       
       if(!$scope.brief.briefCreatedByUser){
          $scope.editMode = true;
       }
   }
   
   function saveBrief(){
      ProjectService.saveBrief($scope.brief);       
   }
      
   function cancel(){
      $scope.editMode = false;
   }
      
    
  
   
});