'use strict';

angular.module('nimbliApp').service('ProjectService', function ($http, $q) {
    
   var url = '/api/projects';
   var currentProject;
      
   return ({
       
       getProjects : function (){
           return  $http.get(url).then(handleSuccess, handleError);
        },
        
        getProject : function(id){
              var deferred = $q.defer();
              
               $http.get(url + '/'+ id).success(function(data){
                  currentProject = data;
                  deferred.resolve(data);
               }).error(function(data){
                   deferred.reject("project was not found");
               });
               
               return deferred.promise;
        },
        
        createProject : function(project){
           return $http.post(url, project).then(handleSuccess, handleError);
        },
        
        updateProject : function(project){
             log("update project service");
              return $http.put(url + '/' + project._id, project).then(handleSuccess, handleError);
        },
        
        removeProject : function(id){
            return $http.delete(url + '/' + id).then(handleSuccess, handleError);
        },
        
        getCurrentProject : function(){
            return currentProject;
        },
        setCurrentProject : function(project){
            currentProject = project;
        },
        
        saveBrief : function(brief){
            return $http.put(url + '/' + currentProject._id + '/brief', brief).then(function(response){
                return response.data;
            }, function(err){
                $q.reject(err);
            });
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