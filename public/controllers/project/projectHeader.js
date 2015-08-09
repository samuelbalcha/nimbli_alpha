angular.module('nimbliApp')
    .controller('ProjectHeaderCtrl',  function($scope, $stateParams, ProjectService, AccountService, USER_ROLES, Upload, NotificationService)
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
                $scope.userRole = ProjectService.setUserRole(project, AccountService.getCurrentUser());
                $scope.canEdit = ($scope.userRole === USER_ROLES.owner);
                NotificationService.publish('parentControllerLoaded', project);
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
                    }).success(function (data, status, headers, config) {
                         $scope.editMode = false;
                         $scope.load();
                    }).error(function (data, status, headers, config) {
                        console.log('error status: ' + status);
                        // show modal
                    });
                }
                
                $scope.editMode = false;
                $scope.load();
            });
        }
        
        function cancel(){
            $scope.editMode = false;
            $scope.file = null;
            $scope.load();
        }
        
        
    });