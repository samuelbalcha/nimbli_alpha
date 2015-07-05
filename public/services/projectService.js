'use strict';

angular.module('nimbliApp').service('projectService', function ($http, $q) {
    
    function handleSuccess(response){
        return response.data;
    };
    
    function handleError(err){
        return $q.reject(err);
    };
    
   return ({
       listProjects : function (){
           return  $http.get('/api/projects').then(handleSuccess, handleError);
        },
        
        viewProject : function(id){
            return $http.get('/api/projects/' + id).then(handleSuccess, handleError);
        },
        
        createProject : function(project){
           return $http.post('/api/projects', { project : project }).then(handleSuccess, handleError);
        },
        
        updateProject : function(project){
              return $http.put('/api/projects', { project : project }).then(handleSuccess, handleError);
        },
        
        removeProject : function(id){
            return $http.delete('/api/projects/' + id).then(handleSuccess, handleError);
        },
   });
   
    
});