describe ('Service: AccountService', function () {
    var AccountService,
        auth,
        store,
        $httpBackend,
        notificationService;
    
    var user = {
                  email : '', displayName : 'samuel',
                  _id : '55991e0943afbf8d23922ab9' 
              };

    beforeEach(function() {
        module('nimbliApp');
        
        inject(function( _$httpBackend_, _AccountService_, $auth, _store_, NotificationService) {
            $httpBackend = _$httpBackend_;
            AccountService = _AccountService_;
            auth = auth;
            store = _store_;
            notificationService = NotificationService;
        });
    });

    afterEach (function () {
        //$httpBackend.verifyNoOutstandingExpectation ();
        $httpBackend.verifyNoOutstandingRequest ();
    });

    describe ('when getProfile method is called', function () {
        it ('should get user and store it to currentUser', function () {
            
            // arrange
            $httpBackend.whenGET('/api/me').respond (user); 
              
            // act
            AccountService.getProfile();
            $httpBackend.expectGET('partials/project/list-project.html').respond('');
           
            $httpBackend.flush();
            // assert
            expect(AccountService.getCurrentUser().displayName).toBe('samuel');
        });
        
        it ('should store user localStorage', function () {
            
            // arrange
            $httpBackend.whenGET('/api/me').respond (user); 
              
            // act
            AccountService.getProfile();
            spyOn(store, "set");
           
            $httpBackend.expectGET('partials/project/list-project.html').respond('');
            $httpBackend.flush();
            
            expect(store.set).toHaveBeenCalled();
        });
        
    });
    
    describe('when getCurrentUser method is called', function (){
        it('should return currentUser', function(){
           
           var cu = AccountService.getCurrentUser();
           expect(cu.displayName).toBe('samuel');
            
        });
    });
    
    describe('when updateProfile method is called', function() {
        it('should update user data and currentUser data', function(){
            
            user.displayName = "Samuel Balcha";
            $httpBackend.whenPUT('/api/me', user).respond(user);
            $httpBackend.expectGET('partials/project/list-project.html').respond('');
            
            AccountService.updateProfile(user);
            
            $httpBackend.flush();
            expect(AccountService.getCurrentUser().displayName).toBe('Samuel Balcha')
            
        });
    });
    
      describe('when setCurrentUser method is called', function() {
        it('should update currentUser data', function(){
            
            user.displayName = 'Tom';
            AccountService.setCurrentUser(user);
         
            expect(AccountService.getCurrentUser().displayName).toBe('Tom');
            
        });
    });
});