'use strict';

angular.module('nimbliApp').factory('EmailCheckService', function($q, $http){
    
    return function(email){
        var defered = $q.defer();
        
        $http.get('/api/emailcheck/' + email).then(function(){
            defered.reject();
        }, function(){
            defered.resolve();
        });
        
        return defered.promise;
    }
});