'use strict';

angular.module('nimbliApp').controller('ProjectTabsCtrl', function ($scope, USER_ROLES, UtilityService) {
  
    var briefTemplate =  { heading : 'Brief', content : 'partials/project/templates/brief.tpl.html', id : 'tabBriefView' };
    var teamTemplate = { heading : 'Team Space', content : 'partials/project/templates/teamspace.tpl.html', id : 'tabTeamView' };
    var processTemplate = { heading : 'Process', content : 'partials/project/templates/process.tpl.html', id : 'tabProcess' };
    var reflectionTemplate = { heading : 'Reflection', content : 'partials/project/templates/reflection.tpl.html', id : 'tabReflection' };
  
    $scope.status = false; //controll notifiction icon 
    $scope.currentTab = briefTemplate.content;
    
    // Brief setup
    $scope.brief = {};
    $scope.isOwner = false;
    $scope.editMode = false;
    
    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.content;
        UtilityService.notifyTabClick($scope.currentTab);
    };
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    };
   
    $scope.$on('userRoleReady', function(evt, role){
         $scope.userRole = role;
         loadTabs();
    });
    
    $scope.$on('currentBriefChanged', function(event, args){
       var brief = args[0];
       $scope.brief = brief;
       $scope.isOwner = args[1];
       if(!$scope.brief.briefCreatedByUser && $scope.isOwner){
            $scope.editMode = true;
       }
   });
   
    function loadTabs(){
      
        switch ($scope.userRole) {
            case USER_ROLES.owner:
                $scope.tabs = [ briefTemplate, teamTemplate, reflectionTemplate,processTemplate];
            break;
            case USER_ROLES.teamMember:
                $scope.tabs = [ briefTemplate, teamTemplate, processTemplate];
            break;
            case USER_ROLES.supervisor:
                $scope.tabs = [ briefTemplate, teamTemplate, processTemplate];
            break;
            default:
                $scope.tabs = [ briefTemplate, processTemplate];
        }
    }
   
});