'use strict';

angular.module('nimbliApp').controller('BriefCtrl', function($scope, ProjectService){

   $scope.save = saveBrief;
   $scope.editMode = false;
   $scope.cancel = cancel;
   $scope.edit = edit;

   load();

   function load(){
      var project  = ProjectService.getCurrentProject();
      $scope.brief = project.brief;
      
      if($scope.brief !== undefined && !$scope.brief.briefCreatedByUser){
         $scope.editMode = true;
      }
   }

   function saveBrief(){
      $scope.editMode = false;
      ProjectService.saveBrief($scope.brief).then(function(data){
         $scope.brief = data;
      });
   }

   function cancel(){
      $scope.editMode = false;
      load();
   }

   function edit(){
      $scope.editMode = true;
      $scope.brief.startDate = getDateForPicker($scope.brief.startDate);
      $scope.brief.endDate = getDateForPicker($scope.brief.endDate);
   }

   var getDateForPicker = function(d){
      var date = new Date(d);
      return new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
   }

});