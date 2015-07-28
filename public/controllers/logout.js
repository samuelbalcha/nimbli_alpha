angular.module('nimbliApp')
    .controller('LogoutCtrl', function($auth, $alert, store, AccountService) {
        if (!$auth.isAuthenticated()) {
            return;
        }
        $auth.logout()
            .then(function() {
                store.remove('currentUser');
                AccountService.setCurrentUserAndRoles(null);
                $alert({
                    content: 'You have been logged out',
                    animation: 'fadeZoomFadeDown',
                    type: 'material',
                    duration: 3
                });
            });
    });
    
    