angular.module('nimbliApp').service('ProjectWallService', function($http, $q, USER_ROLES, POST_VISIBILITY){
    'use strict';
    
    return {
        
        getVisibilityByRole : function(role){
           
            switch (role) {
                case USER_ROLES.anonymous:
                   return POST_VISIBILITY.toPublic;
                case USER_ROLES.owner: 
                case USER_ROLES.supervisor:
                    return POST_VISIBILITY.toConnection;
                case USER_ROLES.teamMember:
                    return POST_VISIBILITY.onlyTeam;
                default:
                   return POST_VISIBILITY.toPublic;
            }
        },
        getPosts : function(projectId, role, visibileTo){
            
            return $http({
                            method: 'GET',
                            url :  '/api/projectwall/' + projectId,
                            params: { 
                                role : role, 
                                visibileTo : visibileTo
                            }
                        })
                       .then(function(response){
                           return response.data;
                       },handleError);
        },
        addPost : function(projectId, post){
            return $http.post('/api/projectwall/' + projectId, post).then(function(response){
                return response.data;
            }, handleError)
        }, 
       
    };
    
    
    
    function handleError(err){
        $q.reject(err);
    }
});