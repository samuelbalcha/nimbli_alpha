run(function($rootScope, authorizationService, AUTH_EVENTS, AccountService, $auth){
       return $rootScope.$on("$stateChangeStart", function(event, next){
           console.log("making request");
           var authenticator, permissions;
           permissions = (next && next.data) ? next.data.permissions : null;
         
           if($auth.isAuthenticated()){
               console.log("authenticated");
                var user = AccountService.getCurrentUser();
                
                Account.getAccess().success(function(user){
                   
                   authenticator = new authorizationService(user);
                   console.log(authenticator);
                   if ((permissions != null) && !authenticator.canAccess(permissions)) {
                        event.preventDefault();
                        if (!user) {
                            return $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        } else {
                            return $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        }
                   }
               })
           }
       })
});