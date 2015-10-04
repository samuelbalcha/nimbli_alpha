angular.module('nimbliApp').factory('NotificationService', function($rootScope, $q, $http){
    'use strict';
    
    return {
        
        publish : function(name, value){
            $rootScope.$broadcast(name, value);
        },
        
        publishUp : function(name, value){
            $rootScope.$emit(name, value);
        },
        
        getUserNotifications : function(id){
            return $http.get('/api/projectrequest/' + id);
        }
    };
});