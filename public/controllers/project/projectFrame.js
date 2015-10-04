angular.module('nimbliApp').controller('ProjectFrameCtrl', function($scope, toaster, ProjectService, UtilityService, NotificationService, MethodCardService, smoothScroll, spinnerService){
   'use strict';
   var theModal, spinnerName, template;
   var aboutProject = [];
   var aboutOrganization = [];
   var aboutTeam = [];
   
   $scope.frameCards = [
      {  id: '1', title: 'About Project', src: "../images/project/frame/project", 
         content : 'about',description : 'Tools to help you frame the project', 
         items : aboutProject
      },
      {  id: '2', title: 'About Team', src: "../images/project/frame/team", 
         content : 'team', items : aboutTeam, description : 'Tools to help you set team vision'
      },
      {  id: '3', title: 'About Organization', src: "../images/project/frame/organization", 
         content : 'organization', items : aboutOrganization, description : 'Tools to help you communicate about your organization'
      },
    
       {  id: '4', title: 'Planning', src: "../images/project/frame/plan", 
         content : 'team', items : [], description : 'Tools to help you set team vision'
      }
   ];
   
   init();
   
   function init(){
      MethodCardService.getFramingCards().then(function(response){
          $scope.framemethods = response.data;
          $scope.framemethods.map(function(methodCard){
             var frame;
             if(methodCard.subType === 'aboutproject'){
                frame = { name : methodCard.name, icon : '../images/project/frame/aboutProject/' + methodCard.name ,  model : methodCard };
                aboutProject.push(frame);
             }
             if(methodCard.subType === 'team'){
                frame = { name : methodCard.name, icon : '../images/project/frame/team/' + methodCard.name ,  model : methodCard };
                aboutTeam.push(frame);
             }
          });
       }, function(err){
           console.log(err);
       });
       
        $scope.aboutProjectCards = [];
        $scope.aboutOrganizationCards = [];
        $scope.aboutTeamCards = [];
   
        $scope.project = ProjectService.getCurrentProject();
        $scope.project.methodCards.map(function(card){
           if(card.subType === 'aboutproject'){
               $scope.aboutProjectCards.push(card);
           }
           if(card.subType === 'aboutorganization'){
               $scope.aboutOrganizationCards.push(card);
           }
           if(card.subType === 'team'){
               $scope.aboutTeamCards.push(card);
           }
        });    
   }
   
   $scope.addCard = function(card){
      var exists = false;
      for(var i= 0; i < $scope.project.methodCards.length; i++){
         if($scope.project.methodCards[i].name === card.name){
             $scope.scroll(card.name);
             exists = true;
             return
         }
      }
      if(!exists){
         
         if(card.name ==='effort'){
             $scope.effortEditMode = true;
             card.likertEdit = true;
         }else { 
            card.openEditor = true; 
         }
         
         $scope.project.methodCards.push(card);
         setTimeout(function(){
            $scope.scroll(card.name);
         }, 100);
      }
     
   };
   
   $scope.scroll = function(name){
 
      var element = document.getElementById(name);
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
      $scope.closeModal();
   };
   
   $scope.effortEditMode = false;
   
   $scope.editEffort = function(card){
       if(!$scope.effortEditMode){
          $scope.effortEditMode = true;
          card.likertEdit = true;
       }
   };
   
   $scope.cancelEffort = function(model){
     
      model.likertEdit = false;
      $scope.effortEditMode = false;
      MethodCardService.getCard(model._id).then(function(response){
         console.log(response.data);
      }, function(err){
         console.log(err);
      });
     
   };
   
   $scope.createCard = function(card){
      card.model.project = $scope.project._id;
     
      MethodCardService.createFramingCard(card.model).then(function(response){
          NotificationService.publish('savingDone', card.model);
      }, function(err){
          showAlert("Creating " + card.name, err.message, 'error');
      }).finally(function(){
         spinnerService.hide(spinnerName);
      });
     
   };
   
   $scope.update = function(model){
     
      spinnerName = model.name+ 'Spinner';
      spinnerService.show(spinnerName);
      
      if(model.project){
          setTimeout(function() {
            MethodCardService.updateFramingCard(model).then(function(response){
               if(model.name ==='effort'){
                  $scope.effortEditMode = false;
                  model.likertEdit = false;
               }
               else{
                  NotificationService.publish('savingDone', model);
               }
            }, function(err){
                  showAlert("Updating " + model.name, err.message, 'error');
            }).finally(function(){
                  spinnerService.hide(spinnerName);
            });
          }, 1500);
      }
      else{
         $scope.createCard(model);
      }
   };
   
   $scope.openCard = function(card){
      template = 'partials/modal/frame/' + card.template;
      $scope.frameModel = card.model;
      theModal = UtilityService.getDialog($scope, template, 'lg');
   };
   
   $scope.removeCard = function(card){
      template = 'partials/modal/modal-delete-confirm.tpl.html';
      $scope.item = card;
      $scope.deleteTitle = "You are about to delete "+ card.name;
      $scope.deleteDisabled = false;
      theModal = UtilityService.getDialog($scope, template, 'sm');
   };
   
   $scope.deleteConfirmed = function(item){
      var index = $scope.project.methodCards.indexOf(item);
                
       spinnerService.show('deleteSpinner');
       setTimeout(function() {
         if(!item.project){
            $scope.project.methodCards.splice(index, 1);
            $scope.closeModal();
            spinnerService.hide('deleteSpinner');
         }  
         else{
               MethodCardService.removeCard(item._id).then(function(response){
                  if(response.data === "OK"){
                     $scope.project.methodCards.splice(index, 1);
                     $scope.deleteTitle = "The have removed the card";
                     $scope.deleteDisabled = true;
                     
                     setTimeout(function(){
                        $scope.closeModal();
                     }, 1500);
                  }
               }, function(err){
                  $scope.closeModal();
                  showAlert("Deleting card", err.message, 'error');
               }).finally(function(){
                  spinnerService.hide('deleteSpinner');
               });
         }
           
       }, 1500);
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
   
   function showAlert(title, message, type){
          toaster.pop({
            type: type,
            body: message,
            title : title,
            showCloseButton: true,
            timeout : 1500
         });
   }
   
   $scope.addmileStone = function(card){
      var milestone = { title : '', date : new Date(), status : '' ,  
                           visibileTo : { value : 0 , name : 'Public' } };
       card.model.items.push(milestone);
   };
   
});