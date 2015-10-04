angular.module('nimbliApp')
    .controller('ProjectWallCtrl', function ($scope, AccountService, ProjectService, NotificationService ,USER_ROLES, ProjectWallService, POST_VISIBILITY, POST_TYPE, Upload, POST_ACTION, $modal)
{
    'use strict';   
 
    $scope.posts = [];
    $scope.load = load;
    $scope.options = [];
    $scope.post = {
         contentType : 0,
         content : '',
         visibileTo : '',
         imageFile : null,
         action : '',
         caption : ''
    };
    $scope.createPost = createPost;
    $scope.visibileTo = POST_VISIBILITY.toPublic;
    $scope.userRole = USER_ROLES.anonymous;
    $scope.formVisible = false;
    $scope.setContentType = setContentType;
    $scope.removePost = removePost;
    
    var currentProject, theModal;
   
    $scope.$on('userProjectRoleReady', function(evt, role){
        $scope.userRole = role;
        currentProject = ProjectService.getCurrentProject();
        $scope.visibileTo = ProjectWallService.getVisibilityByRole(role);
        $scope.formVisible = (role !== USER_ROLES.anonymous);
        $scope.currentUser = AccountService.getCurrentUser();
        load();
    });
    
    $scope.showModal = function() {
        theModal.$promise.then(theModal.show);
    };
    
    $scope.closeModal = function(){
        theModal.$promise.then(theModal.hide);
    };
    
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
        
        if($scope.post.imageFile){
            p.contentType = POST_TYPE.image;
            p.caption = $scope.post.content;
            p.action = POST_ACTION.image;
            imagePost(p);
        }
        else{
            p.contentType = POST_TYPE.text;
            p.action = POST_ACTION.text;
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
                       file: $scope.post.imageFile,
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
                        $scope.post.imageFile = null;
                    }).error(function (data, status, headers, config) {
                        console.log('error status: ' + status);
                    });
    }
    
    function removePost(item){
        var template = 'partials/modal/modal-delete-confirm.tpl.html';
        $scope.title = 'Remove post';
        $scope.deleteTitle = "Are you sure you want to remove this post?";
        $scope.item = item;
        theModal =  $modal({ scope: $scope, template: template, show: true });
    }
    
    $scope.deleteConfirmed = function(item){
        ProjectWallService.removePost(item._id).then(function(data){
           var index = $scope.posts.indexOf(item);
           $scope.posts.splice(index, 1);
           $scope.closeModal();
        });
    };
});