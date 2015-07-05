'use strict';

angular.module('nimbliApp')
       .controller('NavbarCtrl', function($scope, $auth)
        {
            $scope.isAuthenticated = function() {
                return $auth.isAuthenticated();
            };
        });