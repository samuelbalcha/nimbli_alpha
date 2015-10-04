'use strict';

var Rooms = [];
  
Array.prototype.findRoom = function(name) {
    console.log(name);
    var i;
    for (i = 0; i < this.length; i++) {
        if(this[i].name === name){
            console.log(this[i]);
           return true; 
        }
    }
    return false;
};
 
Array.prototype.getRoom = function(name) {
    var i;
    for (i = 0; i < this.length; i++) {
        if(this[i].name === name){
           return this[i]; 
        }
    }
    return null;
};

Array.prototype.getRoomUsers = function(name) {
    var i;
    for (i = 0; i < this.length; i++) {
        if(this[i].name === name){
           return this[i].users; 
        }
    }
    return null;
};

exports.init = function(){
   var i;
   for(i=0; i < Rooms.length; i++){
       if(Rooms[i].users.length){
          Rooms.pop(Rooms[i]); 
       }
   }
};

exports.getRooms = function(){
    return Rooms;
};

exports.getRoom = function(name){
    return Rooms.getRoom(name);
};

exports.getRoomUsers = function(name){
    return Rooms.getRoomUsers(name);
};

exports.createRoom = function(name, user){
    Rooms.push({ name : name , users : [ user ]});
};

exports.addUserToRoom = function(room, user){
   
  if(room && room.users.indexOf(user) == -1){
     room.users.unshift(user);
  }
};

exports.removeUserFromRoom = function(room, user){
  var index = room.users.indexOf(user);
  if(room && index > -1){
      room.users.splice(index, 1);
  }
 
};

exports.deleteRoom = function(room){
    if(Rooms.indexOf(room) !== -1){
       Rooms.pop(room); 
    } 
};

exports.clearRooms = function(){
    Rooms.length = 0;
}

