'use strict';

angular.module('nimbliApp')
    .factory('AccountService', function($q, $http) {
        var currentUser;
        
        return {
            getProfile: function() {
                return $http.get('/api/me');
            },
            updateProfile: function(profileData) {
                return $http.put('/api/me', profileData);
            },
            currentUser : function(){
                return currentUser;
            },
            getUserRoles : function(){
                var defer = $q.defer();
                
                $http.get('/api/access').success(function(data, status) { 
                      defer.resolve();
                }).error(function(err){
                      defer.reject(err);
                });
                
                return defer.promise;   
            },
            setCurrentUserAndRoles : function(user){
                currentUser = user;
            }
        };
    });