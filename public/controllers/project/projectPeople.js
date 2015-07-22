'use strict';
angular.module('nimbliApp').controller('ProjectPeopleCtrl', function($scope, $stateParams, ProjectService){
    
    $scope.projectRequests = [];
    $scope.acceptRequest = acceptRequest;
    $scope.rejectRequest = rejectRequest;
    
    load();
    
     $scope.$on('notifyTabClicked', function(event, args) {
        load();
     });
    
    function load(){
        var prReqs =  ProjectService.getCurrentProjectRequests();
        if(prReqs === undefined || prReqs.length === 0){
             ProjectService.getProjectRequests($stateParams.id).then(function(data){
                 $scope.projectRequests = data;
             }, showError);
        }
        else{
            $scope.projectRequests = prReqs;
        }
    }
       
    function showError(err){
        if(err){
            $scope.errorMessage = " Could not load this page";
        }
    }
    
    function acceptRequest(id){
       
       ProjectService.updateProjectRequest($stateParams.id, { id: id, status : 1}).then(function(data){
           updateView(data);
       });
       
    }
    
    function rejectRequest(id){
       
       ProjectService.updateProjectRequest($stateParams.id, { id: id, status : 2}).then(function(data){
           updateView(data);
       });
    }
    
    function updateView(data){
        for(var i = 0; i < $scope.projectRequests; i++){
            if($scope.projectRequests[i]._id === data._id){
                $scope.projectRequests[i] = data;
                return;
            }
        }
    }
    
    $scope.getRoleName = function(id){
        return (id === 0) ? 'Team member' : 'Supervisor';
    };
   
    $scope.getRequestStatus = function(id){
        switch (id) {
            case 1:
                return 'Accepted';
            case 2:
                return 'Rejected';      
            default:
                return 'Active';
        }
    };
});