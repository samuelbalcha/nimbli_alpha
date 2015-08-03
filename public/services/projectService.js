angular.module('nimbliApp').service('ProjectService', function ($http, $q, $rootScope, USER_ROLES, NotificationService) {
    'use strict';
    var url = '/api/projects';
    var currentProject;
    var currentBrief;
    var currentProjectRequests;
    var projectCount = 0;
    var userRole = USER_ROLES.anonymous;
    
    return ({
    
        getProjects : function (){
            return  $http.get(url).then(function(response) {
                projectCount = response.data.length;
                currentProject = null;
                return response.data;
            }, handleError);
        },
        
        getProject : function(id){
            return $http.get(url + '/'+ id).then(handleSuccess, handleError);    
        },
    
        createProject : function(project){
            return $http.post(url, project).then(handleSuccess, handleError);
        },
    
        updateProject : function(project){
            return $http.put(url + '/' + project._id, project).then(handleSuccess, handleError);
        },
    
        removeProject : function(id){
            return $http.delete(url + '/' + id).then(function(){
                currentProject = null;
                return currentProject;
            }, handleError);
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
        getUserProjectRole : function(){
            return userRole;
        },
        
        setUserProjectRole : function(role){
            userRole = role;
            NotificationService.publish('userProjectRoleReady', role);
        }
        /**
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
        },
        */,
        sendProjectRequestRequest : function(projectRequest){
            return $http.post('/api/projectrequests', projectRequest).then(function(response){
                return response.data;
            }, function(err){
                $q.reject(err);
            });
        },
        addUserToProject : function(data){
            return $http.put(url + '/' + data.projectId + '/user/' + data.userId, { role : data.role }).then(handleSuccess, handleError);
        },
        getUserProjects : function(userId){
            return $http.get(url + '/user/' + userId).then(function(response) {
                projectCount = response.data.length;
                return response.data;
            }, handleError);
        },
        getProjectCount : function(){
            return projectCount;
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