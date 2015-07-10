'use strict';

angular.module('nimbliApp')
    .factory('AccountService', function($q, $http, $auth) {
        var currentUser;
        
        return {
            getProfile: function() {
                return $http.get('/api/me');
            },
            updateProfile: function(profileData) {
                return $http.put('/api/me', profileData);
            },
            currentUser : function(){
                
                var isAuthen = $auth.isAuthenticated();
                var deferred = $q.defer();
                
                if(currentUser === undefined && isAuthen){
                   
                     $http.get('/api/access').success(function(data){
                         deferred.resolve(data);
                         console.log("in success");
                     });
                     console.log("outside");
                    return deferred.promise;
                }
                else {
                    deferred.reject("user not logged in");
                    return deferred.promise;
                }
            },
            getUserRoles : function(){
                var deferred = $q.defer();
                $http.get('/api/access').success(function(data){
                    this.setCurrentUserAndRoles(data);
                    deferred.resolve(data);
                });
                return deferred.promise;
            },
            setCurrentUserAndRoles : function(user){
                currentUser = user;
            }
        };
    });