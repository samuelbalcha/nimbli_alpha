angular.module('nimbliApp').directive('publicNavbar', function($modal){
    
    return {
        restrict : 'E',
        scope : false,
        templateUrl: 'partials/navbar/public-nav.html',
        controller: function($scope, $element){
            var theModal;
            $scope.showModal = function() {
                theModal.$promise.then(theModal.show);
            };
            
            $scope.closeModal = function(){
                theModal.$promise.then(theModal.hide);
            };
            
            $scope.loginClick = function(){
                var template = 'partials/modal/modal-login.html';
                $scope.animationsEnabled = true;
            
                theModal =  $modal({ 
                    scope: $scope, 
                    template: template, 
                    show: true,  
                    animation: $scope.animationsEnabled,
                    size : 'sm'
                }); 
            };

            $scope.signupClick = function(){
                var template = 'partials/modal/modal-signup.html';
                $scope.animationsEnabled = true;
            
                theModal =  $modal({ 
                    scope: $scope, 
                    template: template, 
                    show: true,  
                    animation: $scope.animationsEnabled,
                    size : 'sm'
                }); 
            };
        }
    };
});