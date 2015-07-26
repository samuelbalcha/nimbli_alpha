'use strict';
angular.module('nimbliApp').controller('TeamCtrl', function($scope){
    
    $scope.name = "Team";
    $scope.postMessage = postMessage;
     $scope.$on('notifyTabClicked', function(event, args) {
       //console.log("tab is team" , args);
       //load();
    });
    
    
    $scope.messages = [];
    
    $scope.message = '';
    
    function postMessage(){
        var text = $scope.message;
        var sent = Date.now();
        $scope.messages.push({ text : text, sent : sent });
        $scope.message = '';
    }
    
    
});