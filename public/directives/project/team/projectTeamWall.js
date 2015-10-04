angular.module('nimbliApp').directive('teamWall', function(){
    
    return {
        restrict : 'E',
        scope: false,
        templateUrl: 'partials/project/team/project-team-wall.html'
    };
});