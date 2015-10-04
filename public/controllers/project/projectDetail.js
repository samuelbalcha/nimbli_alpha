angular.module('nimbliApp')
    .controller('ProjectDetailCtrl', function ($scope, $stateParams, $state, ProjectService, AccountService, USER_ROLES, $location)
{
    $scope.project = {};
    $scope.init = load;
    $scope.userRole;
    $scope.privateWall;
    $scope.userview = userviewClicked;
    $scope.edit = edit;
    $scope.cancel = cancel;
    $scope.refresh = refresh;
    $scope.showApplyBtn = showApplyBtn;
   
    $scope.view = {  text : '', wallView : false, 
                     processIcon :'../images/project/wall.png', wallIcon : '../images/project/process.png' };
   
    
    $scope.init();
    
    function load(){
    
        ProjectService.getProject($stateParams.id).then(function(project){
            $scope.project = project;
            var currentUser = AccountService.getCurrentUser();
            $scope.userRole = ProjectService.setUserRole(project, currentUser);
            $scope.privateWall = ($scope.userRole && $scope.userRole !== USER_ROLES.anonymous) ? true : false;
            
            $scope.canEdit = ($scope.userRole === USER_ROLES.owner);
            $scope.isPrivate = ($scope.project.visibileTo[0] === 'Private');
        });
    }
    
    function userviewClicked(user){
        $location.path('/users/' + user.id);
    }
    
    function edit(){
        $scope.editMode = true;
        $scope.$watch('file', function(){
            //console.log($scope.file);
        });
    }
    
    function cancel(){
        $scope.editMode = false;
        $scope.file = null;
        $scope.refresh(); 
    }
    
    function refresh(){
        $state.reload();
    }
    
    function showApplyBtn(){
        return (!$scope.userRole || $scope.userRole === USER_ROLES.anonymous);
    }
    
    
});