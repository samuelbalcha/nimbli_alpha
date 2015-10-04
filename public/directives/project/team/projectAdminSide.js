angular.module('nimbliApp').directive('adminSide', function(ProjectService, Upload){
    
    return {
        restrict : 'E',
        scope : false,
        templateUrl: 'partials/project/team/project-admin-side.html',
        controller: function($scope, $element){
            $scope.save = function(){
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
                            $scope.refresh(); 
                        }).error(function (data, status, headers, config) {
                            console.log('error status: ' + status);
                            // show modal
                        });
                    }
                    
                    $scope.editMode = false;
                    $scope.refresh(); 
                });
            };
       }
    };
});