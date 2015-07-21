'use strict';

angular.module('nimbliApp').factory('UtilityService', function($rootScope){
     var isOwner;
     
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
          notifyTabClick : function(tab){
               $rootScope.$broadcast('notifyTabClicked', tab);
          }
          
        
        
     });
    
});