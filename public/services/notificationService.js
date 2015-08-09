angular.module('nimbliApp').factory('NotificationService', function($rootScope){
    'use strict';
    
    return {
        publish : function(name, value){
            $rootScope.$broadcast(name, value);
        },
        publishUp : function(name, value){
            $rootScope.$emit(name, value);
        }
    };
});