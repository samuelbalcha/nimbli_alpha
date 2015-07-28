'use strict';

angular.module('nimbliApp').factory('NotificationService', function($rootScope){
    
    return {
        publish : function(name, value){
            $rootScope.$broadcast(name, value);
        }
    };
});