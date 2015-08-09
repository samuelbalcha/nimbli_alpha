'use strict';

angular.module('nimbliApp')
    .controller('UserDetailCtrl', function($scope, $stateParams, AccountService, Upload, NotificationService, $state)
{
    $scope.user = {};
    $scope.editMode = false;
    $scope.edit = edit;
    $scope.save = save;
    $scope.isOwner = false;
    $scope.cancel = cancel;
     var activeUser;
    
    load();
    
    function load(){
       activeUser = AccountService.getActiveUser();
       if(!activeUser || (activeUser.user._id !== $stateParams.id)){
            AccountService.getUser($stateParams.id).then(function(data){
                AccountService.setActiveUser(data);
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
                        //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        
                    }).error(function (data, status, headers, config) {
                        
                    });
                }
            }
    };
    
    function fillData(data){
        $scope.user = data.user;
     
        var currentUser = AccountService.getCurrentUser();
        if(currentUser && ($stateParams.id === currentUser._id)){
            $scope.isOwner = true;
        }
        
        NotificationService.publish('userDetailCtrlReady', data);
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
        AccountService.setActiveUser(null);
        $scope.editMode = false;
        $state.reload();
    }
   
    function cancel(){
        $scope.editMode = false;
        $scope.file = null;
    }
    
});