angular.module('nimbliApp').directive('teamProcessView', function(){
    'use strict';
    
    var frameTpl = 'partials/project/team/tabviews/frame.html';
    var processTpl = 'partials/project/team/tabviews/process.html';
    var outcomeTpl = 'partials/project/team/tabviews/outcome.html';

    return {
        restrict : 'EA',
        scope:false,
        templateUrl: 'partials/project/team/views/project-process-view.html',
        controller : function($scope, $element){
       
            $scope.tabs = [ 
                            { heading : ' Frame' , content : frameTpl, id : 'tabFrame', icon : '../images/process/frame' },
                            { heading : ' Process' , content : processTpl, id : 'tabProcess', icon : '../images/process/process'},
                            { heading : ' Outcome' , content : outcomeTpl, id : 'tabOutcome', icon : '../images/process/outcome'}
                          ];
            
            $scope.currentTab = frameTpl;
            
            $scope.onClickTab = function (tab) {
                $scope.currentTab = tab.content;
            };
            
            $scope.isActiveTab = function(tabUrl) {
                return tabUrl == $scope.currentTab;
            };
        }
    };
    
});