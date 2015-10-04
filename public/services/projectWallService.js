angular.module('nimbliApp').service('ProjectWallService', function($http, $q, USER_ROLES, POST_VISIBILITY){
    'use strict';
    var channel;
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
        getPosts : function(projectId){
            return $http.get('/api/projectwall/' + projectId); 
        },
        addPost : function(projectId, post){
            return $http.post('/api/projectwall/' + projectId, post).then(function(response){
                return response.data;
            }, handleError);
        },
        
        removePost : function(id){
            return $http.delete('/api/projectwall/' + id).then(function(response){
                return response;
            }, handleError);
        },
        setWallChannel : function(room){
            channel = room;
        },
        getWallChannel : function(){
            return channel;
        }
    };
    
    function handleError(err){
        $q.reject(err);
    }
});