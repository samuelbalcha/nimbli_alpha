'use strict';

angular.module('nimbliApp').directive('uniqueEmail', function(EmailCheckService) {
  return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$asyncValidators.unique = EmailCheckService;
    }
  };
});