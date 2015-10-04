angular.module('nimbliApp').controller('ProjectFrameCtrl', function($scope, ProjectService, VisibilityService, UtilityService ,smoothScroll, NotificationService){
   'use strict';

   $scope.frameCards = [
      {  id: 'c1', title: 'About Project', src: "../images/project_frame/shake_hands.png", 
         content : 'about',description : 'Tools to help you frame the project', 
         items : [
                   { name : 'Description', template : 'modal-about.html', icon : 'mdi-action-description' },
                   { name : 'Effort', template : 'modal-effort.html', icon : 'mdi-action-explore' },
                   { name : 'Scope', template : 'modal-scope.html', icon : 'mdi-action-find-replace' }
                 ] 
      },
      {  id: 'c2', title: 'About Organization', src: "../images/project_frame/project.png", 
         content : 'organization', items : 1, description : 'Tools to help you communicate about your organization'
      },
      {  id: 'c3', title: 'About Team', src: "../images/project_frame/team.png", 
         content : 'team', items : 2, description : 'Tools to help you set team vision'
      }
   ];
   
   var theModal;
   $scope.editDescription, $scope.editObjective;
   
   $scope.scrollTo = function(card){
 
      var element = document.getElementById(card.content);
      var options = {
         duration: 500,
         easing: 'easeInQuad',
         offset: 120,
         callbackBefore: function(element) {
            
         },
         callbackAfter: function(element) {
           
         }
      };
     smoothScroll(element, options);
   };
  
   $scope.cancel = function(model){
      console.log('cancel');
      //$scope.objectiveIsEditable = false;
      //$scope.aboutProject = ProjectService.getCurrentProject().aboutProject;
     // $scope.$apply();
   };
  
   $scope.aboutProject = ProjectService.getCurrentProject().aboutProject;
 
   $scope.save = function(model){
     console.log("fromctrl ",model);
     ProjectService.updateAboutProject(model);
     NotificationService.publish('savingDone', model);
   };
  
   $scope.openCard = function(temp){
      
      var template = 'partials/modal/frame/' + temp;
      theModal = UtilityService.getDialog($scope, template, 'lg');
   };
   
   // Modal events
   $scope.showModal = function() {
        theModal.$promise.then(theModal.show);
   };
    
   $scope.closeModal = function(){
        theModal.$promise.then(theModal.hide);  
   };
    
   $scope.confirm = function(){
       $scope.closeModal();
   };
  
  //events from textarea edit
  $scope.$on('editDescription', function(evt, val){
     $scope.descriptionEdit = val;
  });
  
  $scope.$on('editObjective', function(evt, val){
     $scope.objectiveEdit = val;
  });
  
});