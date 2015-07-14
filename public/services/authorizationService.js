'use strict';

angular.module('nimbliApp').factory('AuthorizationService', ['USER_ROLES', 'AUTH_EVENTS', function(USER_ROLES, AUTH_EVENTS){
 
 
  return function(user){
       
       return {
           
           canAccess : function(resourceId,loginRequired, requiredPermissions){
                    
                     user.userRole = USER_ROLES.anonymous;
                    //login required
                    if(user === undefined && loginRequired){
                        return AUTH_EVENTS.notAuthenticated;
                    }
                    
                    //user is owner
                    if((requiredPermissions === USER_ROLES.owner) && user.roles.owner !== undefined){
                        
                        var allowed = isInRole(user.roles.owner, resourceId);
                        if( allowed === AUTH_EVENTS.authorized){
                            user.userRole = USER_ROLES.owner;
                        }
                       return allowed;   
                    }
                    
                    //user is teamMember
                    if((requiredPermissions === USER_ROLES.teamMember) && user.roles.teamMember !== undefined){
                        
                        var allowed =  isInRole(user.roles.teamMember, resourceId);
                        if( allowed === AUTH_EVENTS.authorized){
                            user.userRole = USER_ROLES.teamMember;
                        }
                       return allowed; 
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
