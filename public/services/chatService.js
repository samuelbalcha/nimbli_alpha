'use strict';
angular.module('nimbliApp').service('ChatService', function($q, $http){
    
    return {
        
        
        getChats : function(pid, chatId){
             return $http.get('/api/projects/' + pid + '/chat').then(handleSuccess, handleError);    
        },
        
        sendChat : function(pid, chat){
           return $http.post('/api/projects/' + pid + '/chats', chat).then(handleSuccess, handleError);
        } 
    }
    
    function handleSuccess(response){
        return response.data;
    }
    
    function handleError(err){
        $q.reject(err);
    }
    
});