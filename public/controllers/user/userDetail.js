'use strict';

angular.module('nimbliApp')
    .controller('UserDetailCtrl', function($scope, $stateParams, AccountService, Upload, NotificationService)
{
    $scope.user = {};
    $scope.editMode = false;
    $scope.edit = edit;
    $scope.save = save;
    $scope.isOwner = false;
    
    $scope.cancel = cancel;
    
    load();
    
    function load(){
       var activeUser = AccountService.getActiveUser();
       if(!activeUser || (activeUser.user._id !== $stateParams.id)){
            AccountService.getUser($stateParams.id).then(function(data){
                console.log(data);
                fillData(data);
               }, function(err){
                   console.log(err);
            });
       }
       else{
           fillData(activeUser);
       }
    }    
    
    $scope.upload = function (files, id) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: '/api/users/avatar/' + id,
                        file: file,
                        method: 'PUT'
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                        //$location.path('/projects/' + $scope.project._id);
                    }).error(function (data, status, headers, config) {
                        console.log('error status: ' + status);
                    });
                }
            }
    };
    
    function fillData(data){
        $scope.user = data.user;
        NotificationService.publish('parentControllerLoaded', data);
      
        AccountService.setActiveUser(data);
        var currentUser = AccountService.getCurrentUser();
        
        if(currentUser && ($stateParams.id === currentUser._id)){
            $scope.isOwner = true;
        }
    }
   
    function edit(){
        $scope.editMode = true;
        $scope.$watch('file', function () {
            console.log($scope.file);
        });
    }
    
    function save(){
        AccountService.updateProfile($scope.user);
        if($scope.file !== undefined){ 
            $scope.upload([$scope.file], $scope.user._id);
        }
        
        $scope.editMode = false;
    }
   
    function cancel(){
        $scope.editMode = false;
        $scope.file = null;
    }
});