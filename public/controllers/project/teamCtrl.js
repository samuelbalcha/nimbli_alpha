'use strict';
angular.module('nimbliApp').controller('TeamCtrl', function($scope){
    
    $scope.name = "Team";
    
     $scope.$on('notifyTabClicked', function(event, args) {
       console.log("tab is team" , args);
       //load();
    })
});