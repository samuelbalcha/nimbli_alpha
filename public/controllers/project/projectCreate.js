angular.module('nimbliApp')
    .controller('ProjectCreateCtrl',  function($scope, $http, $location, AccountService, ProjectService, Upload, UtilityService, DriveService)
{
    'use strict';
    
    $scope.project =  {
        title : '',
        company : '',
        coverPicture: '',
        description : '',
        location : '',
        url : '',
        visibileTo :  null,
        school :'', 
        drive : {  }
    };
    
    $scope.googleDrive = {
        name : '',
        created : false
    };
    
    $scope.$watch('file', function () {
         console.log($scope.file);
    });
    
    $scope.create = createProject;
    $scope.status = '';
    $scope.cancel = cancel;
    $scope.options = ['Public', 'Private'];
    $scope.project.visibileTo = $scope.options[0];

    var theModal;
    
    $scope.upload = function (files, id) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/api/projects/' + id + '/cover',
                    file: file,
                    method: 'PUT'
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    $location.path('/projects/' + $scope.project._id);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
            }
        }
    };
    
    function createProject(){
        ProjectService.createProject($scope.project).then(function(currentProject){
            $scope.project = currentProject;
            if($scope.file !== undefined){ 
                $scope.upload([$scope.file], currentProject._id);
            }
            else{
                $location.path('/projects/' + $scope.project._id);
            }
        }); 
    }
    
    function cancel(){
        $scope.editMode = false;
        $location.path('/projects');
    }
    
    $scope.driveDialog = function(){
        var template = 'partials/modal/modal-create-drive-folder.html';
        theModal = UtilityService.getDialog($scope, template);
    };
    
    $scope.showModal = function() {
        theModal.$promise.then(theModal.show);
    };
    
    $scope.closeModal = function(){
        theModal.$promise.then(theModal.hide);
    };
    
    $scope.createDriveFolder = function(){
       
        DriveService.init().then(function(){
            DriveService.createProjectFolder($scope.googleDrive.name, function(folder){
                if(folder && folder.id){
                    $scope.project.drive = {
                        folderId : folder.id,
                        owner : folder.ownerNames[0],
                        dateCreated : folder.createdDate,
                        link : folder.alternateLink.replace('&usp=drivesdk', '')
                    };
                    $scope.googleDrive.created = true;
                    $scope.closeModal();
                }
            });
        });
    };
});