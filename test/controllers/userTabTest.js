describe('Controller: UserTabsCtrl', function(){
    var scope, createController, $rootscope;
    
    beforeEach(function(){
        module('nimbliApp');
        inject(function($rootScope, $controller){
            
            $rootscope = $rootScope;
            scope = $rootScope.$new();
            
            createController = function(){
                $controller("UserTabsCtrl", { 
                    $scope: scope
                });  
            }; 
        });
    });
    
    describe('when controller is instantiated', function() {
        it('should listen to scope.on parentControllerLoaded event', function(){
           spyOn(scope, "$on").and.callThrough(); 
           createController();
           $rootscope.$broadcast('parentControllerLoaded', {});
        
           expect(scope.$on).toHaveBeenCalled();
        });
    });
   
});