angular.module('nimbliApp').directive('cardtextareaSimple', function(){
    'use strict';
    
     return {
        restrict: 'AE',
        templateUrl: 'partials/project/team/tabviews/cardTextareaSimple.html',
        replace: true,
        scope: {
            ngModel : '=bind',
            title : '@title',
            placeholder : "@placeholder",
            save : '&',
            remove : '&',
            fullModel : '=model',
            cancel : '&'
        },
        controller : function($scope){
             $scope.isEditable = $scope.fullModel.openEditor;
            var oldModel = $scope.ngModel;
            
            $scope.edit = function(){
                $scope.isEditable = !$scope.isEditable;
            };
            
            $scope.$on('savingDone', function(evt, data){
                if(data._id === $scope.fullModel._id){
                   $scope.isEditable = false;
                }
            });
            
             $scope.cancelEdit = function(){
                $scope.ngModel = oldModel;
                $scope.isEditable = false;
            };
        }
    };
});