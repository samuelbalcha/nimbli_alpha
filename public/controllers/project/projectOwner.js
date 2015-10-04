angular.module('nimbliApp')
    .controller('ProjectOwnerCtrl',  function($scope, ProjectService, AccountService, USER_ROLES, $modal, DriveService, $window)
    {
        'use strict';
      
       $scope.currentProject;
       $scope.projectRequests = [];
       $scope.load = load;
       $scope.acceptUser = acceptUser;
       $scope.rejectUser = rejectUser;
       $scope.driveClicked = driveClicked;
       $scope.createFolder = createFolder;
       
       $scope.load();
       
        function load(){
            $scope.currentProject = ProjectService.getCurrentProject();
            AccountService.getProjectRequests($scope.currentProject._id).then(function(response){
                 $scope.projectRequests = response.data;
            });
            
        }
        
        function acceptUser(request){
         
            var r  = { 
                        role : request.role, 
                        userId : request.senderUser, 
                        projectId : request.project,
                        owner : request.toUser
                     };
                     
            ProjectService.addUserToProject(r).then(function(project){
                $scope.currentProject = project;
                ProjectService.sendProjectRequestResponse(request).then(function(pr){
                    // update prlist
                });
            });
        }
        
        function rejectUser(id){
            ProjectService.removeProjectRequest(id);
        } 
     
        function driveClicked(){
           DriveService.init().then(function(data){
              var picker = DriveService.getPicker();
              picker.setVisible(true);
           });
        }
        
        function createFolder(){
           DriveService.init().then(function(data) {
               DriveService.createProjectFolder("top stuff").then(function(res){
                   console.log(res);
               });
           })
        
        }
    });