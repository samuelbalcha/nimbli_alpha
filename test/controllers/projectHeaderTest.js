describe('Controller: ProjectHeaderCtrl', function(){
    var AccountService, ProjectService, createController, user_roles;
    var scope, $httpBackend, deferred;
    var project = {  _id: '55991e0943afbf8d23922ab9', 
                    title : 'Project 10', 
                    owners : [ { _id :'5599', displayName : 'samuel'} ],
                    team : [ { _id :'5589', displayName : 'team member'} ], 
                    supervisors : [ { _id :'5549', displayName : 'sam supervisor'} ] 
                  };
    
    beforeEach(function(){
          module('nimbliApp');
          inject(function($q, $rootScope, $controller,  _$httpBackend_, _AccountService_ , USER_ROLES , _ProjectService_){
             
                AccountService = _AccountService_;
                $httpBackend = _$httpBackend_;
                user_roles = USER_ROLES;
                ProjectService = _ProjectService_;
                deferred = $q.defer();
                stateparams = { id : '55991e0943afbf8d23922ab9' };
                $httpBackend.whenGET('/api/projects/55991e0943afbf8d23922ab9').respond(project);
                spyOn(ProjectService, "getProject").and.returnValue(deferred.promise);
                
                scope = $rootScope.$new();
              
                 createController = function(){ 
                    $controller("ProjectHeaderCtrl", { 
                        AccountService: _AccountService_, 
                        $scope: scope,
                        ProjectService : _ProjectService_,
                        USER_ROLES : USER_ROLES,
                        $stateParams : stateparams
                    });
                };   
            });
        
    });
    
    afterEach (function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();  
    });
    
    describe('when controller is instanitiated ', function() {
        it('should call ProjectService.getProject ', function(){
            createController();
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
           
            deferred.resolve(project); // Resolve the promise.
            scope.$digest();
            $httpBackend.flush();
           
            expect(ProjectService.getProject).toHaveBeenCalled();
        });
        
        it('should set scope.project with value', function(){
           
            createController();
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
         
            deferred.resolve(project); // Resolve the promise.
            scope.$digest();
            
            $httpBackend.flush();
            expect(scope.project).toEqual(project);
        });
        
        it('should set canEdit to true for currentUser if he is found in project.owners', function(){
            var user = { _id : '5599' , displayName : "samuel" };
            AccountService.setCurrentUser(user);
            ProjectService.setCurrentProject(project);
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            
           
           
            deferred.resolve(project); // Resolve the promise.
            scope.$digest();
            $httpBackend.flush();
            
            expect(scope.canEdit).toEqual(true);
        });
        
        it('should set canEdit to false for currentUser if he is not found in project.owners', function(){
           
            var user = { _id : '559967' , displayName : "samuel" };
            AccountService.setCurrentUser(user);
            ProjectService.setCurrentProject(project);
            createController();
            
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            deferred.resolve(project); // Resolve the promise.
            scope.$digest();
            $httpBackend.flush();
           
            expect(scope.canEdit).toEqual(false);
        });
        
        it('should set userRole to owner for currentUser if he is found in project.owners', function(){
            
            var user = { _id : '5599' , displayName : "samuel" };
            AccountService.setCurrentUser(user);
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            
            deferred.resolve(project); // Resolve the promise.
            scope.$digest();
            $httpBackend.flush();
            
            expect(scope.userRole).toEqual(user_roles.owner);
        });
        
        it('should set userRole to anonymous for currentUser if he is not found in project ', function(){
           
            var user = { _id : '55997' , displayName : "samuel" };
            AccountService.setCurrentUser(user);
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            deferred.resolve(project); // Resolve the promise.
            scope.$digest();
            $httpBackend.flush();
            
            expect(scope.userRole).toEqual(user_roles.anonymous);
        });
        
        it('should set userRole to teamMember for currentUser if he is found in project.team ', function(){
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            
            var user = { _id : '5589' , displayName : "samuel" };
            AccountService.setCurrentUser(user);
            createController();
            deferred.resolve(project); // Resolve the promise.
            scope.$digest();
            $httpBackend.flush();
            
            expect(scope.userRole).toEqual(user_roles.teamMember);
        });
        
        it('should set userRole to supervisor for currentUser if he is found in project.supervisors ', function(){
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            
            var user = { _id : '5549' , displayName : "samuel" };
            AccountService.setCurrentUser(user);
            createController();
            deferred.resolve(project); // Resolve the promise.
            scope.$digest();
            $httpBackend.flush();
            
            expect(scope.userRole).toEqual(user_roles.supervisor);
        });
        
    });
    
    describe('when edit method is called', function() {
        it('should set editMode to true', function(){
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            deferred.resolve(project); // Resolve the promise.
            scope.$digest();
            $httpBackend.flush();
            
            scope.edit();
            expect(scope.editMode).toEqual(true);
        }); 
    });
    
    describe('when cancel method is called', function() {
        it('should set editMode to false', function(){
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            deferred.resolve(project); // Resolve the promise.
            scope.$digest();
            $httpBackend.flush();
            scope.edit(); // set edit first
            
            scope.cancel();
            expect(scope.editMode).toEqual(false);
        }); 
    });
    
    describe('when save method is called', function() {
        it('should call ProjectService.updateProject and set editMode to false', function(){
            createController();           
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            deferred.resolve(project); // Resolve the promise.
            scope.$digest();
            $httpBackend.flush();
            ProjectService.setCurrentProject(project);
            spyOn(ProjectService, "updateProject").and.returnValue(deferred.promise);
            
            $httpBackend.whenPUT('/api/projects/55991e0943afbf8d23922ab9', project).respond(project);
            scope.save(); 
           
            expect(ProjectService.updateProject).toHaveBeenCalled();
            expect(scope.editMode).toEqual(false);
        }); 
    });
    
});