'use strict';

angular.module('nimbliApp')
    .factory('AccountService', function($q, $http, $auth, store, $rootScope) {
        var currentUser;
        
        function handleSuccess(response){
            currentUser = response.data;
            store.set('currentUser', currentUser);
            $rootScope.$broadcast('currentUserUpdated', currentUser);
            return currentUser;
        }
    
        function handleError(err){
            return $q.reject(err);
        }
        
        return {
            getProfile: function() {
                return $http.get('/api/me').then(handleSuccess, handleError);
            },
            updateProfile: function(profileData) {
                return $http.put('/api/me', profileData).then(handleSuccess, handleError);
            },
            getUserAccess : function(){
                
                var isAuthen = $auth.isAuthenticated();
                var deferred = $q.defer();
                
                if(currentUser === undefined && isAuthen){
                    currentUser = store.get('currentUser');
                    if(currentUser === undefined || currentUser === null){
                        return $http.get('/api/access').then(handleSuccess, handleError);
                    }
                }
              
               deferred.resolve(currentUser);
               return deferred.promise;
            },
           
            //nullify when logout
            setCurrentUserAndRoles : function(user){
                currentUser = user;
                store.set('currentUser', user);
            },
            getCurrentUser : function(){
                if (!currentUser) {
                    currentUser = store.get('currentUser');
                }
                return currentUser;  
            },
            getUser : function(id){
                var deferred = $q.defer();
                $http.get('/api/users/'+ id).success(function(data){
                    deferred.resolve(data);
                }).error(function(data){
                    deferred.reject("user was not found");
                });
                return deferred.promise;
            },
            isUserAuthenticated : function(){
                return $auth.isAuthenticated();
            }
            
        };
        
        
    });