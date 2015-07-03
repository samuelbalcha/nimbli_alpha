'use strict';

angular.module('nimbliApp')
    .controller('ProjectCtrl', function($scope, $auth, $http)
    {
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

    });