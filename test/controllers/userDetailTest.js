describe ('Controller: UserDetailCtrl', function () {
    var AccountService, createController, stateparams;
    var scope, $httpBackend, deferred;
    
     var user = { email : '', displayName : 'samuel', _id : '55991e0943afbf8d23922ab9'};
     var data = { user : user, userProjects : [ ] };       
     
     beforeEach(function(){
          module('nimbliApp');
          inject(function($q, $rootScope, $controller,  _$httpBackend_, _AccountService_){
             
              AccountService = _AccountService_;
              $httpBackend = _$httpBackend_;
              deferred = $q.defer();
            
              stateparams = { id : '55991e0943afbf8d23922ab9' };
              $httpBackend.expectGET('/api/users/' + stateparams.id).respond(data); 
              scope = $rootScope.$new();
              var controller = $controller("UserDetailCtrl", { 
                  AccountService: _AccountService_, 
                  $scope: scope,
                  $stateParams : stateparams
              });
             
          });
     });
     
    afterEach (function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
     
    describe('when controller is instantiated', function() {
        it('should load the user based on the stateparams', function(){  
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            deferred.resolve(data); // Resolve the promise.
            scope.$digest();
             //assert
            expect(scope.user.displayName).toBe('samuel');
        }); 
        
        it('should set isOwner to true for stateparams.id equal to currentUser', function(){
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
           
            AccountService.setCurrentUser(user);
            $httpBackend.flush();
            
            expect(scope.isOwner).toBe(true);
        });
     });
     
    describe('when edit is called', function() {
      it('should activate editMode', function(){
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            scope.edit();
            expect(scope.editMode).toBe(true);
      });
    });
    
     describe('when save is called', function() {
      it('should save user and set editMode false', function(){
            $httpBackend.when('GET', 'partials/project/list-projects.html').respond('');
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
     
     
});
