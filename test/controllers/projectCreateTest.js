describe('Controller: ProjectCreateCtrl', function(){
    var AccountService, ProjectService, createController, $location;
    var scope, $httpBackend, deferred;
    var project = {  _id: '55991e0943afbf8d23922ab9', title : 'Project 1', company : 'nimbli.org' };
    
    beforeEach(function(){
          module('nimbliApp');
          inject(function($q, $rootScope, $controller,  _$httpBackend_, _AccountService_ , _$location_ , _ProjectService_, _Upload_){
             
                AccountService = _AccountService_;
                $httpBackend = _$httpBackend_;
                $location = _$location_;
                ProjectService = _ProjectService_;
                deferred = $q.defer();
                
                scope = $rootScope.$new();
                var controller = $controller("ProjectCreateCtrl", { 
                    AccountService: _AccountService_, 
                    $scope: scope,
                    ProjectService : _ProjectService_,
                    $location : _$location_
                });
          });
    });
    
    afterEach (function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    describe('when createProject method is called', function() {
        it('should pass project data to ProjectService.createProject', function(){
            spyOn(ProjectService, "createProject").and.returnValue(deferred.promise);
           
            $httpBackend.whenPOST('/api/projects/', project).respond(project);
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            
            scope.project = project;
            scope.create();
            expect(ProjectService.createProject).toHaveBeenCalled();
        });
    });
    
    describe('when cancel method is called', function() {
        it('should set editMode to false and redirect to projects page', function(){
            spyOn($location, "path"); 
            scope.cancel();
            expect(scope.editMode).toEqual(false);
            expect($location.path).toHaveBeenCalled();
        });
    });
});