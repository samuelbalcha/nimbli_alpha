angular.module('nimbliApp').directive('projectPeople', function(){
    
    return {
        restrict : 'E',
        scope : false,
        templateUrl: 'partials/project/common/project-people.html'
    };
});