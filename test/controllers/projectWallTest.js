describe('Controller: ProjectWallCtrl', function(){
    var  ProjectService, createController, ProjectWallService, post_type;
    var scope, $httpBackend, post_visibility, $rScope, AccountService;
     
    var memb1 = {_id : 222 , displayName : "Memebr 1"};
    var memb2 = {_id : 333 , displayName : "Memebr 1"};
    var sup = {_id : 444 , displayName : "Supervisor 1"};
    var owner = {_id : 555 , displayName : "Client"};
    
    var project = { _id : 898, team : [ memb1, memb2 ], supervisors : [sup], createdBy : 555, owners : [owner] };
    beforeEach(function(){
        module('nimbliApp');
        inject(function($rootScope, _AccountService_, $controller, _$httpBackend_ , _ProjectService_, _ProjectWallService_, POST_VISIBILITY, POST_TYPE){
        
             AccountService = _AccountService_;
            $httpBackend = _$httpBackend_;
            post_type = POST_TYPE;
            ProjectService = _ProjectService_;
            ProjectWallService = _ProjectWallService_;
            $rScope = $rootScope;
            post_visibility = POST_VISIBILITY;
            ProjectService.setCurrentProject(project);
            
            scope = $rootScope.$new();
            spyOn(ProjectWallService, "getPosts").and.callThrough();
            createController = function(){ 
                    $controller("ProjectWallCtrl", { 
                        AccountService : _AccountService_,
                        $scope: scope,
                        ProjectService : _ProjectService_,
                        POST_VISIBILITY : POST_VISIBILITY,
                        POST_TYPE : POST_TYPE
                    });
                };   
            });       
    });
    
    afterEach (function () {
    //   $httpBackend.verifyNoOutstandingExpectation();
       $httpBackend.verifyNoOutstandingRequest();
    });
    
    describe('when controller is instanitiated', function() {
        it('should fetch only public posts for anonymous role', function(){
            ProjectService.setUserRole(project, null);
            var role = ProjectService.getUserProjectRole();
            var visibileTo = ProjectWallService.getVisibilityByRole(role);
           
            createController();
            $rScope.$broadcast('userProjectRoleReady', role);
           
            $httpBackend.expectGET('/api/projectwall/' + project._id +
                                    '?role='+ role + '&visibileTo=' + visibileTo).respond([]);
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            
            expect(ProjectWallService.getPosts).toHaveBeenCalledWith(project._id, role, visibileTo); 
        });
        
         it('should fetch connection posts for owner role', function(){
            ProjectService.setUserRole(project, project.owners[0]);
            var role = ProjectService.getUserProjectRole();
            
            var visibileTo = ProjectWallService.getVisibilityByRole(role);
           
            createController();
            $rScope.$broadcast('userProjectRoleReady', role);
           
            $httpBackend.expectGET('/api/projectwall/' + project._id +
                                    '?role='+ role + '&visibileTo=' + visibileTo).respond([]);
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            
           // expect(ProjectWallService.getPosts).toHaveBeenCalledWith(project._id, role, visibileTo); 
        });
        
        it('should hide postForm for anonymous user role', function() {
            ProjectService.setUserRole(project, null);
            var role = ProjectService.getUserProjectRole();
            var visibileTo = ProjectWallService.getVisibilityByRole(role);
           
            createController();
            $rScope.$broadcast('userProjectRoleReady', role);
           
            $httpBackend.expectGET('/api/projectwall/' + project._id +
                                    '?role='+ role + '&visibileTo=' + visibileTo).respond([]);
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            expect(scope.formVisible).toEqual(false);
        });
        
    });
    
    describe('when createPost method is called', function() {
       it('should invoke ProjectWallService.addPost with post object', function(){
            AccountService.setCurrentUser(project.owners[0]);
            ProjectService.setUserRole(project, project.owners[0]);
            var role = ProjectService.getUserProjectRole();
            
            var visibileTo = ProjectWallService.getVisibilityByRole(role);
           
            createController();
            $rScope.$broadcast('userProjectRoleReady', role);
            
           var post = {
                project : project._id,
                postedBy: project.owners[0]._id,
                visibileTo : post_visibility.toConnection,
                content : 'This is the post',
                contentType : post_type.text,  
           };
           
           spyOn(ProjectWallService, "addPost").and.callThrough();
           scope.post = post;
           scope.createPost();
           expect(ProjectWallService.addPost).toHaveBeenCalledWith(project._id, post); 
            
       });
    });
    
    
});