'use strict';
angular.module('nimbliApp').filter('ifText', function(){
    
   return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
   };
   
});