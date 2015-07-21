'use strict';

angular.module('nimbliApp')
    .controller('ProjectDetailCtrl', function ($scope, $stateParams, $location, ProjectService, AccountService, UtilityService , USER_ROLES, $modal)
{
        
    $scope.isOwner = false;
    $scope.edit = edit;
    $scope.deleteBtn = deleteProject;
    $scope.publish = publish;
    $scope.editMode = false;
    $scope.save = save;
    $scope.cancel = cancel;
    $scope.statusChanged = statusChanged;
    $scope.detailProject = null;
    $scope.project = null;
    $scope.userRole = USER_ROLES.anonymous;
 
    $scope.projectStatus = [ { name : 'Private', value : 0 },
                             { name : 'Published', value : 1 },
                             { name : 'Started', value : 2 },
                             { name : 'InProgress', value : 3 },
                             { name : 'Completed', value : 4 },
                             { name : 'Accepted', value : 5 }
                           ];
                           
    $scope.selectedItem = null;
   
    detailProject();
    
    function detailProject(){
        ProjectService.getProject($stateParams.id).then(handleSuccess); 
    }
    
    function edit(){
        $scope.editMode = true;
        $scope.selectedItem = $scope.getSelection();
    }

    function deleteProject(){
    
        var template = 'partials/modal/modal-delete-confirm.tpl.html';
        $scope.deleteTitle = 'Are you sure you want to delete this project?';
        var theModal =  $modal({ scope: $scope, template: template, show: true });
        
        $scope.showModal = function() {
            theModal.$promise.then(theModal.show);
        };
    
        $scope.closeModal = function(){
            theModal.$promise.then(theModal.hide);
        };
    }
      
    $scope.deleteConfirmed = function(){
        ProjectService.removeProject($scope.project._id);
        $scope.closeModal();
        $location.path('/projects');
    };
    
    function publish(status){
        console.log("publish" , status);
    }
    
    function save(){
        ProjectService.updateProject($scope.project);
        $scope.editMode = false;
    }
    
    function cancel(){
        $scope.editMode = false;
        $scope.detailProject();
    }
    
    $scope.getSelection = function(){
        for(var i = 0; i < $scope.projectStatus.length; i++){
            if($scope.projectStatus[i].name === $scope.project.status[0]){
                console.log($scope.projectStatus[i]);
                return $scope.projectStatus[i];
            }
        }
    };
    
    function statusChanged(ele){
      $scope.project.status[0] = ele.selectedItem.name;    
    }
    
    function handleSuccess(project){
       $scope.project = project;  
       $scope.brief = project.brief;
       
       getUserAndCheckAccess(function(){
           ProjectService.setBrief($scope.project.brief, $scope.isOwner);
           UtilityService.setRole($scope.userRole);
       });
    }
    
    function getUserAndCheckAccess(callback){
        AccountService.getUserAccess().then(function(user){
            setUserAccess(user);
            callback();
        }); 
    }
    
    function setUserAccess(user){
        
        if(user !== undefined){ 
            if(UtilityService.isInRole(user.roles.owner, $stateParams.id) || user._id === $stateParams.id ){
                $scope.isOwner = true;
                $scope.userRole = USER_ROLES.owner;
            }
            else if(UtilityService.isInRole(user.roles.teamMember, $stateParams.id)){
                $scope.userRole = USER_ROLES.teamMember;
            }
           else if(UtilityService.isInRole(user.roles.supervisor, $stateParams.id)){
                $scope.userRole = USER_ROLES.supervisor; 
            }
            else{
                $scope.userRole = USER_ROLES.anonymous;
            }  
        }
    }
    
});