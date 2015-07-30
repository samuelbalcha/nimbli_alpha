describe('Controller: ProjectInfoCtrl', function(){
    var AccountService, ProjectService, createController, user_roles;
    var scope, $httpBackend, deferred;
    var project = {  _id: '55991e0943afbf8d23922ab9', title : 'Project 10', owners : [ { _id :'5599', displayName : 'samuel'} ] };
    
    beforeEach(function(){
          module('nimbliApp');
          inject(function($q, $rootScope, $controller,  _$httpBackend_, _AccountService_ , USER_ROLES , _ProjectService_){
             
                AccountService = _AccountService_;
                $httpBackend = _$httpBackend_;
                user_roles = USER_ROLES;
                ProjectService = _ProjectService_;
                deferred = $q.defer();
                
                $httpBackend.whenGET('/api/projects/55991e0943afbf8d23922ab9').respond(project);
                spyOn(ProjectService, "getCurrentProject").and.returnValue(project);
                ProjectService.setUserProjectRole(user_roles.owner);
                
                scope = $rootScope.$new();
                var controller = $controller("ProjectInfoCtrl", { 
                    AccountService: _AccountService_, 
                    $scope: scope,
                    ProjectService : _ProjectService_,  
                });    
               
               createController = function(){
                   return $controller("ProjectInfoCtrl", { 
                                AccountService: _AccountService_, 
                                $scope: scope,
                                ProjectService : _ProjectService_,  
                        });    
               };
               
          });
    });
    
    
    afterEach (function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        
    });
    
    describe('when controller is instanitiated ', function() {
        it('should call load when userProjectRoleReady is ready', function(){
           
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            ProjectService.setUserProjectRole(user_roles.owner);
            expect(ProjectService.getCurrentProject).toHaveBeenCalled();
        });
     
        it('should set scope.project with value', function(){
             
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            
            ProjectService.setUserProjectRole(user_roles.owner); // this is done by parent controller
            expect(scope.project).toEqual(project);
        });
     
        it('should set canEdit to true for ProjectService.getUserProjectRole return is owner', function(){
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            ProjectService.setUserProjectRole(user_roles.owner); // this is done by parent controller
            
            expect(scope.canEdit).toEqual(true);
        });
          
        it('should set canEdit to false if ProjectService.getUserProjectRole return is not owner', function(){
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            ProjectService.setUserProjectRole(user_roles.teamMember); 
            createController(); // recreate the controller 
            console.log("team", ProjectService.getUserProjectRole());
          
            expect(scope.canEdit).toEqual(false);
        });
        
    });
    
    describe('when edit method is called', function() {
        it('should set editMode to true', function(){
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            
            scope.edit();
            expect(scope.editMode).toEqual(true);
        }); 
    });
    
    describe('when cancel method is called', function() {
        it('should set editMode to false', function(){
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            scope.edit(); // set edit first
            
            scope.cancel();
            expect(scope.editMode).toEqual(false);
        }); 
    });
    
    describe('when save method is called', function() {
        it('should call ProjectService.updateProject and set editMode to false', function(){
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            spyOn(ProjectService, "updateProject").and.returnValue(deferred.promise);
            
            $httpBackend.whenPUT('/api/projects/55991e0943afbf8d23922ab9', project).respond(project);
            scope.save(); 
           
            expect(ProjectService.updateProject).toHaveBeenCalled();
            expect(scope.editMode).toEqual(false);
        }); 
    });
    
});