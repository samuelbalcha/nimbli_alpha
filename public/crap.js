run(function($rootScope, authorizationService, AUTH_EVENTS, AccountService, $auth){
       return $rootScope.$on("$stateChangeStart", function(event, next){
           console.log("making request");
           var authenticator, permissions;
           permissions = (next && next.data) ? next.data.permissions : null;
         
           if($auth.isAuthenticated()){
               console.log("authenticated");
                var user = AccountService.getCurrentUser();
                
                Account.getAccess().success(function(user){
                   
                   authenticator = new authorizationService(user);
                   console.log(authenticator);
                   if ((permissions != null) && !authenticator.canAccess(permissions)) {
                        event.preventDefault();
                        if (!user) {
                            return $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        } else {
                            return $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        }
                   }
               })
           }
       })
});

  var userId = req.user;
            Project.find().or([{ createdBy: userId }, { team: userId}, { supervisors :userId }, {owners : userId}], function(err, projects){
                if(err){
                    console.log(err);
                    res.status(401).send({ message: 'User has no projects' });
                }
                
                console.log("with or", projects);
            });



//ProjectRequest
exports.createProjectRequest = function(req, res){
    var prReq = req.body;
    
    ProjectRequest.findOne({'project' : req.params.id  , 'user' : prReq.user}, function(err, existingRequest){
        if(err){
            res.status(401).send({ message : err });
        }
        if(existingRequest){
            // modify with new request 
           console.log(prReq , "and" , existingRequest);
           
            existingRequest.role = prReq.role || existingRequest.role;
            existingRequest.note = prReq.note || existingRequest.note;
            existingRequest.dateRequested = Date.now();
            existingRequest.save(function(err){
                if(err){
                    console.log(err);
                   res.status(401).send({ message : "could not add request"});
                }
               res.status(201).send(existingRequest);
            });
        }
        else{
              var newReq = new ProjectRequest({
                     user : prReq.user,
                     project : req.params.id,
                     role : prReq.role,
                     note : prReq.note
                 });
            console.log("new req", newReq);
            newReq.save(function(err){
                if(err){
                    console.log(err);
                    res.status(401).send({ message : "could not add request"});
                }
                res.status(201).send(newReq);
            });  
        }
    });
};

exports.getProjectRequests = function(req, res){
    
     ProjectRequest.find({'project' : req.params.id }).populate('user', 'displayName avatar' ).sort({ dateRequested : 'desc'}).exec(function(err, projectRequests) {
        if (err){
            res.status(404).send(err);
        }
        //console.log(projectRequests);
        res.status(200).send(projectRequests);
    });
    
};

exports.updateProjectRequest = function(req, res){
    
    var prReq = req.body;
   
   ProjectRequest.findOne({_id : prReq.id }, function(err, existingRequest) {
       if(err){
           console.log(err);
           res.send(err);
       }
       if(!existingRequest){
           res.send(err);
       }
       else if(prReq.status === 1){
           existingRequest.requestStatus = 1;
           existingRequest.responseDate = Date.now();
           updateProjectAfterRequest(existingRequest.project, existingRequest.user, existingRequest.role);
       }
       else if(prReq.status === 2){
           existingRequest.requestStatus = 2;
           existingRequest.responseDate = Date.now();
       }
       existingRequest.save(function(err){
           if(err){
               console.log(err);
               res.send(err);
           }
       });
       
       res.send(existingRequest);
   });
    
};

function updateProjectAfterRequest(pid, user, role){
    
    Project.findById(pid, function(err, project) {
        if(err || !project){
            console.log(err);
            return err;
        }
        if(role === 2){
            if(project.owners.indexOf(user) === -1)
                project.owners.push(user);
        }
       if(role === 1){
           if(project.supervisors.indexOf(user) === -1)
                project.supervisor.push(user);
       }
       if(role === 0){
           if(project.team.indexOf(user) === -1)
                project.team.push(user);
       }
       
       project.save(function(err){
           if(err){
               console.log(err);
               return err;
           }
       });
       
       console.log("proj ", project);
    });
}
