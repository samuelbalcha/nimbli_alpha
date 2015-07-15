'use strict';

angular.module('nimbliApp').controller('ProjectTabsCtrl', function ($scope, AccountService, ProjectService, USER_ROLES) {
  
 
  var templates = [];
  
  var briefTemplate = 'partials/project/templates/brief.tpl.html';
  var teamTemplate = 'partials/project/templates/teamspace.tpl.html';
  var processTemplate = 'partials/project/templates/process.tpl.html';
  
   var user = AccountService.getCurrentUser();
  
   if(user.userRole === USER_ROLES.owner){
       templates = [ briefTemplate, teamTemplate, processTemplate];
       
        $scope.tabs = [
                    { heading : 'Brief' , content : briefTemplate, id : 'tabBrief' },
                    { heading : 'Team Space' , content : teamTemplate, id : 'tabTeamSpeace' },
                    { heading : 'Process' , content : processTemplate, id : 'tabProcess' }
                ];
                
        
    }
    
    $scope.status = false; //controll notifiction icon 
    $scope.currentTab = briefTemplate;
   
    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.content;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
    
});