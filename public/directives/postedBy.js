angular.module('nimbliApp').directive('postedBy', function(){
    
    return {
        restrict : 'EA',
        scope: {
            user :"="
        },
        templateUrl: 'partials/project/posted-by.html',
        controller : function($scope){
           
            $scope.name = $scope.user.displayName.substring(0, 1);
            $scope.avatar = $scope.user.avatar;
            $scope.hasImg = ($scope.user.avatar !== null);
        }
    };
});