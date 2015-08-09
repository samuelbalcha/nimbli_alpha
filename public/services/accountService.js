angular.module('nimbliApp')
    .factory('AccountService', function($q, $http, $auth, store, NotificationService) {
       'use strict';
       
        var currentUser;
        var activeUser;
        
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
                
                return $http.get('/api/users/'+ id).then(function(response){
                   return response.data;
                }, handleError);
            },
            getProjectRequest : function(id){
                 return $http.get('/api/projectrequest/'+ id + '/' + currentUser._id);
            },
            
            getProjectRequests: function(id){
                  return $http.get('/api/projectrequests/'+ id + '/' + currentUser._id);
            },
            setActiveUser : function(user){
                activeUser = user;
            },
            getActiveUser : function(){
                return activeUser;
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