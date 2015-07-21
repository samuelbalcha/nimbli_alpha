'use strict';

angular.module('nimbliApp').controller('UserTabsCtrl', function ($scope, AccountService, ProjectService, USER_ROLES) {
  
    var templates = [];
    var projectsTemplate = 'partials/user/projects.tpl.html';
    var contributionsTemplate = 'partials/user/contributions.tpl.html';
  //var processTemplate = 'partials/project/templates/process.tpl.html';
  
    var user = AccountService.getCurrentUser();
  
    
    templates = [ projectsTemplate, contributionsTemplate];
    $scope.tabs = [
                { heading : 'Projects' , content : projectsTemplate, id : 'tabProject' },
                { heading : 'Contributions' , content : contributionsTemplate, id : 'tabContributions' }
            ];
    
    $scope.status = false;  
    $scope.currentTab = projectsTemplate;
   
    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.content;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
});