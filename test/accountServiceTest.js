describe("AccountService", function(){
   
   var accountService, httpBackend;
   
   beforeEach(module('nimbliApp'));
   
   var ctrl, scope;
   
   beforeEach(function(){
        angular.mock.inject(function($injector){
            q = $injector.get('$q');
            httpBackend = $injector.get('$httpBackend');
            service = $injector.get('$auth');
            store = $injector.get('store');
            accountService = $injector.get('AccountService');
           
            spyOn(accountService, 'getProfile'); 
        });
   });
     
    it("it should call getProfile", function(){
        accountService.getProfile();
        expect(accountService.getProfile).toHaveBeenCalled();
    });
    
   it('should fetch authentication token', function() {
     httpBackend.when('GET', '/api/me').respond({ email : '', displayName : 'samuel', _id : '55991e0943afbf8d23922ab9' });
      //httpBackend.flush();
     
   });
});