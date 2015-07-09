'use strict';

angular.module('nimbliApp').factory('AuthorizationService', ['USER_ROLES', 'AUTH_EVENTS', function(USER_ROLES, AUTH_EVENTS){
 
 
  return function(user){
       
       return {
           
           canAccess : function(resourceId,loginRequired, requiredPermissions){
                var result = AUTH_EVENTS.authorized;
                
                    console.log(resourceId);
                    
                    //login required
                    if(user === undefined && loginRequired){
                        return (result = AUTH_EVENTS.notAuthenticated);
                    }
                    
                    //user is owner
                    if(user.roles.owner !== null && user.roles.owner.indexOf(resourceId) !== -1){
                        if(requiredPermissions.owner){
                            
                            console.log(user.roles.owner);
                            return result;
                        }
                    }
                    
                    //user is teamMember
                    if(user.roles.teamMember !== null && user.roles.teamMember.indexOf(resourceId) !== -1){
                        if(requiredPermissions.teamMember){
                            return result;
                        }
                    }
                    
                    //return not authorized
                    return (result = AUTH_EVENTS.notAuthorized);
           }
          
       }
  };
  
 }]);
