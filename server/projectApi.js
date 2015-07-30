'use strict';

var ProjectSchema = require('./models/project');
var User = require('./models/user');
var faker = require('faker');
var USER_ROLES = require('constants');

var Project = ProjectSchema.Project;
var Brief = ProjectSchema.Brief;
var ProjectRequest = ProjectSchema.ProjectRequest;


/**
 * creats a new project and saves it to collection. 
 * it creates a brief object and attaches it to the project.
 * it addes the projectid to the user
 */
exports.createProject = function(req, res){
    
    var pr = req.body;
    Project.findOne({ title : pr.title}, function(err, existingProject){
        if (existingProject) {
            res.status(409).send({ message: 'The project title is already taken' });
        }
        if(err){
            res.status(403).send({ message : err });
        }
        var brf = createBrief();
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
        addProjectToOwner(req.user, project._id);
        res.status(201).send(project);
    });
};

/**
 * updates the project with supplied new values. 
 */
exports.updateProject = function(req, res){
    
    var pr = req.body;
    Project.findById(req.params.id, function(err, project) {
        if(err){
            res.send(500).send({ message : err });
        }
        if (!project) {
            res.status(404).send({ message: 'Project not found' });
        }
        else{
                project.title = pr.title || project.title;
                project.company = pr.company || project.company;
                project.coverPicture = pr.coverPicture || project.coverPicture;
                project.driveLink = pr.driveLink || project.driveLink;
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
        }
    });
};

/**
 * returns projects with few fields and sorts by dateCreated.
 */
exports.getProjects = function(req, res){
      
    Project.find()
           .sort({ dateCreated : 'desc'})
           .exec(function(err, projects) {
                if (err){
                    res.status(404).send(err);
                }
                if(!projects){
                    res.status(404).send();
                }
                else{
                     projects.forEach(function(project, idx){
                        project.coverPicture = faker.image.business();
                        project.company = faker.company.companyName();
                    });
                    res.status(200).send(projects);
                }
                
           });
};

/**
 * removes the project from collection.
 * removes the project brief from the brief collection.
 * removes the projectId from users associated with the project.
 */ 
exports.deleteProject = function(req, res){
    
    Project.findOneAndRemove({ _id : req.params.id }, function(err, pr){
        if(err){
            console.log(err);
            res.status(404).send(err);
        }
        
        Brief.findOneAndRemove({ _id : pr.brief }, function(err, br){
            if(err){
                console.log("could not remove brief");
            }
            console.log("removed brief" + br._id);
        });
        
         //Remove project from the owners
         removeProjectFromUsers(pr.owners, pr._id, USER_ROLES.owner);
         //Remove from the team members
         removeProjectFromUsers(pr.team, pr._id, USER_ROLES.teamMember);
         //Remove from supervisors 
         removeProjectFromUsers(pr.supervisor, pr._id, USER_ROLES.supervisor);
    });
    
    res.send(200);
};

/**
 * returns the request project and populates the users with their displayName.
 * populates the project brief.
 */ 
exports.getProject = function(req, res) {

    Project.findOne({ '_id' : req.params.id}).populate('brief')
                                             .populate('createdBy', 'displayName')
                                             .populate('team', 'displayName')
                                             .populate('supervisor', 'displayName')
                                             .populate('owners', 'displayName')
            .exec(function(err, project) {
                if(err){
                    console.log(err);
                    res.status(401).send({ message: err });
                }
                if(!project){
                    res.status(401).send({ message: 'Project not found' });
                }
                else{
                    project.coverPicture = faker.image.business();
                    project.company = faker.company.companyName();
                    project.description = faker.lorem.sentence();
                    res.status(200).send(project);
                }
            });
};

/**
 * updates the brief.
 */ 
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

/**
 * returns all projects created by user.
 */ 
exports.getUserProjects = function(req, res){
      
    Project.find({createdBy : req.user }).populate('createdBy', 'displayName')
                                        .sort({ dateCreated : 'desc'})
           .exec(function(err, projects) {
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

/**
 * adds user to the project with the given role.
 * updates user.owners if the role is owner.
 */ 
exports.addUserToProject = function(req, res){
    
    var pr = req.body;
    Project.findById(pr.projectId, function(err, project) {
        if(err){
            res.send(500).send({ message : err });
        }
        if (!project) {
            res.status(404).send({ message: 'Project not found' });
        }
       
        if(pr.role === USER_ROLES.team && project.team.indexOf(pr.userId) === -1){
            project.team.push(pr.userId);
            project.markModified('team');
        }
        if(pr.role === USER_ROLES.supervisor && project.supervisors.indexOf(pr.userId) === -1){
            project.supervisors.push(pr.userId);
            project.markModified('supervisors');
        }
        if(pr.role === USER_ROLES.owner && project.owners.indexOf(pr.userId) === -1){
            project.owners.push(pr.userId);
            project.markModified('owners');
            addProjectToOwner(pr.userId, pr.projectId);
        }
        project.dateUpdated = Date.now();
        project.save(function(err) {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }
            res.status(200).send(project);
        });
    });
};

/**
 * adds projectId to user.owner property
 */ 
function addProjectToOwner(userId, projectId){
     
    User.findOne({_id : userId}, function(err, user){
        if(err){
            console.log(err);
        }
        
        user.roles.owner.push(projectId);
        user.save(function(err) {
            if(err){
                console.log(err);
            }
        });
    });
}

/**
 * creates brief with empty values and returns brief object to be used in createProject.
 */ 
function createBrief(){
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
    return brf;
}

/**
 * removes projectId from user.roles based on the role
 */ 
function removeProjectFromUsers(userIds, prId, role){
   
    User.find({_id : {$in: userIds } }, function(err, users){
        if(err){
            console.log(err);
            return;
        }
        if(!users){
            return;
        }
        else{
            users.forEach(function(user, idx){
                switch (role) {
                    case USER_ROLES.owner:
                           user.roles.owner.pop(prId);
                        break;
                    case USER_ROLES.teamMember:
                           user.roles.teamMember.pop(prId);
                        break;
                    case USER_ROLES.supervisor:
                         user.roles.supervisor.pop(prId);
                         break;
                    default:
                        break;
                }
                user.save(function(err) {
                    if(err){
                        console.log(err);
                        return;
                    }
                });
            });
        }
    });
}