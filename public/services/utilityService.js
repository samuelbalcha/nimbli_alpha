'use strict';

angular.module('nimbliApp').factory('UtilityService', function($rootScope, $modal){
    
     var theModal;
     Array.prototype.containsId = function(id){
        var i;
        for (i = 0; i < this.length; i++) {
            var item = this[i];
            if(item._id === id){
                return true; 
            }
        }
        return false;
    };
    
    Array.prototype.getElement = function(id){
        var i;
        for (i = 0; i < this.length; i++) {
            var item = this[i];
            if(item._id === id){
                return item; 
            }
        }
        return undefined;
    };
    
    Array.prototype.getIndex = function(id){
        var i;
        for (i = 0; i < this.length; i++) {
            var item = this[i];
            if(item._id === id){
                return i; 
            }
        }
        return -1;
    };
     return ({
         
        isInRole :  function (roles, resId){
            return roles.indexOf(resId) > -1;
        },
        setRole : function(role){
            $rootScope.$broadcast('userRoleReady', role);
        },
          
        notifyTabClick : function(tabAndScope){
            $rootScope.$broadcast('notifyTabClicked', tabAndScope);
        },
          
        getDialog : function($scope, template, size){
            if(!size){
                size = 'sm';
            }
            
            theModal =  $modal({ 
                scope: $scope, 
                template: template, 
                show: true,  
                animation: true,
                size : size
            });
            
            return theModal;
        },
        
        containsId : function(arr, id){
            return arr.containsId(id);
        },
        getElement : function(arr, id){
            return arr.getElement(id);
        },
        getIndex : function(arr, id){
            return arr.getIndex(id);
        }
     });
     
    
});