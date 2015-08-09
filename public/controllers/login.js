angular.module('nimbliApp')
       .controller('LoginCtrl', function($scope, $alert, $auth, $location, AccountService)
    {

        $scope.login = function() {
            $auth.login({ email: $scope.email, password: $scope.password })
                .then(function() {
                    $alert({
                        content: 'You have successfully logged in',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                    AccountService.getProfile().then(function(user){
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
        $scope.authenticate = function(provider) {
            $auth.authenticate(provider)
                .then(function() {
                    $alert({
                        content: 'You have successfully logged in',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
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