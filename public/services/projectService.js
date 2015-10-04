angular.module('nimbliApp').service('ProjectService', function ($http, $q, $rootScope, USER_ROLES, NotificationService) {
    'use strict';
    var url = '/api/projects';
    var currentProject;
    var effort;
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
        setUserRole : function(project, currentUser){
            userRole = USER_ROLES.anonymous;
            
            if(!currentUser){
                NotificationService.publish('userProjectRoleReady', userRole);
                return;      
            }
            
            var i; 
            
            if(project.owners){
                for(i = 0; i < project.owners.length; i++ ){
                    if(project.owners[i]._id === currentUser._id){
                        userRole = USER_ROLES.owner; 
                    }
                }
            }
            
            if(project.team){
                for(i = 0; i < project.team.length; i++ ){
                    if(project.team[i]._id === currentUser._id){
                        userRole = USER_ROLES.teamMember; 
                    }
                }
            }
            
            if(project.supervisors){
                for(i = 0; i < project.supervisors.length; i++ ){
                    if(project.supervisors[i]._id === currentUser._id){
                        userRole = USER_ROLES.supervisor;
                    }
                } 
            }
            
            NotificationService.publish('userProjectRoleReady', userRole);
            return userRole;
        },
        updateAboutProject : function(about){
            return $http.put('/api/projects/' + currentProject._id +'/about', about);
        },
        
        sendProjectRequestRequest : function(projectRequest){
            return $http.post('/api/projectrequests', projectRequest).then(function(response){
                return response.data;
            }, function(err){
                $q.reject(err);
            });
        },
        addUserToProject : function(data){
            return $http.put('/api/addusertoproject',  data).then(handleSuccess, handleError);
        },
        getUserProjects : function(userId){
            return $http.get(url + '/user/' + userId).then(function(response) {
                projectCount = response.data.length;
                return response.data;
            }, handleError);
        },
        getProjectCount : function(){
            return projectCount;
        },
        sendProjectRequestResponse : function(projectrequest){
            return $http.put('/api/projectrequest/' + projectrequest._id).then(function(response) {
                return response.data;
            }, handleError);
        },
        removeProjectRequest : function(id){
            return $http.delete('/api/projectrequest/' + id).then(function(response) {
                return response.data;
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
});