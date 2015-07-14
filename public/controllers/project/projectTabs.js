'use strict';

angular.module('nimbliApp').controller('ProjectTabsCtrl', function ($scope, ProjectService, AccountService) {
  
  //$scope.canView = false;
  var templates = [];
  
  var briefTemplate = 'partials/project/templates/brief.tpl.html';
  var teamTemplate = 'partials/project/templates/teamspace.tpl.html';
  var processTemplate = 'partials/project/templates/process.tpl.html';
  
   var user = AccountService.getCurrentUser();
   console.log(user);
   templates = [briefTemplate, teamTemplate, processTemplate];
   
   $scope.tabs = [
                    { heading : 'Brief' , content : 'partials/project/templates/brief.tpl.html'},
                    { heading : 'Team Space' , content : 'partials/project/templates/teamspace.tpl.html'},
                    { heading : 'Process' , content : 'partials/project/templates/process.tpl.html'}
                ];
    
   // $scope.tabs = { heading : 'Tab 1' , content : 'This is where we place the brief'};
    
   $scope.currentTab = 'partials/project/templates/brief.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.content;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
});