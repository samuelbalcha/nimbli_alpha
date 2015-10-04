angular.module('nimbliApp').directive('toolBar', function(ProjectService){
    'use strict';
    
     return {
        restrict: 'AE',
        templateUrl: 'partials/project/team/tabviews/toolbar.html',
        replace: true,
        scope: {
            ngModel : '=bind',
            cancel : '&',
            save : '&'
        },
        controller : function($scope, $element){
            $scope.$watch('ngModel.media.file', function(){
               // console.log($scope.ngModel.media.file);
            });
        }
    };
});