describe('Service: ProjectWallService', function(){
     var $httpBackend, ProjectService, NotificationService, AccountService, ProjectWallService, user_roles, post_visibility;
     var memb1 = {_id : 222 , displayName : "Memebr 1"};
     var memb2 = {_id : 333 , displayName : "Memebr 1"};
     var sup = {_id : 444 , displayName : "Supervisor 1"};
     var owner = {_id : 555 , displayName : "Client"};
     
     var project = { _id : 898, team : [ memb1, memb2 ], supervisors : [sup], createdBy : 555, owners: [owner] };
     
     beforeEach(function(){
        module('nimbliApp');
        inject(function( _$httpBackend_, _ProjectService_, _AccountService_, _NotificationService_, _ProjectWallService_, USER_ROLES, POST_VISIBILITY) {
            $httpBackend = _$httpBackend_;
            ProjectService = _ProjectService_;
            NotificationService = _NotificationService_;
            AccountService = _AccountService_;
            ProjectWallService = _ProjectWallService_;
            user_roles = USER_ROLES;
            post_visibility = POST_VISIBILITY
        });
        
        ProjectService.setCurrentProject(project);
    });
    
    afterEach (function () {
        //$httpBackend.verifyNoOutstandingExpectation ();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    
    describe('when getPosts is called', function() {
       
       it('should return posts visibile to the role', function(){
       
         var publicPost1 = { _id : 1, visibileTo : post_visibility.toPublic  };
         var publicPost2 = { _id : 2, visibileTo : post_visibility.toConnection  };
         var publicPost3 = { _id : 3, visibileTo : post_visibility.toConnection  };
         var ownerPost1 = { _id : 4, visibileTo :  post_visibility.toConnection  };
         var ownerPost2 = { _id : 5, visibileTo :  post_visibility.toPublic };
         
         var posts = [ publicPost1, publicPost2, publicPost3, ownerPost1, ownerPost2 ];
         
         $httpBackend.expectGET('/api/projectwall/' + project._id + 
                                '?role=' + user_roles.owner + '&visibileTo=' + post_visibility.toPublic).respond(posts);
         $httpBackend.expectGET('partials/project/list-projects.html').respond('');
         var result; 
         ProjectWallService.getPosts(project._id, user_roles.owner, post_visibility.toPublic).then(function(po){
             result = po;
         });
          
         $httpBackend.flush();
         
         expect(result.length).toBe(5); 
       }); 
    });
    
    describe('when addPost method is called', function() {
        it('should add post to posts collection with correct visibility', function(){
            AccountService.setCurrentUser(owner);
            ProjectService.setUserRole(owner);
            var post = { visibileTo : ['owner', 'supervisor', 'team'], postedBy : owner._id };
            $httpBackend.expectPOST('/api/projectwall/' + project._id, post).respond(post);
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
             
            var result;
            ProjectWallService.addPost(project._id, post).then(function(p){
                result = p;
            });
            
            $httpBackend.flush();
            expect(result).toEqual(post);
        });
    });
    
    
     function createPost(i, max, user, visibile, contentType){
        var post = [];
         for( i= 1; i < max; i++){
            var p = {   _id : i, 
                        visibileTo : visibile, 
                        datePosted : Date.now(), 
                        postedBy : user._id, 
                        contentType : contentType, //0 = text, 1 = video link , 2 = attachement
                        content : 'Hrlloo sdd' + i,
                        comments : []
                    }
                    
            post.push(p);
         }
         
         return post;
   }
});