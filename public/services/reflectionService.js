angular.module('nimbliApp').service('ReflectionService', function($http, $q){
    'use strict';
    var path = '/api/reflections/';
    
    return {
       
        getReflections : function(projectId, role){
            return $http({ 
                url : path + projectId,
                method : 'GET',
                params : { role : role }
            });
        },
        
        addReflection : function(projectId, post){
            return $http.post(path + projectId, post).then(function(response){
                return response.data;
            }, handleError);
        },
        
        removeReflection : function(id){
            return $http.delete(path + id).then(function(response){
                return response;
            }, handleError);
        },
        
        getSharedReflections : function(projectId, userId){
            return $http.get(path + projectId + '/shared').then(function(response){
                return response;
            }, handleError);
        }
    };
    
    function handleError(err){
        $q.reject(err);
    }
});