angular.module('nimbliApp')
       .controller('TeamHeaderCtrl', function($q,$scope, ProjectService, AccountService, ProjectWallService, DriveService, UtilityService,
                                              USER_ROLES, POST_TYPE, POST_ACTION, ChatService, VisibilityService, ATTACHMENT_TYPE, $window){
    'use strict';
    
    $scope.visibilityOptions = [];
    $scope.post = {
         contentType : 0,
         content : '',
         visibileTo : [],
         imageFile : null,
         attachment : null,
         link: null,
         video : null,
         action : '',
         caption : '',
         docId : '',
         attachmentType : {
             type : '',
             icon : '',
             name :''
         }
    };
    
    $scope.newContent = {
        visibileTo : null,
        contentType : ''
    };
    
    $scope.activeTab = {
      post: "post",
      drive : "drive",
      calendar : "calendar"
    };
    
    var theModal, room, currentUser, me, defer;
    $scope.project;
    
    $scope.selectedTab = $scope.activeTab.post;
    $scope.tabOperator = tabOperator;
    $scope.createPost = createPost;
    $scope.addPerson = addPerson;
    
    $scope.googleDrive = {
        name : '',
        created : false
    };
   
    $scope.$on('$locationChangeStart', function(event, next, current) {
        ChatService.disconnect(room, currentUser._id);
    });
    
    $scope.$watch('post.imageFile', function(){
        $scope.post.attachment = null;
    });
    
    $scope.$watch('post.attachment', function(){
        $scope.post.imageFile = null;
        
        if($scope.post.attachment !== null){
            var mm, isSet = false;
            var name = $scope.post.attachment.name;
            
            for (var mime in ATTACHMENT_TYPE) {
                mm = ATTACHMENT_TYPE[mime];
                if($scope.post.attachment.type === mm.type){
                   setAttachmentType(mm.type, mm.icon, name);
                   isSet = true;
                }
            } 
            if(!isSet){
                setAttachmentType(ATTACHMENT_TYPE.OTHER.type, 
                                  ATTACHMENT_TYPE.OTHER.icon, name);
            }
        }
    });
    
    function setAttachmentType(type, icon, name){
        $scope.post.attachmentType.type = type;
        $scope.post.attachmentType.icon = icon;
        $scope.post.attachmentType.name = name;
    }
    
    init();
    
    function init(){
       
        $scope.project = ProjectService.getCurrentProject();
        $scope.project.people = [];
        currentUser = AccountService.getCurrentUser();
        $scope.visibilityOptions = VisibilityService.getOptionsWithIcons($scope.userRole);
        $scope.newContent.visibileTo = $scope.visibilityOptions[0];
        me = AccountService.getMe();
        var pp = VisibilityService.getVisibileTo($scope.newContent.visibileTo.name, $scope.project, $scope.userRole, me);
        copyPeople(pp);
        
        if($scope.userRole && $scope.userRole !== USER_ROLES.anonymous){
            room = 'wall-'.concat($scope.project._id);
            ChatService.init(room, AccountService.getCurrentUser()._id, $scope.project._id);
        }
    }
   
    function tabOperator(tab){
        $scope.selectedTab = tab;
        if(tab === $scope.activeTab.drive){
            $window.open($scope.project.drive.link, '_blank');
        }
    }
    
    function createPost(){
        ChatService.connect(room, currentUser._id, $scope.project._id);
      
        if($scope.selectedTab === $scope.activeTab.post){
            var p = {
                    project : $scope.project._id,
                    postedBy: currentUser._id,
                    visibileTo : $scope.post.visibileTo,
                    content : $scope.post.content
                };
            
            if($scope.post.imageFile){
               if(!$scope.project.drive){
                    ensureDriveFolder().then(function(){
                        if( $scope.googleDrive.created === true){
                            saveImage($scope.post, $scope.project._id, p);
                        }
                    });
               }
               else{
                   saveImage($scope.post, $scope.project._id, p);
               }
            }
            else if($scope.post.attachment){
                
                if(!$scope.project.drive){
                    ensureDriveFolder().then(function(){
                        if( $scope.googleDrive.created === true){
                            saveAttachment($scope.post, $scope.project._id, p);
                        }
                    });  
                 }
               else{
                   saveAttachment($scope.post, $scope.project._id, p);
               }
            }
            else if($scope.post.link){
                p.contentType = POST_TYPE.link;
                p.caption = $scope.post.content;
                p.action = POST_ACTION.link;
                Notify($scope.project._id, p);
            }
            else{
                p.contentType = POST_TYPE.text;
                p.caption = $scope.post.content;
                p.action = POST_ACTION.text;
                Notify($scope.project._id, p);
            }
        }
       
      // 
    }
    
    function saveAttachment(post, pid, p){
      
        p.contentType = POST_TYPE.attachement;
        p.caption = $scope.post.attachment.name;
        p.action = POST_ACTION.attachement;
        
        DriveService.init().then(function(){
             var file = { 
                 file : $scope.post.attachment,
                 content : p.content,
             };
             
            DriveService.insertFile($scope.project.drive.folderId, file, function(res){
               p.thumbnailUrl = $scope.post.attachmentType.icon;
               p.docId = res.id;
               Notify(pid, p);
            });
        });
    }
    
    function saveImage(post, pid, p){
      
        p.contentType = POST_TYPE.image;
        p.caption = post.content;
        p.action = POST_ACTION.image;
                
        DriveService.init().then(function(){
            var file = { 
                 file : $scope.post.imageFile,
                 content : p.content,
            };
            DriveService.insertFile($scope.project.drive.folderId, file, function(res){
               p.thumbnailUrl = 'https://drive.google.com/uc?id='+ res.id;
               p.docId = res.id;
               Notify(pid, p);
            });
        });
    }
    
    function ensureDriveFolder(){
        defer = $q.defer();
        var template = 'partials/modal/modal-create-drive-folder.html';
        theModal = UtilityService.getDialog($scope, template);
        return defer.promise;
    }
    
    function Notify(pid, p){
      
        ProjectWallService.addPost(pid, p).then(function(data){
            $scope.post.imageFile = null;
            $scope.post.content = '';
            $scope.post.attachment = null;
            $scope.post.attachmentType.name = '';
            ChatService.emit('wall', { room : room, message : data, project : $scope.project._id });
            $scope.showTools(false);
        });
    }
    
    function addPerson(id, ele){
       var index = $scope.post.visibileTo.indexOf(id);
      
       if(ele.currentTarget.checked === true && index == -1){
            $scope.post.visibileTo.unshift(id);
       }
       else if(ele.currentTarget.checked === false && index > -1){
            $scope.post.visibileTo.splice(index, 1);
       }
    }
    
    $scope.showModal = function() {
        theModal.$promise.then(theModal.show);
    };
    
    $scope.closeModal = function(){
        theModal.$promise.then(theModal.hide);  
    };
    
    $scope.confirm = function(){
       $scope.closeModal();
    };
          
    $scope.customizeClick = function(option){
        
        $scope.project.people = [];
        $scope.post.visibileTo = [];
        
        $scope.project.people = VisibilityService.getVisibileTo(option.name, $scope.project,$scope.userRole, me);
        copyPeople($scope.project.people);
        
        if(option.name === 'customize'){
            
            var index = VisibilityService.getIndex($scope.project.people, me._id);
            $scope.project.people.splice(index, 1);
            
            var template = 'partials/modal/modal-post-visibility-customizer.html';
            theModal = UtilityService.getDialog($scope, template);
        }
    };
    
    function copyPeople(people){
        if(!people) return;
        $scope.post.visibileTo = [];
        people.map(function(p){
            $scope.post.visibileTo.push(p._id);
        });
    }
    
    $scope.createDriveFolder = function(){
       
        DriveService.init().then(function(){
            DriveService.createProjectFolder($scope.googleDrive.name, function(folder){
                if(folder && folder.id){
                    $scope.project.drive = {
                        folderId : folder.id,
                        owner : folder.ownerNames[0],
                        dateCreated : folder.createdDate,
                        link : folder.alternateLink.replace('&usp=drivesdk', '')
                    };
                    $scope.googleDrive.created = true;
                    defer.resolve();
                    $scope.closeModal();
                    ProjectService.updateProject($scope.project);
                }
            });
        });
    };
    
    $scope.showTools = function(val){
        $scope.showToolBar = val;
    };
});


