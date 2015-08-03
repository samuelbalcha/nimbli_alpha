describe('Controller: ProjectOwnerCtrl', function(){
    var AccountService, ProjectService, createController, user_roles, $modal;
    var scope, $httpBackend, deferred, $rScope;
    
    // get all projectrequests for the project.
    // allow accept or reject requests. Accepted user is added to project with role requested
    
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
            spyOn(scope, "$on").and.callThrough();
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
        });
    });
    
    afterEach (function () {
        //$httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    describe('when controller is instanitiated', function() {
        it('scope should wait for parentControllerLoaded', function(){
            
            $rScope.$broadcast('parentControllerLoaded', project);
            createController();
            
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            scope.$digest();
            $httpBackend.flush();
            
            expect(scope.$on).toHaveBeenCalledWith('parentControllerLoaded', jasmine.any(Function));
        });
        
        it('should call getProjectRequests and fetch all project requests for the current project', function() {
            $rScope.$broadcast('parentControllerLoaded', project);
            createController();
            var list = [];
            for(var i= 0; i < 5; i++){
               var p = {
                    senderUser : i, project : '55991e09', role : 'team', note : '', toUser : 244
                };
                
                list.push(p);
            }
            
            spyOn(AccountService, "getProjectRequests");
            
            $httpBackend.whenGET('/api/projectrequests/' + '/' + 244).respond(list);
             
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            scope.$digest();
            $httpBackend.flush();
            expect(AccountService.getProjectRequest).toHaveBeenCalled();
        });
    });
    

});