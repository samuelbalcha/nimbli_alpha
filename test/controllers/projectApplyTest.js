describe('Controller: ProjectApplyCtrl', function(){
     var AccountService, ProjectService, createController, user_roles, $modal;
     var scope, $httpBackend, deferred, $rScope, stateparams;
     
     // check projectrequest collection if an application is made
     // show apply or applied to based on finding. Hide the button if the request is accepted
     // 
     
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
                        role : '',
                        note : '',
                        toUser : project.createdBy
                    }
                };   
       
      beforeEach(function(){
          module('nimbliApp');
          inject(function($q, $rootScope, $controller, $stateParams, _$httpBackend_, _AccountService_ , USER_ROLES, _ProjectService_, _$modal_){
             
                AccountService = _AccountService_;
                $httpBackend = _$httpBackend_;
                user_roles = USER_ROLES;
                ProjectService = _ProjectService_;
                $modal = _$modal_;
                stateparams = $stateParams;
                $rScope = $rootScope;
                deferred = $q.defer();
                stateparams.id = project._id;
                scope = $rootScope.$new();
                spyOn(scope, "$on").and.callThrough();
              
                createController = function(){ 
                    $controller("ProjectApplyCtrl", { 
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
         
         it('should fetch projectrequest for the current user', function(){
            AccountService.setCurrentUser({ _id : '1233', displayName : "sam"}); 
            createController();
            
            $httpBackend.expectGET('/api/projectrequest/' + project._id + '/' + AccountService.getCurrentUser()._id).respond(pr);
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            scope.$digest();
            $httpBackend.flush();
     
         });
         
          it('should set applyBtn active if projectrequest for the current user is null', function(){
            AccountService.setCurrentUser(null);
            createController();
            $rScope.$broadcast('parentControllerLoaded', project);
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
           
            scope.$digest();
            $httpBackend.flush();
     
            expect(scope.canApply).toEqual(true);
         });
         
          it('should set applyBtn inactive if projectrequest for the current user is not null', function(){
            
            AccountService.setCurrentUser({ _id : '1233', displayName : "sam"});
            createController();
            $rScope.$broadcast('parentControllerLoaded', project);
            $httpBackend.expectGET('/api/projectrequest/' + project._id + '/' + 1233).respond(pr);
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            
            scope.$digest();
            $httpBackend.flush();
            expect(scope.canApply).toEqual(false);
         });
     });
     
    
});
