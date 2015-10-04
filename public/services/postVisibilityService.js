angular.module('nimbliApp').service('VisibilityService', function(POST_VISIBILITY, USER_ROLES){
    'use strict';    
    
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
    
    return  {
        
        getOptions : function(role){
            switch (role) {
         
                case USER_ROLES.owner: 
                    return [POST_VISIBILITY.everyone, POST_VISIBILITY.onlyMe, POST_VISIBILITY.customize];
                case USER_ROLES.supervisor:
                    return [POST_VISIBILITY.everyone, POST_VISIBILITY.supervisors,  POST_VISIBILITY.customize];
                case USER_ROLES.teamMember:
                    return[POST_VISIBILITY.onlyMe, POST_VISIBILITY.onlyTeam, POST_VISIBILITY.supervisors, POST_VISIBILITY.everyone, POST_VISIBILITY.customize ];
                default:
                    return [POST_VISIBILITY.onlyMe];
            } 
        },
        getOptionsWithIcons : function(role){
            var everyone = { name : POST_VISIBILITY.everyone, icon : 'fi-torsos-all' };
            var supervisor = { name : POST_VISIBILITY.supervisors, icon : 'fi- torsos' };
            var onlyMe = { name : POST_VISIBILITY.onlyMe, icon : 'fi-torso' };
            var onlyTeam = { name : POST_VISIBILITY.onlyTeam, icon : 'fi-lock' };
            var customize = { name : POST_VISIBILITY.customize, icon : '' };
            
            switch (role) {
         
                case USER_ROLES.owner: 
                    return [ everyone, onlyMe, customize ];
                case USER_ROLES.supervisor:
                    return [everyone, supervisor,  customize];
                case USER_ROLES.teamMember:
                    return [onlyMe, onlyTeam, supervisor, everyone, customize ];
                default:
                    return [onlyMe];
            } 
        },
        
        getOptionsSimple : function(){
            return [ POST_VISIBILITY.toPublic, POST_VISIBILITY.toPrivate ];
        },
        
        addPersonToPost : function(people, person){
            if(people.indexOf(person) == -1){
                people.push(person);
            }
            
            return people;
        },
        addPeopleToPost : function(people, toAdd){
            for(var i=0; i < toAdd.length; i++){
                if(!people.containsId(toAdd[i]._id)){
                    var person = { _id: toAdd[i]._id, name : toAdd[i].displayName };
                    if(toAdd[i].avatar){
                       person.avatar = toAdd[i].avatar;    
                    }
                    people.push(person);
                }
            }
            
            return people;
        },
        addPeopleForChat : function(people, toAdd){
            for(var i=0; i < toAdd.length; i++){
                if(!people.containsId(toAdd[i]._id)){
                    var person = {  _id : toAdd[i]._id, 
                                    name : toAdd[i].displayName, 
                                    chatActive : false, 
                                    conversations : [], 
                                    avatar : toAdd[i].avatar || ''
                                  };
                    
                    people.push(person);
                }
            }
            return people;
        },
        getVisibileTo : function(option, currentProject, role, me){
            
            var people = [];
            switch (option) {
                case POST_VISIBILITY.onlyTeam:
                     return this.addPeopleToPost([], currentProject.team);
               
                case POST_VISIBILITY.everyone:
                case POST_VISIBILITY.customize:
                    
                     people = this.addPeopleToPost(people, currentProject.team);
                     people = this.addPeopleToPost(people, currentProject.supervisors);
                     return  this.addPeopleToPost(people, currentProject.owners);
                
                case POST_VISIBILITY.supervisors:
                     if(role == USER_ROLES.supervisor){
                         return this.addPeopleToPost([], currentProject.supervisors);
                     }
                     if(role == USER_ROLES.teamMember){
                         people = this.addPeopleToPost(people, currentProject.team);
                         return this.addPeopleToPost(people, currentProject.supervisors);
                     }
                break;
                 case POST_VISIBILITY.onlyMe:
                       people.push(me);
                       return people;
                default:
                    // code
                    break;
            }
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
    };
    
});