'use strict';

angular.module('nimbliApp')
    .controller('ProjectCreateCtrl',  function($scope, $http, $location, AccountService)
    {
       $scope.project =  {
            title : '',
            company : '',
            coverPicture: 'http://placehold.it/1250x250',
            description : '',
            location : '',
            url : ''
       };

       $scope.create = createProject;
       $scope.status = '';
       $scope.cancel = cancel;
     
       function createProject(){
        
           $http({url: '/api/projects', method: "POST", data: $scope.project})
               .success(function (data, status, headers, config) {
                    $scope.project = data.project;
                     // Update user roles
                    AccountService.setCurrentUserAndRoles(data.user);
                    $location.path('/projects/' + data.project._id);
                     
               }).error(function (data, status, headers, config) {
                     $scope.status = status;
                     logErr(data);
               });  
      }
      
      function cancel(){
          console.log("cancel")
          $scope.editMode = false;
          $location.path('/projects');
      }
      
      function logErr(err){
          console.log(err);
      }
});