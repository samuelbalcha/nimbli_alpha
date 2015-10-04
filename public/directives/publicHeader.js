angular.module('nimbliApp').directive('publicHeader', function(){
    
    return {
        restrict : 'E',
        scope : false,
        templateUrl: 'partials/project/project-public-header.html'
    };
});