'use strict';

angular.module('nimbliApp').factory('AuthorizationService', ['USER_ROLES', 'AUTH_EVENTS', function(USER_ROLES, AUTH_EVENTS, UtilityService){
 
 
  return function(user){
       
       return {
           
           canAccess : function(resourceId,loginRequired, requiredPermissions){
                    
                    //login required
                    if(user === undefined && loginRequired){
                        return AUTH_EVENTS.notAuthenticated;
                    }
                    
                    //user is owner
                    if((requiredPermissions === USER_ROLES.owner) && user.roles.owner !== undefined){
                        
                         if(UtilityService.isInRole(user.roles.owner, resourceId)){
                                user.userRole = USER_ROLES.owner;
                                return AUTH_EVENTS.authorized;   
                         }
                     }
           
                    //user is teamMember
                    if((requiredPermissions === USER_ROLES.teamMember) && user.roles.teamMember !== undefined){
                        
                        if(UtilityService.isInRole(user.roles.teamMember, resourceId)){
                                user.userRole = USER_ROLES.teamMember;
                                return AUTH_EVENTS.authorized; 
                        } 
                    }
                    
                   //return not authorized
                   return AUTH_EVENTS.notAuthorized;
           }
       };
       
        function isInRole(roles, resId){
          for(var i=0; i < roles.length; i++){ 
             if(roles[i] === resId){
                return AUTH_EVENTS.authorized;
             }
          } 
          return AUTH_EVENTS.notAuthorized;
       }
       
  };
  
 }]);
