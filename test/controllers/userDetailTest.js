describe ('Controller: UserDetailCtrl', function () {
    var AccountService, createController, stateparams, Upload;
    var scope, $httpBackend, deferred;
    
     var user = { email : '', displayName : 'samuel', _id : '55991e0943afbf8d23922ab9'};
     var data = { user : user, userProjects : [ ] };       
     
     beforeEach(function(){
          module('nimbliApp');
          inject(function($q, $rootScope, $controller,  _$httpBackend_, _AccountService_, Upload){
             
              AccountService = _AccountService_;
              $httpBackend = _$httpBackend_;
              deferred = $q.defer();
              Upload = Upload;
              stateparams = { id : '55991e0943afbf8d23922ab9' };
             // $httpBackend.expectGET('/api/users/' + stateparams.id).respond(data); 
              scope = $rootScope.$new();
              
               createController = function(){
                    $controller("UserDetailCtrl", { 
                      AccountService: _AccountService_, 
                      $scope: scope,
                      $stateParams : stateparams
                    });  
              }; 
          });
     });
     
    afterEach (function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
     
    describe('when controller is instantiated', function() {
        it('should load the user based on the stateparams', function(){  
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.expectGET('/api/users/' + stateparams.id).respond(data);
            $httpBackend.flush();
            deferred.resolve(data); // Resolve the promise.
            scope.$digest();
             //assert
            expect(scope.user.displayName).toBe('samuel');
        }); 
        
        it('should set isOwner to true for stateparams.id equal to currentUser', function(){
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.expectGET('/api/users/' + stateparams.id).respond(data);
            AccountService.setCurrentUser(user);
            $httpBackend.flush();
            
            expect(scope.isOwner).toBe(true);
        });
        
        it('should call AccountService.getActiveUser', function(){
            spyOn(AccountService, "getActiveUser");
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.expectGET('/api/users/' + stateparams.id).respond(data);
            $httpBackend.flush();
            
            expect(AccountService.getActiveUser).toHaveBeenCalled();
        });
        
        it('should not expect http call if user data from AccountService.getActiveUser is same as stateparams.id', function(){
            AccountService.setActiveUser(data);
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            
            expect(scope.user).not.toBe({});
        });
     });
     
    describe('when edit is called', function() {
      it('should activate editMode', function(){
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.expectGET('/api/users/' + stateparams.id).respond(data);
            $httpBackend.flush();
            scope.edit();
            expect(scope.editMode).toBe(true);
      });
    });
    
    describe('when save is called', function() {
      it('should save user and set editMode false', function(){
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.expectGET('/api/users/' + stateparams.id).respond(data);
            $httpBackend.flush();
            $httpBackend.expect("PUT", '/api/me', user).respond({ email : '', displayName : 'samuel balcha', _id : '55991e0943afbf8d23922ab9'});
            scope.save();
            // flush after calling the method, otherwise was throwing unsatisfied request error
            $httpBackend.flush();
            //assert
            expect(AccountService.getCurrentUser().displayName).toBe('samuel balcha');
            expect(scope.editMode).toBe(false);
      });
    });
    
    describe('when save is called', function() {
      it('should call upload service when file is present', function(){
            createController();
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.expectGET('/api/users/' + stateparams.id).respond(data);
            $httpBackend.flush();
            
            spyOn(scope, "upload");
            
            $httpBackend.expect("PUT", '/api/me', user).respond({ email : '', displayName : 'samuel balcha', _id : '55991e0943afbf8d23922ab9'});
            scope.file = {};
            scope.save();
            
            $httpBackend.flush();
            expect(scope.upload).toHaveBeenCalled();
      });
    });
     
     
});
