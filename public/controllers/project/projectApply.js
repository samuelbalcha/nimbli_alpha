angular.module('nimbliApp')
    .controller('ProjectApplyCtrl', function ($scope, ProjectService, AccountService, USER_ROLES, $modal)
{
    'use strict';
    //$scope.load = load;
    $scope.applyClick = applyClick;
    $scope.projectRoles = [{ name : 'Team member', value : 0 }, { name : 'Supervisor', value : 1 }];
    $scope.selectedRoleItem = null;
    $scope.projectRequest = { role : '' , note : ''};
    $scope.roleChanged = roleChanged;
    $scope.sendApplication = sendRequest;
    $scope.canApply = true;
  
    var theModal;
    var currentUser, currentProject;
    $scope.$on('parentControllerLoaded',function(event, data){
        currentProject = data;
        load(); 
    });
   
    $scope.showModal = function() {
        theModal.$promise.then(theModal.show);
    };
    
    $scope.closeModal = function(){
        theModal.$promise.then(theModal.hide);
    };
    
    function load(){
        currentUser = AccountService.getCurrentUser();
        if(currentUser){
              AccountService.getProjectRequest(currentProject._id).then(function(pr){
                   if(pr){
                        $scope.projectRequest = pr.data[0];
                        $scope.canApply = pr.data.length === 0 ? true : false;    
                   }
              });  
        }
        else{
            $scope.canApply = true;
        }
    }
    
    function applyClick(){
        var template = 'partials/modal/modal-send-request.tpl.html';
        $scope.modalPurpose = 'Apply to project';
        $scope.modalTitle = "How do you want to contribute to this project?";
        $scope.selectedRoleItem = $scope.projectRoles[0];
        $scope.projectRequest = $scope.projectRequest;
        
        theModal =  $modal({ scope: $scope, template: template, show: true }); 
    }
    
    function roleChanged(ele){
        $scope.projectRequest.role = ele.selectedRoleItem.value; 
    }
    
    function sendRequest(){
         
        if(currentUser){
            var pr = {
                senderUser : currentUser._id,
                projectId : $scope.$parent.project._id,
                role : $scope.selectedRoleItem.value,
                note : $scope.projectRequest.note,
                toUser : $scope.$parent.project.createdBy._id
            };   
            
            ProjectService.sendProjectRequestRequest(pr).then(function(p){
                $scope.projectRequest = p;
                $scope.closeModal();
            });
        }
        else {
            $scope.showError = true;
            $scope.saveDisabled = true;
        }
    }
     
});