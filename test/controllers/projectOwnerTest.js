describe('Controller: ProjectOwnerCtrl', function(){
    var AccountService, ProjectService, createController, user_roles, $modal;
    var scope, $httpBackend, deferred, $rScope;
    
    // get all projectrequests for the project.
    // allow accept or reject requests. Accepted user is added to project with role requested
    // reject request will delete the request from collection
    var project = {  _id: '55991e09', 
                        title : 'Project 10',
                        createdBy : '5599',
                        owners : [ { _id :'5599', displayName : 'samuel'} ],
                        team : [ { _id :'5589', displayName : 'sam member'} ], 
                        supervisors : [ { _id :'5549', displayName : 'sam supervisor'} ] 
                  };
    var pr = {
                data : {
                    senderUser : '',
                    project : '55991e09',
                    role : 'team',
                    note : '',
                    toUser : 244
                }
            }; 
    var owner = { _id : 244, displayName : 'Owner Man'};
    beforeEach(function(){
        module('nimbliApp');
        inject(function($q, $rootScope, $controller, _$httpBackend_, _AccountService_ , USER_ROLES, _ProjectService_, _$modal_){
            AccountService = _AccountService_;
            $httpBackend = _$httpBackend_;
            user_roles = USER_ROLES;
            ProjectService = _ProjectService_;
            $modal = _$modal_;
            $rScope = $rootScope;
            deferred = $q.defer();
           
            scope = $rootScope.$new();
           
            ProjectService.setUserProjectRole(user_roles.owner);
            ProjectService.setCurrentProject(project);
            AccountService.setCurrentUser(owner);
            createController = function(){ 
                $controller("ProjectOwnerCtrl", { 
                    AccountService: _AccountService_, 
                    $scope: scope,
                    ProjectService : _ProjectService_,
                    USER_ROLES : USER_ROLES,
                });
            };   
            
            createController();
        });
    });
    
    afterEach (function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    describe('when controller is instanitiated', function() {
       it('should call getProjectRequests and fetch all project requests for the current project', function() {
          
            var list = getList();
            $httpBackend.whenGET('/api/projectrequests/'+project._id + '/' + 244).respond(list);
             
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            scope.$digest();
            $httpBackend.flush();
            expect(scope.projectRequests.length).toEqual(5);
        });
    });
    
    describe('when acceptUser method is called', function() {
        it('should call addUserToProject with the role', function(){
            var prList = getList();
            var request = prList[0];
            
            $httpBackend.expectGET('/api/projectrequests/'+project._id + '/' + 244).respond(prList);
           
            spyOn(ProjectService, "addUserToProject").and.callThrough();
            var r  = { 
                        role : request.role, 
                        userId : request.senderUser, 
                        projectId : request.project,
                        owner : request.toUser
                     };
            
            $httpBackend.expectPUT('/api/addusertoproject', r).respond(project);
           
            scope.acceptUser(request);
            $httpBackend.whenPUT('/api/projectrequest/' + request._id).respond(request); 
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            scope.$digest();
            $httpBackend.flush();
            
            expect(ProjectService.addUserToProject).toHaveBeenCalled();
        });
    });
    
    describe('when rejectUser method is called', function() {
        it('should call ProjectService.removeProjectRequest ', function(){
            var prList = getList();
            var request = prList[0];
            
            $httpBackend.expectGET('/api/projectrequests/'+project._id + '/' + 244).respond(prList);
           
            spyOn(ProjectService, "removeProjectRequest").and.callThrough();
            var r  = { 
                        role : request.role, 
                        userId : request.senderUser, 
                        projectId : request.project,
                        owner : request.toUser
                     };
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            scope.rejectUser(request._id);
            $httpBackend.whenDELETE('/api/projectrequest/' + request._id).respond(request); 
            
            scope.$digest();
            $httpBackend.flush();
            
            expect(ProjectService.removeProjectRequest).toHaveBeenCalled();
        });
    });
    
    function getList(){
        var list = [];
        for(var i= 0; i < 5; i++){
            var p = {
                _id : i, senderUser : i, project : '55991e09', role : 'team', note : '', toUser : 244
            };
            list.push(p);
        }
        return list;
    }

});