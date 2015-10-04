angular.module('nimbliApp').directive('cardTextarea', function(){
    'use strict';
    
     return {
        restrict: 'AE',
        templateUrl: 'partials/project/team/tabviews/cardTextarea.html',
        replace: true,
        scope: {
            ngModel : '=bind',
            title : '@title',
            additional : '@additional',
            placeholder : "@placeholder",
            save : '&',
            remove : '&',
            fullModel : '=model'
        },
        controller : function($scope){
            console.log($scope.fullModel.openEditor);
            $scope.isEditable = $scope.fullModel.openEditor;
            var oldModel = $scope.ngModel;
            
            $scope.image = {
                file : null
            };
            
            $scope.edit = function(){
                $scope.isEditable = !$scope.isEditable;
            };
            
            $scope.cancelEdit = function(){
                $scope.ngModel = oldModel;
                $scope.isEditable = false;
            };
            
            $scope.$on('savingDone', function(evt, data){
               if(data._id === $scope.fullModel._id){
                 $scope.isEditable = false;
               }
            });
        }
    };
});