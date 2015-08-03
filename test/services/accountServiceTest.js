describe ('Service: AccountService', function () {
    var AccountService,
        auth,
        store,
        $httpBackend,
        notificationService, deferred;
    
    var user = {
                  email : '', displayName : 'samuel',
                  _id : '55991e0943afbf8d23922ab9' 
              };

    beforeEach(function() {
        module('nimbliApp');
        
        inject(function( _$httpBackend_, _AccountService_, $auth, _store_, NotificationService, $q) {
            $httpBackend = _$httpBackend_;
            AccountService = _AccountService_;
            auth = auth;
            store = _store_;
            notificationService = NotificationService;
            deferred = $q.defer();
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
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
           
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
           
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
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
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            
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
    
    describe('when getUser method is called', function() {
        it('should return user data promise', function(){
        
            AccountService.getUser = jasmine.createSpy("getUser() spy").and.callFake(function(){
               
                deferred.resolve({ _id : 123, displayName : 'Samuel'});
                return deferred.promise;
            });
         
           var d;
            AccountService.getUser(123).then(function(data){
                d = data;
            });
            
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            
            expect(d.displayName).toBe('Samuel');
        });
    });
    
    describe('when getProjectRequest method is called', function() {
        it('should return single projectRequest data', function(){
             var pr = { senderUser : '', project : '234', role : 'team', note : '' };   
             $httpBackend.expectGET('partials/project/list-projects.html').respond('');
         
            AccountService.setCurrentUser({ _id : 123 });
            $httpBackend.whenGET('/api/projectrequest/'+ 234 + '/' + 123).respond(pr);
            var d;
            AccountService.getProjectRequest(234).then(function(response){
                d = response.data;
            });
            
            $httpBackend.flush();
            
            expect(d.role).toBe('team');
        });
    });
    
    describe('when getProjectRequests method is called', function() {
        it('should return list of projectRequests sent for the project owner', function(){
           
           var list = [];
             for(var i = 0; i <5; i++){
                 var pr = { senderUser : i, project : '234', role : 'team', note : '', toUser : 888 };   
                 list.push(pr);
             }  
             
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
         
            AccountService.setCurrentUser({ _id : 888 });
            $httpBackend.whenGET('/api/projectrequests/'+ 234 + '/' + 888).respond(list);
            var d;
            AccountService.getProjectRequests(234).then(function(response){
                d = response.data;
            });
            
            $httpBackend.flush();
            expect(d.length).toEqual(5);
        });
    });
});