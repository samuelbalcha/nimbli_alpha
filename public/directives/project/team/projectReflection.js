angular.module('nimbliApp').directive('projectReflection', function(AccountService, ProjectService, ReflectionService, VisibilityService, UtilityService, MOODS){
    'use strict';
    
    return {
        restrict : 'E',
        scope : false,
        templateUrl: 'partials/project/reflection/project-reflection.html',
        controller : function($scope, $element){
            $scope.user = AccountService.getCurrentUser();
            $scope.project = ProjectService.getCurrentProject();
            $scope.userRole = ProjectService.getUserProjectRole();
            var theModal;
            var me = AccountService.getMe();
            
            $scope.reflection = {
                content : '',
                visibileTo : [],
                visibililty : null,
                moodObj: { name : '', icon : '' },
                postedBy : $scope.user._id,
                project : $scope.project._id,
                mood : ''
            };
            
            $scope.moods =  Object.keys(MOODS).map(function(mood) {
                return MOODS[mood];
            });
            
            $scope.options = VisibilityService.getOptionsWithIcons($scope.userRole);
               
            getAll();
            
            $scope.createPost = function(){
               $scope.reflection.mood = $scope.reflection.moodObj.name;
               ReflectionService.addReflection($scope.project._id, $scope.reflection).then(function(data){
                  getAll();
               });  
            };
            
            $scope.addPerson = function(id, ele){
                var index = $scope.reflection.visibileTo.indexOf(id);
            
                if(ele.currentTarget.checked === true && index == -1){
                    $scope.reflection.visibileTo.unshift(id);
                }
                else if(ele.currentTarget.checked === false && index > -1){
                    $scope.reflection.visibileTo.splice(index, 1);
                }
            };
            
            /** Modal methods */
            $scope.showModal = function() {
                theModal.$promise.then(theModal.show);
            };
            
            $scope.closeModal = function(){
                theModal.$promise.then(theModal.hide);  
            };
            
            $scope.confirm = function(){
                $scope.closeModal();
            };
            
            $scope.customizeClick = function(option){
                $scope.reflection.visibileTo = [];
                $scope.project.people = VisibilityService.getVisibileTo(option.name, $scope.project,$scope.userRole, me);
                $scope.project.people.map(function(per){
                    $scope.reflection.visibileTo.push(per._id);
                });
                
                if(option.name === 'customize'){
                    var index = VisibilityService.getIndex($scope.project.people, me._id);
                    $scope.project.people.splice(index, 1);
                    var template = 'partials/modal/modal-post-visibility-customizer.html';
                    theModal = UtilityService.getDialog($scope, template);
                }
            };
            
            function getAll(){
                $scope.reflection.content = '';
                $scope.reflection.visibililty = $scope.options[0].name;
                $scope.reflection.mood = $scope.moods[0];
                ReflectionService.getReflections($scope.project._id, $scope.userRole).then(function(response){
                    $scope.posts = response.data;
                });
            }
        }
    };
});