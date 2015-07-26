'use strict';

angular.module('nimbliApp').factory('UtilityService', function($rootScope){
    
     return ({
         
         isInRole :  function (roles, resId){
               for(var i=0; i < roles.length; i++){ 
                  if(roles[i] === resId){
                     return true;
                  }
               } 
               return false;
          },
          setRole : function(role){
               $rootScope.$broadcast('userRoleReady', role);
          },
          
          notifyTabClick : function(tabAndScope){
               $rootScope.$broadcast('notifyTabClicked', tabAndScope);
          }   
        
     });
    
});