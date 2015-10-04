angular.module('nimbliApp').directive('likertScale', function(ProjectService){
    'use strict';
    
     return {
        restrict: 'AE',
        templateUrl: 'partials/project/team/tabviews/likert-scale.html',
        replace: true,
        scope: {
            ngModel : '=bind',
            name : '@name',
            left: '@left',
            right : '@right',
            fullModel : '=model'
        }
    };
});