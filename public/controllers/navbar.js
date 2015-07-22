'use strict';

angular.module('nimbliApp')
       .controller('NavbarCtrl', function($scope, $auth, AccountService, store)
        {
            $scope.isAuthenticated = function() {
                return $auth.isAuthenticated();
            };
            
            load();
            
            function load(){
                if($auth.isAuthenticated()){
                    var currentUser = store.get('currentUser');
                    if(currentUser !== undefined && currentUser !== null){
                         $scope.displayName = currentUser.displayName;
                    }
                    else{
                        
                        AccountService.getProfile().then(function(data){
                            $scope.displayName = data.displayName;
                        });
                    } 
                }
            }
        });