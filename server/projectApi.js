'use strict';

var ProjectSchema = require('./models/project');
var User = require('./models/user');
var faker = require('faker');

var Project = ProjectSchema.Project;
var Brief = ProjectSchema.Brief;
var ProjectRequest = ProjectSchema.ProjectRequest;

exports.createProject = function(req, res){
    
    var pr = req.body;
   
    
    Project.findOne({ title : pr.title}, function(err, existingProject){
        if (existingProject) {
            res.status(409).send({ message: 'The project title is already taken' });
        }
        if(err){
            res.status(403).send({ message : err });
        }
    
        //Create Brief 
        var brf = new  Brief({ 
                briefCreatedByUser : false,
                outcome   : '',
                objective : '',
                deliverable: '',
                approach  : '',
                startDate : '',
                endDate : '',
                formattedDate : ''
            });
    
        brf.save(function(err){
            if(err){
                console.log(err);
            }
        });
    
        var project = new Project({
                title : pr.title,
                company : pr.company,
                description : pr.description,
                createdBy : req.user,
                brief : brf._id
            });
    
        project.owners.push(req.user);
    
        project.save(function(err) {
            if(err){
                console.log(err);
            }
        });
        
        User.findOne({_id : req.user }, function(err, user){
            if(err){
                console.log(err);
            }
            
            user.roles.owner.push(project._id);
                 user.save(function(err) {
                    if(err){
                        console.log(err);
                    }
                    
                res.status(201).send({ user : user , project : project });  // return project 
            });
        });
    });
};
    
exports.updateProject = function(req, res){
    
    var pr = req.body;
    Project.findById(req.params.id, function(err, project) {
        if(err){
            res.send(500).send({ message : err });
        }
        if (!project) {
            res.status(404).send({ message: 'Project not found' });
        }
        console.log(pr.status)
    
        project.title = pr.title || project.title;
        project.company = pr.company || project.company;
        project.coverPicture = pr.coverPicture || project.coverPicture;
        project.driveLink = pr.driveLink || project.driveLink;
        project.skills = pr.skills || project.skills;
        project.markModified('skills');
        project.owners = pr.owners || project.owners;
        project.markModified('owners');
        project.dateUpdated = Date.now();
        project.description = pr.description || project.description;
        project.location = pr.location || project.location;
        project.status = pr.status || project.status;
        project.dateStarted = pr.dateStarted || project.dateStarted;
        project.dateCancelled = pr.dateCancelled || project.dateCancelled;
        project.dateCompleted = pr.dateCompleted || project.dateCompleted;
    
        project.save(function(err) {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }
            res.status(200).send(project);
        });
    });
};
    
exports.getProjects = function(req, res){
    
    Project.find().populate('createdBy', 'displayName').sort({ dateCreated : 'desc'}).exec(function(err, projects) {
        if (err){
            res.status(404).send(err);
        }
        projects.forEach(function(project, idx){
           
            project.coverPicture = faker.image.business();
            project.company = faker.company.companyName();
        });
        res.status(200).send(projects);
    });
};
    
exports.deleteProject = function(req, res){
    
    Project.findOneAndRemove({ _id : req.params.id }, function(err, pr){
        if(err){
            console.log(err);
            res.status(404).send(err);
        }
        console.log("removed: " + pr._id);
         
        Brief.findOneAndRemove({ _id : pr.brief }, function(err, br){
            if(err){
                console.log("could not remove brief");
            }
            console.log("removed brief" + br._id);
        });
        
        // Remove project from the owners
         removeProjectFromUsers(pr.owners, pr._id);
         // Remove from the team members
         removeProjectFromUsers(pr.team, pr._id);
    });
    
    res.send(200);
};
    
exports.getProject = function(req, res) {
    /**
    
    Project
    .findById( req.params.id)
    .populate('createdBy', 'email').populate('members', 'displayName')
    .exec(function(err,project) {
    
    */
    
    Project.findOne({ '_id' : req.params.id}).populate('brief')
                                             .populate('createdBy', 'displayName')
                                             .populate('team', 'displayName')
                                             .exec(function(err, project) {
        if(err){
            console.log(err);
            res.status(401).send({ message: err });
        }
        if(!project){
            res.status(401).send({ message: 'Project not found' });
        }
        else{
          
            if(req.user != undefined){
                console.log("nottt")
                ProjectRequest.findOne({'user' : req.user  , 'project' : project._id}, function(err, existingRequest){
                    if(err){
                     console.log(err);
                    }
                    if(!existingRequest){
                        res.status(200).send(project);
                    }
                    else{
                       project.projectRequest[0] = existingRequest;
                    }
                });
            }
            
              project.coverPicture = faker.image.business();
              project.company = faker.company.companyName();
             res.status(200).send(project);
        }
    });
};

function removeProjectFromUsers(userIds, prId){
    // Remove project from users
     User.find({_id : {$in: userIds } }, function(err, users){
        if(err){
            console.log(err);
        }
        if(!users){
            return;
        }
        else{
            users.forEach(function(user, idx){
                console.log("removed from user", user._id);
                 user.roles.owner.pop(prId);
                 user.save(function(err) {
                    if(err){
                        console.log(err);
                    }
                 });
           });
        }
     });
}

// Brief 
exports.updateBrief = function(req, res){
    var br = req.body;
    
    Brief.findById(br._id, function(err, brief){
        if(err){
            res.status(401).send({ message : err });
        }
        if(brief){
            
                brief.outcome = br.outcome  || brief.outcome; 
                brief.objective = br.objective || brief.objective; 
                brief.deliverable = br.deliverable || brief.deliverable;
                brief.approach = br.approach || brief.approach;
                brief.startDate = br.startDate || brief.startDate;
                brief.endDate = br.endDate || brief.endDate;
                brief.dateUpdated = Date.now();
                brief.briefCreatedByUser = true;

            brief.save(function(err){
                if(err){
                    console.log(err);
                    res.status(401).send({ message : err});
                }
                res.status(200).send(brief);
            });
        }
    });
};

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
    console.log("dump", prReq);
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