'use strict';

angular.module('nimbliApp').service('ProjectService', function ($http, $q, $rootScope) {

    var url = '/api/projects';
    var currentProject;
    var currentBrief;
    var currentProjectRequests;
    
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
         
        setProjectStatus : function(status){
            return $http.put(url + '/' + currentProject._id, status).then(function(response){
                            return response.data;
                        }, function(err){
                            $q.reject(err);
                    });
        },
        saveBrief : function(brief){
            return $http.put(url + '/' + currentProject._id + '/brief', brief).then(function(response){
                            return response.data;
                        }, function(err){
                            $q.reject(err);
                    });
        },
        getBrief : function(){
            return currentBrief;
        },
        setBrief : function(br, isOwner){
            currentBrief = br;
            $rootScope.$broadcast('currentBriefChanged', [currentBrief, isOwner]);
        },
        
        sendProjectRequest : function(projectRequest){
            return $http.put(url + '/' + currentProject._id + '/request', projectRequest).then(function(response){
                return response.data;
            }, function(err){
                $q.reject(err);
            });
        },
        
        getProjectRequests : function(id){
            
            return $http.get(url + '/' + id + '/request').then(function(response){
                  currentProjectRequests = response.data;
                return currentProjectRequests;
            }, handleError);
        },
        getCurrentProjectRequests : function(){
            return currentProjectRequests;
        },
        updateProjectRequest : function(id, projectRequest){
            return $http.put(url + '/' + id + '/updaterequest', projectRequest).then(function(response) {
                currentProjectRequests = response.data;
                return currentProjectRequests;
            }, handleError);
        }
        
    });
    
    function handleSuccess(response){
        currentProject = response.data;
        return response.data;
    }
    
    function handleError(err){
        return $q.reject(err);
    }
});