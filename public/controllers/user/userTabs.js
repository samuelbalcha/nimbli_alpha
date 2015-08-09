angular.module('nimbliApp').controller('UserTabsCtrl', function ($scope, AccountService) {
    'use strict';  
   
    var projectsTemplate = 'partials/user/projects.tpl.html';
    var contributionsTemplate = 'partials/user/contributions.tpl.html';
   
    $scope.$on('userDetailCtrlReady', function(){
        load();
    });
    
    
    function load(){
        $scope.tabs = [
                    { heading : 'Projects' , content : projectsTemplate, id : 'tabProject' },
                    { heading : 'Contributions' , content : contributionsTemplate, id : 'tabContributions' }
                ];
        $scope.currentTab = projectsTemplate;
        
        var data = AccountService.getActiveUser();
        if(data) {
            $scope.ownProjects =  data.contributions[0];
            $scope.teamProjects = data.contributions[1];
            $scope.supervisedProjects = data.contributions[2];
        }
        
    }
    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.content;
    };
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    };
});