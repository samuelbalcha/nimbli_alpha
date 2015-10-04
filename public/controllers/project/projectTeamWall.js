angular.module('nimbliApp')
    .controller('ProjectTeamWallCtrl', function ($scope, ProjectService, ProjectWallService, ChatService, AccountService, UtilityService)
{
    'use strict';
     
    $scope.posts = [];
    var currentProject, theModal, room;
    $scope.currentUser;
   
    load();
    
    function load(){
        currentProject = ProjectService.getCurrentProject();
        $scope.userRole = ProjectService.getUserProjectRole();
        $scope.currentUser = AccountService.getCurrentUser();
        room = 'wall-'.concat(currentProject._id);
        
        if(currentProject){
           getPosts();
           connectWithSocket();
        }
    }
    
    function getPosts(){
        ProjectWallService.getPosts(currentProject._id).then(function(response){
            $scope.posts = response.data;
        });
    }
    
    function connectWithSocket(){
        var room = 'wall-'.concat(currentProject._id);
        if(!ChatService.isInitilaized() && !ChatService.isRoomConnected(room)){
            ChatService.init(room, $scope.currentUser._id, currentProject._id);
        }
        
        ChatService.on('wall', function(data){
            if(canAdd(data, room)){
                $scope.posts.unshift(data.message);
            }
        });
        
        ChatService.on('wall-post-removed', function(data){
            
            var index = UtilityService.getIndex($scope.posts, data.message._id);
            if(index > -1){
                $scope.posts.splice(index, 1);
            }
        });
    }
    
    function canAdd(data, room){
       
        return (data.room === room 
                          && data.message.project === currentProject._id
                          && data.message.visibileTo.indexOf($scope.currentUser._id) > -1);
           
    }
    
    $scope.removePost= function(item){
        var template = 'partials/modal/modal-delete-confirm.tpl.html';
        $scope.item = item;
        $scope.deleteTitle = "This action can not be undone.";
        theModal = UtilityService.getDialog($scope, template);
    };
    
    $scope.deleteConfirmed = function(item){
        ProjectWallService.removePost(item._id).then(function(data){
           
            if(data.data === "OK"){
                var index = $scope.posts.indexOf(item);
                ChatService.emit('wall-post-removed', { room : room, message : item });
                $scope.posts.splice(index, 1);
            }
          
           $scope.closeModal();
        });
    };
    
    $scope.showModal = function() {
        theModal.$promise.then(theModal.show);
    };
    
    $scope.closeModal = function(){
        theModal.$promise.then(theModal.hide);  
    };
});