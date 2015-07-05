'use strict';

angular.module('nimbliApp')
    .controller('ProjectCtrl', function($scope, $auth, $http)
    {
        // Create New Project
        $scope.project =  {
            title : '',
            company : '',
            coverPicture: 'http://placehold.it/1250x250',
            description : '',
            location : '',
            url : ''
        };

       $scope.editMode = false;

       $scope.save = function(){
           $http.post('/api/projects', { project : $scope.project });
       };
    // create ProjectService and do all the querying there
       $scope.projects = $http.get('/api/projects/')
                                   .success(function(data){

                                   })
                                   .error(function(err){

                                   });

    });