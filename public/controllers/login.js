angular.module('nimbliApp')
       .controller('LoginCtrl', function($scope, $alert, $auth, AccountService)
    {
        
        $scope.login = function(theModal) {
            $auth.login({ email: $scope.email, password: $scope.password })
                .then(function() {
                    theModal.closeModal();
                    AccountService.getProfile().then(function(user){
                        AccountService.setCurrentUserFull(user);
                        // $location.path('/users/' + user._id);
                    });
                })
                .catch(function(response) {

                    $alert({
                        content: response.data.message,
                        animation: 'fadeZoomFadeUp',
                        type: 'info',
                        duration: 3
                    });

                });
        };
        
        $scope.authenticate = function(provider, theModal) {
           
            $auth.authenticate(provider)
                .then(function() {
                   
                    theModal.closeModal();
                    AccountService.getProfile().then(function(user){
                          AccountService.setCurrentUserFull(user);
                        // $location.path('/users/' + user._id);
                    });
                })
                .catch(function(response) {

                    /**
                    $alert({
                        content: response.data ? response.data.message : response,
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                     */
                });
        };
    });