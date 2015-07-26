'use strict';

angular.module('nimbliApp')
       .controller('NavbarCtrl', function($scope, $auth, AccountService, store)
        {
            $scope.isAuthenticated = function() {
                return $auth.isAuthenticated();
            };
            
            $scope.$on('currentUserUpdated', function(evt, user){
              setUserNameOnBar(user);
            });
            
            load();
            
            function load(){
                if($auth.isAuthenticated()){
                    var currentUser = store.get('currentUser');
                    if(currentUser !== undefined && currentUser !== null){
                        setUserNameOnBar(currentUser)
                    }
                    else{
                        
                        AccountService.getProfile().then(function(data){
                            $scope.displayName = data.displayName;
                        });
                    } 
                }
            }
            
            function setUserNameOnBar(user){
                 $scope.displayName = user.displayName;
                 $scope.userId = user._id;
            }
        });