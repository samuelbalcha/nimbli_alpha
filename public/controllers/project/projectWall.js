angular.module('nimbliApp')
    .controller('ProjectWallCtrl', function ($scope, AccountService, ProjectService, NotificationService ,USER_ROLES, ProjectWallService, POST_VISIBILITY, POST_TYPE)
{
    'use strict';    
    $scope.posts = [];
    $scope.load = load;
    $scope.options = [];
    $scope.post = {
         contentType : 0,
         content : '',
         visibileTo : ''
    };
    $scope.createPost = createPost;
    $scope.visibileTo = POST_VISIBILITY.toPublic;
    $scope.userRole = USER_ROLES.anonymous;
    $scope.formVisible = false;
   
    
    var currentProject, currentUser;
    
    $scope.$on('userProjectRoleReady', function(evt, role){
        $scope.userRole = role;
        currentProject = ProjectService.getCurrentProject();
        $scope.visibileTo = ProjectWallService.getVisibilityByRole(role);
        $scope.formVisible = (role !== USER_ROLES.anonymous);
        currentUser = AccountService.getCurrentUser();
        load();
    });
  
    function load(){
        if(currentProject){
            ProjectWallService.getPosts(currentProject._id, $scope.userRole, $scope.visibileTo).then(function(posts){
                $scope.posts = posts;
            });
        }
        getVisibilityOptions();
    }
    
    function createPost(){
        var p = {
                project : currentProject._id,
                postedBy: currentUser._id,
                visibileTo : $scope.post.visibileTo,
                content : $scope.post.content,
                contentType : $scope.post.contentType, 
        };
        
        ProjectWallService.addPost(currentProject._id, p).then(function(data){
            $scope.posts.unshift(data);
        });
    }
    
    function visibilityChanged(ele){
        console.log($scope.post.visibileTo )
    }
    
    function getVisibilityOptions(){
         switch ($scope.userRole) {
               
                case USER_ROLES.owner: 
                case USER_ROLES.supervisor:
                        $scope.options = [ POST_VISIBILITY.toConnection, POST_VISIBILITY.toPublic ];
                    break;
                case USER_ROLES.teamMember:
                     $scope.options = [ POST_VISIBILITY.onlyTeam, POST_VISIBILITY.toConnection, POST_VISIBILITY.toPublic ];
                    break;
                default:
                  $scope.options = [ POST_VISIBILITY.toConnection ];
            }
            
            $scope.post.visibileTo = $scope.options[0];
    }
    
    
});