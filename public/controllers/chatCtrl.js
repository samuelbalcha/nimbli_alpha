angular.module('nimbliApp').controller('ChatCtrl', function($scope, AccountService, VisibilityService, ChatService){
    'use strict';
    
    $scope.people = [];
    $scope.currentUser;
    $scope.newContent = {
        added : false,
        user : '',
        panelIndex : ''
    };
   
    $scope.init = function(){
        getPeople();
    };
    
    $scope.expandCallback = function (index) {
       
    };
    
    var allPeople = [];
    var chanell;
    
    $scope.chat = {
        message : '',
        to : '',
        from : '',
        dateSent : ''
    };
    
    $scope.send = send;
   
    function getPeople(){
        $scope.currentUser = AccountService.getCurrentUser();
        if(! $scope.currentUser) return;
        
        var projects = AccountService.getProjects();
        if(!projects){
            AccountService.getAllUserProjects().then(function(response){
                AccountService.setAllUserProjects(response.data);
                if(response.data){
                   populate(response.data);
                }
            });
        }
        else{
            populate(projects);
        }
        chanell = 'msg-'.concat($scope.currentUser._id);
        ChatService.init(chanell, $scope.currentUser._id, {});
        ChatService.on('msg', function(data){
            putMessageToPerson(data);
        });
    }
    
    function putMessageToPerson(data){
        if($scope.people.containsId(data.data.from._id)){
            var person = $scope.people.getElement(data.data.from._id);
            person.conversations.push(data.data);
            $scope.newContent.added = true;
            $scope.newContent.user = data.data.from._id;
        }
    }
    
    function populate(projects){
        for(var i=0; i < projects.length; i++){
            getProjectsPeople(projects[i]);
        }
        
        // Remove currentUser;
        for(i= 0; i < allPeople.length; i++){
            var person = allPeople[i];
            if(person._id === $scope.currentUser._id){
                var index = allPeople.indexOf(person);
                allPeople.splice(index, 1);
            }
        }
        
        $scope.people = allPeople;
    }      
    function getProjectsPeople(project){
        VisibilityService.addPeopleForChat(allPeople, project.team);
        VisibilityService.addPeopleForChat(allPeople, project.supervisors);
        VisibilityService.addPeopleForChat(allPeople, project.owners);
    }
   
    function send(user){
        var chat = { 
                      room : chanell, 
                      dateSent : Date.now(), 
                      to : { _id : user._id, avatar : user.avatar }, 
                      from : { _id : $scope.currentUser._id,  avatar : $scope.currentUser.avatar },
                      message : $scope.chat.message 
                    };
                    
        ChatService.emit('msg', chat);
        var person = $scope.people.getElement(user._id);
        person.conversations.push(chat);
        $scope.chat.message = '';
        $scope.newContent.added = false;
        $scope.newContent.user = '';
    }
   
});