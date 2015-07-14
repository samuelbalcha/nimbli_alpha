'use strict';

angular.module('nimbliApp').service('ProjectService', function ($http, $q) {
    
   var url = '/api/projects';
   var currentProject = {};
      
   return ({
       
       getProjects : function (){
           return  $http.get(url).then(handleSuccess, handleError);
        },
        
        getProject : function(id){
            return $http.get(url + '/'+ id).then(handleSuccess, handleError);
        },
        
        createProject : function(project){
           return $http.post(url, project).then(handleSuccess, handleError);
        },
        
        updateProject : function(project){
             log("update project service");
              return $http.put(url, project).then(handleSuccess, handleError);
        },
        
        removeProject : function(id){
            return $http.delete(url + '/' + id).then(handleSuccess, handleError);
        },
        
        getCurrentProject : function(){
            return currentProject;
        }
   });
   
    function handleSuccess(response){
        currentProject = response.data;
        return response.data;
    }
    
    function handleError(err){
        return $q.reject(err);
    }
    
    function log(msg){
       console.log(msg);
    }
    
});