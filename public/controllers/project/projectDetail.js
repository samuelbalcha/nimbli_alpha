angular.module('nimbliApp')
    .controller('ProjectDetailCtrl', function ($scope, $stateParams, $location, ProjectService, AccountService, UtilityService, USER_ROLES, $modal, store)
{
    'use strict';       
    
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
    $scope.applyToProject = applyToProject;
    var template, theModal;    
    $scope.projectStatus = [ { name : 'Private', value : 0 },
                             { name : 'Published', value : 1 },
                             { name : 'Started', value : 2 },
                             { name : 'InProgress', value : 3 },
                             { name : 'Completed', value : 4 },
                             { name : 'Accepted', value : 5 }
                           ];
                           
    $scope.selectedItem = null;
    
    // ProjectRequest setup
    $scope.projectRoles = [{ name : 'Team member', value : 0 }, { name : 'Supervisor', value : 1 }];
    $scope.selectedRoleItem = { value : 0 };
    $scope.projectRequest = {
        role : 0,
        note : '',
        status : '',
        user : null
    };
    $scope.roleChanged = roleChanged;
    $scope.sendApplication = sendApplication;
    $scope.applyBtn = false;
    $scope.applyBtnText = '';
   
    detailProject();
    
    function detailProject(){
        ProjectService.getProject($stateParams.id).then(handleSuccess); 
    }
    
    function edit(){
        $scope.editMode = true;
        $scope.selectedItem = $scope.getSelection();
    }

    function deleteProject(){
    
        template = 'partials/modal/modal-delete-confirm.tpl.html';
        $scope.deleteTitle = 'Are you sure you want to delete this project?';
        theModal =  $modal({ scope: $scope, template: template, show: true });
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
        detailProject();
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
           setApplyBtn();
       });
    }
    
    function getUserAndCheckAccess(callback){
         var currentUser = AccountService.getCurrentUser();
         setUserAccess(currentUser);
         callback(); 
    }
    
    function setUserAccess(user){
        
        if(user == undefined){
            $scope.userRole = USER_ROLES.anonymous;
            $scope.applyBtn = true;
        }
        else{ 
            if($scope.project.owners.indexOf(user._id)  !== -1 || user._id === $scope.project.createdBy ){
                $scope.isOwner = true;
                $scope.userRole = USER_ROLES.owner;
            }
            else if($scope.project.team.indexOf(user._id) !== -1){
                $scope.userRole = USER_ROLES.teamMember;
            }
           else if($scope.project.supervisors.indexOf(user._id)){
                $scope.userRole = USER_ROLES.supervisor; 
            }
            else{
                $scope.userRole = USER_ROLES.anonymous;
                $scope.applyBtn = true;
            }  
        }
    }
    
    function applyToProject(){
        template = 'partials/modal/modal-send-request.tpl.html';
        $scope.modalPurpose = 'Apply to project';
        $scope.modalTitle = "How do you want to contribute to this project?";
        $scope.selectedRoleItem.value = $scope.projectRequest.role; 
        theModal =  $modal({ scope: $scope, template: template, show: true }); 
    }
    
    $scope.showModal = function() {
        theModal.$promise.then(theModal.show);
    };
    
    $scope.closeModal = function(){
        theModal.$promise.then(theModal.hide);
    };
     
    function roleChanged(ele){
      $scope.projectRequest.role = ele.selectedRoleItem.value; 
      console.log($scope.projectRequest.role);
    }
    
    function sendApplication(){
        // send application
        var user = AccountService.getCurrentUser();
        if(user !== undefined){
           $scope.projectRequest.user = user._id;
           console.log("sendApplication", $scope.projectRequest.role);
           
           ProjectService.sendProjectRequest($scope.projectRequest, user._id).then(function(data){
               $scope.applyBtn =  false;
           });
           //setApplyBtn();
        }
     
        $scope.closeModal();
    }
    
    function setApplyBtn(){
        if($scope.project.projectRequest === undefined || $scope.project.projectRequest.length === 0) {
             $scope.applyBtn = true;
        }
        else if($scope.project.projectRequest.length === 1){
            $scope.applyBtn = false;
            $scope.projectRequest = $scope.project.projectRequest[0];
            if($scope.projectRequest.requestStatus === 0 ){
               $scope.selectedRoleItem.value = $scope.projectRequest.role;
            } 
        }
        else{
           
        }
    }
    
    $scope.showButton = function(role){
        return (role === USER_ROLES.anonymous);
    }
    
   
    
});