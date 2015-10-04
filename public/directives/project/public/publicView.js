angular.module('nimbliApp').directive('publicView', function(){
    
    var frameTpl = 'partials/project/public/tabviews/frame.html';
    var processTpl = 'partials/project/public/tabviews/process.html';
    var outcomeTpl = 'partials/project/public/tabviews/outcome.html';

    return {
        restrict : 'E',
        templateUrl: 'partials/project/public/project-public-view.html',
        controller : function($scope, $element){
       
            $scope.tabs = [ 
                            { heading : 'Frame' , content : frameTpl, id : 'tabFrame', icon : 'mdi-device-brightness-auto' },
                            { heading : 'Process' , content : processTpl, id : 'tabProcess', icon : 'mdi-device-brightness-low'},
                            { heading : 'Outcome' , content : outcomeTpl, id : 'tabOutcome', icon : 'mdi-device-data-usage'}
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