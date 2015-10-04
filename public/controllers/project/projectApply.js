angular.module('nimbliApp')
    .controller('ProjectApplyCtrl', function ($scope, $stateParams, ProjectService, AccountService, USER_ROLES, $modal)
{
    'use strict';
    //$scope.load = load;
    $scope.applyClick = applyClick;
    $scope.selectedRoleItem = null;
    $scope.projectRequest = { role : '' , note : ''};
    $scope.sendApplication = sendRequest;
    $scope.canApply = true;
    $scope.roles = ['Team member', 'Supervisor'];
    $scope.projectRequest.role = $scope.roles[0];
    
    var theModal;
  
    load();
   
    $scope.showModal = function() {
        theModal.$promise.then(theModal.show);
    };
    
    $scope.closeModal = function(){
        theModal.$promise.then(theModal.hide);
    };
    
    function load(){
       
        if(AccountService.getCurrentUser()){
              AccountService.getProjectRequest($stateParams.id).then(function(pr){
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
      
        $scope.animationsEnabled = true;
        theModal =  $modal({ scope: $scope, template: template, show: true,  animation: $scope.animationsEnabled }); 
    }
    
    function sendRequest(){
        var currentUser = AccountService.getCurrentUser();
        if(currentUser){
            var pr = {
                senderUser : currentUser._id,
                projectId : $scope.$parent.project._id,
                role : $scope.projectRequest.role,
                note : $scope.projectRequest.note,
                toUser : $scope.$parent.project.createdBy._id
            };   
            console.log(pr);
            ProjectService.sendProjectRequestRequest(pr).then(function(p){
                $scope.projectRequest = p;
                $scope.closeModal();
                $scope.$parent.refresh();
            });
        }
        else {
            $scope.showError = true;
            $scope.saveDisabled = true;
        }
    }
     
});