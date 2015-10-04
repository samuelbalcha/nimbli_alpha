angular.module('nimbliApp').service('DashboardService', function($http, $q){
    'use strict';
    
    return {
       
        getActivities : function(userId){
            return $http({
                url: '/api/activities/' + userId,
                method : 'GET'
            });
        }
    };
    
  
});