angular.module('nimbliApp')
       .controller('DashboardCtrl', function ($scope, AccountService, DashboardService) 
{
    'use strict';
     //load();
     init();
     function init(){
       
         
         DashboardService.getActivities(AccountService.getCurrentUser()._id).then(function(response){
             console.log(response.data);
         }); 
     }
     
    
     function getActivity(projects){
         
        for(var i =0; i< projects.length; i++){
           
        }
        
         AccountService.getUser(AccountService.getCurrentUser()._id).then(function(data){
                AccountService.setActiveUser(data);
                if(data) {
                    var ownProjects =  data.contributions[0];
                    var teamProjects = data.contributions[1];
                    var supervisedProjects = data.contributions[2];
                }
            }, function(err){
                   console.log(err);
            });
     }
    
});