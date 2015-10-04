angular.module('nimbliApp').directive('publicSide', function(){
    
    return {
        restrict : 'E',
        scope : false,
        templateUrl: 'partials/project/public/project-public-side.html'
    };
});