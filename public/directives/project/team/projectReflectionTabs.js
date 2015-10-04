angular.module('nimbliApp').directive('reflectionTabs', function(){
    'use strict';
    var myReflections = 'partials/project/reflection/my-reflections.html';
    var sharedReflection = 'partials/project/reflection/shared-reflections.html';
   
    return {
        restrict : 'EA',
        scope:false,
        templateUrl: 'partials/project/reflection/reflection-tabs.html',
        controller : function($scope, $element){
       
            $scope.tabs = [ 
                            { heading : 'Shared' , content : sharedReflection, id : 'tabSharedReflection', icon : 'mdi-device-brightness-auto' },
                            { heading : 'My reflections ' , content : myReflections, id : 'tabMyReflection', icon : 'mdi-device-brightness-low'}
                          ];
            
            $scope.currentTab = sharedReflection;
            
            $scope.onClickTab = function (tab) {
                $scope.currentTab = tab.content;
            };
            
            $scope.isActiveTab = function(tabUrl) {
                return tabUrl == $scope.currentTab;
            };
        }
    };
    
});