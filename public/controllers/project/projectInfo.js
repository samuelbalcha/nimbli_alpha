angular.module('nimbliApp')
    .controller('ProjectInfoCtrl',  function($scope, ProjectService, AccountService, USER_ROLES)
    {
        'use strict';
        
        $scope.project = {};
        $scope.canEdit = false;
        $scope.load = load;
        $scope.edit = edit;
        $scope.save = save;
        $scope.cancel = cancel;
        $scope.editMode = false;
        $scope.userRole;
        
        $scope.$on('userProjectRoleReady', function(evt, role){
            load();
        });
        
        function load(){
           $scope.project = ProjectService.getCurrentProject();
           console.log(ProjectService.getUserProjectRole(), "contr");
           $scope.canEdit = (ProjectService.getUserProjectRole() === USER_ROLES.owner);
        }
        
        function edit(){
            $scope.editMode = true;
        }
        
        function save(){
            ProjectService.updateProject($scope.project).then(function(project){
                $scope.editMode = false;
            });
        }
        
        function cancel(){
            $scope.editMode = false;
        } 
    });