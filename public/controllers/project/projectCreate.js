angular.module('nimbliApp')
    .controller('ProjectCreateCtrl',  function($scope, $http, $location, AccountService, ProjectService, Upload)
    {
       'use strict';
       
       $scope.project =  {
            title : '',
            company : '',
            coverPicture: '',
            description : '',
            location : '',
            url : ''
       };
       
       $scope.$watch('file', function () {
            console.log($scope.file);
       });
       
       $scope.create = createProject;
       $scope.status = '';
       $scope.cancel = cancel;
       
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
              $scope.upload([$scope.file], currentProject._id);
           }); 
       }
      
       function cancel(){
          $scope.editMode = false;
          $location.path('/projects');
       }
});