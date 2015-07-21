'use strict';

angular.module('nimbliApp').controller('BriefCtrl', function($scope, ProjectService, UtilityService){

   $scope.save = saveBrief;
   $scope.editMode = false;
   $scope.cancel = cancel;
   $scope.edit = edit;
   $scope.isOwner = $scope.$parent.isOwner;
   $scope.brief = $scope.$parent.brief;
   $scope.editMode = $scope.$parent.editMode;
   
   $scope.$on('currentBriefChanged', function(event, args){
       var brief = args[0];
       $scope.brief = brief;
       $scope.isOwner = args[1];
       load();
   });
   
   function load(){
      if(!$scope.brief.briefCreatedByUser && $scope.isOwner){
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
      //UtilityService.setBriefState()
   }

   var getDateForPicker = function(d){
      var date = new Date(d);
      return new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
   }

});