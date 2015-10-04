angular.module('nimbliApp').service('MethodCardService', function($http, $q){
    'use strict';
    var path = '/api/cards/';
    
    return {
       
        getFramingCards : function(){
            return $http.get(path);
        },
        
        createFramingCard : function(card){
            return $http.post(path, card);
        },
        updateFramingCard : function(card){
            return $http.put(path, card);
        },
        getCard : function(id){
            return $http.get(path + id);
        },
        removeCard : function(id){
            return $http.delete(path + id);
        }
       
    };
    
});