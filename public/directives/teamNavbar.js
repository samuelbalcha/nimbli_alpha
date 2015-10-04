angular.module('nimbliApp').directive('teamNavbar', function($location, NotificationService, ProjectService){
    'use strict';
    
    return {
        restrict : 'E',
        scope : false,
        templateUrl: 'partials/navbar/team-nav.html',
        controller: function($scope, $element){
         
            $scope.init = function(id){
                NotificationService.getUserNotifications(id).then(function(response){
                    $scope.notes = response.data;
                });
            };
            
            $scope.goToProfile = function(id){
                $location.path('/users/' + id);
            };
            
            $scope.getNotifications = function(){
                
            };
            
            $scope.acceptUser = function(request){
            
                var r  = { 
                    role : request.role, 
                    userId : request.senderUser, 
                    projectId : request.project,
                    owner : request.toUser,
                    status : 1
                };
                
                ProjectService.addUserToProject(r).then(function(project){
                    $scope.currentProject = project;
                    ProjectService.sendProjectRequestResponse(request).then(function(pr){
                    // update prlist
                    });
                });
            };
            
            $scope.rejectUser = function(id){
                ProjectService.removeProjectRequest(id);
            }; 
        }
    };
});