angular.module('nimbliApp').service('ChatService', function($q, $http, $rootScope, $window){
    'use strict';    
    var socket, currentRoom;
    
    return {
        init: function(room, user, project){
            socket = $window.io().connect(room);
            this.connect(room, user, project); 
        },
        on: function(eventName, callback )
        {
            socket.on(eventName, function()
            {
                var args=arguments;
                $rootScope.$apply(function()
                {
                    callback.apply(socket,args);
                });
            });
        },

        emit: function(eventName,data,callback)
        {
            socket.emit(eventName,data,function()
            {
                var args=arguments;
                $rootScope.$apply(function()
                {
                    if(callback)
                    {
                        callback.apply(socket,args);
                    }
                });
            });
        },
       
        isInitilaized : function(){
            return (socket !== undefined);
        },
        
        disconnect : function(room, user){
            console.log("disconnect");
            socket.emit('leave', { room : room, user : user});
        },
        
        isRoomConnected : function(room){
            if(socket && socket.room === room){
                return socket.connected;
            }
            return false;
        },
        
        connect : function (room, user, project){
            socket.on('connect', function() {});
            socket.emit('join', { room : room, user : user, project : project});
            console.log('joined ', room);
        }
    };
    
});

/**
 
 if(!socket && !currentRoom){
                console.log("first time");
                socket = $window.io().connect(room);
                socket.on('connect', function() {
                   socket.emit('join', room);
                });
                currentRoom = room;
            }
            
           else if(socket && currentRoom && currentRoom !== room){
               console.log("room changed")
               socket.on('connect', function() {
                   socket.emit('leave', currentRoom); 
                });
                socket.emit('join', room); 
                currentRoom = room;
           }
         
           else if(!socket && !currentRoom && (currentRoom === room)){
                console.log("room changed")
                 socket.on('connect', function() {
                   socket.emit('join', room);
                });
           }
           
           server
           
           
            console.log(Chat)
    if(!Chat.findRoom(data.room)){
       
         Chat.Rooms.push({ name : data.room, users : [ data.user] });
         socket.join(data.room);
         console.log( data.user + " Joined the room: "+  data.room);
    }
    else{
       var r = Chat.getUsersOfRoom(data.room);
       if(r && r.users.indexOf(data.user) !== -1){
           console.log(data.user+ " is already in room" + data.room);
       }
       else{
           r.users.push(data.user);
           socket.join(data.room);
       }
    
    }
       
    console.log("total rooms: ", Chat.Rooms);
*/