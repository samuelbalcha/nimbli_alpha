angular.module('nimbliApp')
    .controller('ProjectHeaderCtrl',  function($scope, $stateParams, ProjectService, AccountService, USER_ROLES, Upload)
    {
        'use strict';
        
        $scope.project = {};
        $scope.canEdit = false;
        $scope.load = load;
        $scope.edit = edit;
        $scope.save = save;
        $scope.cancel = cancel;
        $scope.editMode = false;
        $scope.userRole = USER_ROLES.anonymous;
       
        $scope.load();
        
        function load(){
            ProjectService.getProject($stateParams.id).then(function(project){
                $scope.project = project;
                setUserRole();
                ProjectService.setUserProjectRole($scope.userRole);
            });
        }
        
        function edit(){
            $scope.editMode = true;
            $scope.$watch('file', function () {
                console.log($scope.file);
            });
        }
        
        function save(){
            ProjectService.updateProject($scope.project).then(function(project){
                var path = '/api/projects/' + project._id + '/cover';
                if($scope.file){
                    Upload.upload({
                            url: path,
                            file: $scope.file,
                            method: 'PUT'
                        })
                    .progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                        $scope.editMode = false;
                        $scope.load();
                    }).error(function (data, status, headers, config) {
                        console.log('error status: ' + status);
                    });
                }
            });
        }
        
        function cancel(){
            $scope.editMode = false;
            $scope.file = null;
            $scope.load();
        }
        
        function setUserRole(){
            var currentUser = AccountService.getCurrentUser();
           
            if(!currentUser){
                return;      
            }
            
            var i; 
            for(i = 0; i < $scope.project.owners.length; i++ ){
                if($scope.project.owners[i]._id === currentUser._id){
                    $scope.canEdit = true;
                    $scope.userRole = USER_ROLES.owner;
                    return;
                }
            }
            
            for(i = 0; i < $scope.project.team.length; i++ ){
                if($scope.project.team[i]._id === currentUser._id){
                    $scope.userRole = USER_ROLES.teamMember;
                    return;
                }
            }
            
            for(i = 0; i < $scope.project.supervisors.length; i++ ){
                if($scope.project.supervisors[i]._id === currentUser._id){
                    $scope.userRole = USER_ROLES.supervisor;
                    return;
                }
            } 
        }
    });