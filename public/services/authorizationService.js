'use strict';

angular.module('nimbliApp').factory('AuthorizationService', ['USER_ROLES', 'AUTH_EVENTS', function(USER_ROLES, AUTH_EVENTS){
 
 
  return function(user){
       
       return {
           
           canAccess : function(resourceId,loginRequired, requiredPermissions){
                    //login required
                    if(user === undefined && loginRequired){
                        return AUTH_EVENTS.notAuthenticated;
                    }
                    
                    //user is owner
                    if((requiredPermissions === USER_ROLES.owner) && user.roles.owner !== undefined){
                        return isInRole(user.roles.owner, resourceId);
                    }
                    
                    //user is teamMember
                    if((requiredPermissions === USER_ROLES.teamMember) && user.roles.teamMember !== undefined){
                         return isInRole(user.roles.teamMember, resourceId);
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
