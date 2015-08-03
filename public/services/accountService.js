angular.module('nimbliApp')
    .factory('AccountService', function($q, $http, $auth, store, NotificationService) {
       'use strict';
       
        var currentUser;
        
        return {
            getProfile: function() {
                return $http.get('/api/me').then(handleSuccess, handleError);
            },
            updateProfile: function(profileData) {
                return $http.put('/api/me', profileData).then(handleSuccess, handleError);
            },
            setCurrentUser : function(user){
                currentUser = user;
                notifyOthers();
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
            getProjectRequest : function(id){
                 return $http.get('/api/projectrequest/'+ id + '/' + currentUser._id);
            },
            
            getProjectRequests: function(id){
                  return $http.get('/api/projectrequests/'+ id + '/' + currentUser._id);
            }
            
        };
         
        function handleSuccess(response){
            currentUser = response.data;
            notifyOthers();
            return currentUser;
        }
        
        function handleError(err){
            return $q.reject(err);
        }
        
        function notifyOthers(){
            store.set('currentUser', currentUser);
            NotificationService.publish('currentUserUpdated', currentUser);
        }
});