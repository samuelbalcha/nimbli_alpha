angular.module('nimbliApp')
    .controller('ProjectWallCtrl', function ($scope, AccountService, ProjectService, NotificationService ,USER_ROLES, ProjectWallService, POST_VISIBILITY, POST_TYPE, Upload)
{
    'use strict';    
    $scope.posts = [];
    $scope.load = load;
    $scope.options = [];
    $scope.post = {
         contentType : 0,
         content : '',
         visibileTo : '',
         file : null,
         action : '',
         caption : ''
    };
    $scope.createPost = createPost;
    $scope.visibileTo = POST_VISIBILITY.toPublic;
    $scope.userRole = USER_ROLES.anonymous;
    $scope.formVisible = false;
    $scope.setContentType = setContentType;
    
    $scope.$watch('post', function () {
        console.log($scope.post.file);
    }); 
   
    var currentProject;
    
    $scope.$on('userProjectRoleReady', function(evt, role){
        $scope.userRole = role;
        currentProject = ProjectService.getCurrentProject();
        $scope.visibileTo = ProjectWallService.getVisibilityByRole(role);
        $scope.formVisible = (role !== USER_ROLES.anonymous);
        $scope.currentUser = AccountService.getCurrentUser();
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
                    postedBy: $scope.currentUser._id,
                    visibileTo : $scope.post.visibileTo,
                    content : $scope.post.content
                };
        
        if($scope.post.file){
            p.contentType = POST_TYPE.image;
            p.caption = $scope.post.content;
            p.action = $scope.currentUser.displayName + " uploaded a picture";
            imagePost(p);
        }
        else{
             p.contentType = POST_TYPE.text;
             p.action = $scope.currentUser.displayName + " posted on the wall";
            ProjectWallService.addPost(currentProject._id, p).then(function(data){
                $scope.posts.unshift(data);
            });
        }
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
    
    function setContentType(val){
       $scope.post.contentType = val;
      
    }
    
    function imagePost(p){
       
      Upload.upload({
                       url: '/api/projectwall/' + p.project ,
                       file: $scope.post.file,
                       method: 'POST',
                       fields: { 
                           project : p.project , 
                           postedBy: p.postedBy,
                           visibility : p.visibileTo,
                           content : p.content,
                           postType : p.contentType,
                           action : p.action
                       }
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                        $scope.post.file = null;
                    }).error(function (data, status, headers, config) {
                        console.log('error status: ' + status);
                    });
    }
    
});