angular.module('nimbliApp').directive('milestoneItem', function(){
    'use strict';
    
     return {
        restrict: 'AE',
        templateUrl: 'partials/project/team/tabviews/milestoneItem.html',
        replace: true,
        scope: {
            ngModel : '=bind',
            title : '@title',
            remove : '&',
            fullModel : '=model'
        },
        controller : function($scope){
         
            $scope.isEditable = $scope.fullModel.openEditor;
            var oldModel = $scope.ngModel;
            
            $scope.edit = function(){
                $scope.isEditable = !$scope.isEditable;
            };
            
            $scope.cancelEdit = function(){
                $scope.ngModel = oldModel;
                $scope.isEditable = false;
            };
            
            $scope.removeMilestoneItem = function(milestoneItem){
                var index = $scope.fullModel.items.indexOf(milestoneItem);
                $scope.fullModel.items.splice(index, 1);
            };
            
            $scope.$on('savingDone', function(evt, data){
               if(data._id === $scope.fullModel._id){
                 $scope.isEditable = false;
               }
            });
        }
    };
});