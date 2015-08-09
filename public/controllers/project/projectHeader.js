angular.module('nimbliApp')
    .controller('ProjectHeaderCtrl',  function($scope, $state, $stateParams, ProjectService, AccountService, USER_ROLES, Upload, $location)
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
        $scope.refresh = refresh;
        $scope.userview = userviewClicked;
       
        $scope.load();
        
        function load(){
            
            ProjectService.getProject($stateParams.id).then(function(project){
                $scope.project = project;
                $scope.userRole = ProjectService.setUserRole(project, AccountService.getCurrentUser());
                $scope.canEdit = ($scope.userRole === USER_ROLES.owner);
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
                $scope.refresh(); 
            });
        }
        
        function cancel(){
            $scope.editMode = false;
            $scope.file = null;
            $scope.refresh(); 
        }
        
        function refresh(){
           $state.reload();
        }
        function userviewClicked(user){
            $location.path('/users/' + user.id);
        }
        
    });