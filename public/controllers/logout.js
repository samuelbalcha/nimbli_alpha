angular.module('nimbliApp')
    .controller('LogoutCtrl', function($auth, $alert, AccountService) {
        if (!$auth.isAuthenticated()) {
            return;
        }
        $auth.logout()
            .then(function() {
                $alert({
                    content: 'You have been logged out',
                    animation: 'fadeZoomFadeDown',
                    type: 'material',
                    duration: 3
                });
                
                AccountService.setCurrentUserAndRoles(null);
            });
    });