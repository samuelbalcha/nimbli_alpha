'use strict';
angular.module('nimbliApp').filter('yes', function(){
    
   return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
   };
   
});