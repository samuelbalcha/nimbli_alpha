'use strict';

angular.module('nimbliApp')
    .factory('AccountService', function($q, $http, $auth) {
        var currentUser;
        
        function handleSuccess(response){
            currentUser = response.data;
            return response.data;
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
                   $http.get('/api/access').success(function(data){
                      currentUser = data;
                      deferred.resolve(data);
                   }).error(function(data){
                       deferred.reject("user not logged in");
                   });
                }
                else {
                    deferred.resolve(currentUser);
                }
                
               return deferred.promise;
            }
            /**
            getUserRoles : function(){
                var deferred = $q.defer();
                $http.get('/api/access').success(function(data){
                    this.setCurrentUserAndRoles(data);
                    deferred.resolve(data);
                });
                return deferred.promise;
            },
            */,
            
            //nullify when logout
            setCurrentUserAndRoles : function(user){
                currentUser = user;
            },
            getCurrentUser : function(){
                return currentUser;
            }
            
        };
        
        
    });