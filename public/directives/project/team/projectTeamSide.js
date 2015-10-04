angular.module('nimbliApp').directive('teamSide', function($modal){
    
    return {
        restrict : 'E',
        scope: false,
        templateUrl: 'partials/project/team/project-team-side.html',
        
        controller : function($scope, $element){
            var theModal;
            $scope.reflectionClicked = function(){
                var template = 'partials/modal/modal-reflection.html';
                $scope.animationsEnabled = true;
                
                theModal =  $modal({ 
                    scope: $scope, 
                    template: template, 
                    show: true,  
                    animation: $scope.animationsEnabled,
                    size : 'lg'
                }); 
            };
            $scope.showModal = function() {
                theModal.$promise.then(theModal.show);
            };
            
            $scope.closeModal = function(){
                theModal.$promise.then(theModal.hide);
            };
        }
    };
});