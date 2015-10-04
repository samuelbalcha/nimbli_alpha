'use strict';

var ProjectSchema = require('../models/project');
var User = require('../models/user');
var USER_ROLES = require('constants');
var Project = ProjectSchema.Project;
var Brief = ProjectSchema.Brief;
var AboutProject = ProjectSchema.AboutProject;
//var ProjectRequest = ProjectSchema.ProjectRequest;
var fs = require('fs');
var mongoose = require('mongoose');
var conn = mongoose.connection;
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
var activityApi = require('./activitiesApi');

/**
 * creats a new project and saves it to collection. 
 * it creates a brief object and attaches it to the project.
 * it addes the projectid to the user.
 */
exports.createProject = function(req, res){
    
    var pr = req.body;
    Project.findOne({ title : pr.title }, function(err, existingProject){
        if (existingProject) {
           return res.status(409).send({ message: 'The project title is already taken' });
        }
        if(err){
            res.status(403).send({ message : err });
        }
        else{
           
            var project = new Project({
                title : pr.title,
                company : pr.company,
                createdBy : req.user,
                visibileTo : pr.visibileTo,
                location : pr.location,
                school : pr.school,
                drive : pr.drive
            });
           
            project.owners.push(req.user);
            project.save(function(err) {
                if(err){
                    console.log(err);
                }
            });
            
            addProjectToUser(req.user, project._id, 'owner');
            
            res.status(201).send(project);
        }
    });
};

/**
 * uploades cover picture for projects and sets it's filename to projectid.
 * stores the image to GridFs fs.files collection.
 */ 
exports.uploadCover = function(req, res){
    if(req.file === null || req.file === undefined) return;
    
    var is, os;
    var extension = req.file.originalname.split(/[. ]+/).pop();
    var filename =  req.params.id +'.'+ extension;
    
    is = fs.createReadStream(req.file.path);
    gfs.files.find({ filename:  filename }).toArray(function (err, files) {
         if (err) {
             res.send(500).send({ message : err });
         }
         if(files.length > 0){
            //if file exists update with new file 
            gfs.remove({ filename: filename }, function (err) {
                if (err){ 
                    console.log("could not remove image", filename);
                    res.send(500).send({ message : err }); 
                } 
            });
         }
        os = gfs.createWriteStream({ filename: filename });
        is.pipe(os);
        
        os.on('close', function (file) {
        //Update project cover
            Project.findById(req.params.id, function(err, project) {
                if(err){
                    res.send(500).send({ message : err });
                }
                if (!project) {
                    res.status(404).send({ message: 'Project not found' });
                }
                else{
                    project.coverPicture = '/api/projects/cover/' + filename;
                    project.dateUpdated = Date.now();
                    project.save(function(err) {
                        if(err){
                            console.log(err);
                            res.status(500).send(err);
                        }
                        var act = {
                            project : project._id,
                            postedBy: req.user,
                            visibileTo : ['*'],
                            action : 'updated cover picture'
                        };
                        
                        activityApi.createActivity(act);
                        res.status(200).send(project);
                    });
                }
            });
            
            //delete file from upload folder
            fs.unlink(req.file.path, function() {});
        });
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
                project.drive = pr.drive || project.drive;
                project.dateUpdated = Date.now();
                project.location = pr.location || project.location;
                project.status = pr.status || project.status;
                project.dateStarted = pr.dateStarted || project.dateStarted;
                project.dateCancelled = pr.dateCancelled || project.dateCancelled;
                project.dateCompleted = pr.dateCompleted || project.dateCompleted;
                project.school = pr.school || project.school;
                project.visibileTo = pr.visibileTo || project.visibileTo;
                
                project.save(function(err) {
                    if(err){
                        console.log(err);
                        res.status(500).send(err);
                    }
                    //log activity
                    var act = {
                        project : project._id,
                        postedBy: req.user,
                        visibileTo : ['*'],
                        action : 'updated project info'
                    };
                    activityApi.createActivity(act);
                    
                    res.status(200).send(project);
                });
        }
    });
};

/**
 * returns projects with few fields and sorts by dateCreated.
 */
exports.getProjects = function(req, res){
      
    Project.find({ visibileTo : 'Public'})
           .sort({ dateCreated : 'desc'})
           .exec(function(err, projects) {
                if (err){
                    res.status(404).send(err);
                }
                if(!projects){
                    res.status(404).send();
                }
                else{
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
        
        AboutProject.findOneAndRemove({ _id : pr.aboutProject }, function(err, br){
            if(err){
                console.log("could not remove about");
            }
            //console.log("removed brief" + br._id);
        });
        
         //TODO romove cover image from gfs
         
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

    Project.findOne({ '_id' : req.params.id}).populate('methodCards')
                                             .populate('createdBy', 'displayName avatar')
                                             .populate('team', 'displayName avatar')
                                             .populate('supervisors', 'displayName avatar')
                                             .populate('owners', 'displayName avatar')
            .exec(function(err, project) {
                if(err){
                    console.log(err);
                    res.status(401).send({ message: err });
                }
                if(!project){
                    res.status(401).send({ message: 'Project not found' });
                }
                else{
                    //console.log(project);
                    res.status(200).send(project);
                }
            });
};

exports.getProjectCover = function(req, res){
    res.set('Content-Type', 'image/jpeg');
    //console.log(req.params.filename);
    var readstream = gfs.createReadStream({filename: req.params.filename });
    
    readstream.pipe(res); 
};



/**
 * returns all projects created by user.
 */ 
exports.getUserProjects = function(req, res){
    
    var conditions = { $or: [ { createdBy : req.user }, 
                              { team : req.user }, { supervisors : req.user }, { owners : req.user} ]};
    
    Project.find(conditions)
           .populate('createdBy', 'displayName avatar')
           .populate('team', 'displayName avatar')
           .populate('supervisors', 'displayName avatar')
           .populate('owners', 'displayName avatar')
           .exec(function(err, projects) {
                if (err){
                    res.status(404).send(err);
                }
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
       
        if(pr.role === 'team' && project.team.indexOf(pr.userId) === -1){
            project.team.push(pr.userId);
            project.markModified('team');
        }
        else if(pr.role === 'supervisor' && project.supervisors.indexOf(pr.userId) === -1){
            project.supervisors.push(pr.userId);
            project.markModified('supervisors');
        }
        else if(pr.role === 'owner' && project.owners.indexOf(pr.userId) === -1){
            project.owners.push(pr.userId);
            project.markModified('owners');
        }
        addProjectToUser(pr.userId, pr.projectId, pr.role);
        
        project.dateUpdated = Date.now();
        project.save(function(err) {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }
            
            var act = {
                        project : project._id,
                        postedBy: req.user,
                        visibileTo : ['*'],
                        action : 'added new user to project'
                    };
            activityApi.createActivity(act);
            
            res.status(200).send(project);
        });
    });
};

/**
 * adds projectId to user.owner property
 */ 
function addProjectToUser(userId, projectId, role){
     
    User.findOne({_id : userId}, function(err, user){
        if(err){
            console.log(err);
            return;
        }
        if(!user){
            return;
        }
        if(role === 'team' && user.roles.teamMember.indexOf(projectId) === -1){
            user.roles.teamMember.push(projectId);
        }
        if(role === 'supervisor' && user.roles.supervisor.indexOf(projectId) === -1){
            user.roles.supervisor.push(projectId);
        }
        if(role === 'owner' && user.roles.owner.indexOf(projectId) === -1){
             user.roles.owner.push(projectId);
        }
       
        user.save(function(err) {
            if(err){
                console.log(err);
            }
        });
    });
}

    

/**
 * updates aboutproject returns object.
 */ 
exports.updateAboutProject = function(req, res){ 
    var pr = req.body;
 
    Project.findById(req.params.id).populate('aboutProject').exec(function(err, project) {
        if(err){
            res.send(500).send({ message : err });
        }
        if (!project) {
            res.status(404).send({ message: 'Project not found' });
        }
        var aboutProject = project.aboutProject;
          
        updateAbout(pr, req.user, aboutProject, function(about){
           
            project.hasAboutProject = true;
            project.dateUpdated = Date.now();
            project.save(function(err) {
                if(err){
                    console.log(err);
                    res.status(500).send(err);
                }
                var act = {
                            project : project._id,
                            postedBy: req.user,
                            visibileTo : ['*'],
                            action : 'added project framing'
                        };
                        
                activityApi.createActivity(act);
            });
        }); 
         res.status(200).send(project);
    });
};

function updateAbout(pr, user, aboutProject, callback){
    console.log("I came here", pr)
    //var aboutPr = new  AboutProject();
    var name = pr.visibileTo.value === 0 ? 'Public' : 'Private';
    // Description 
    if(pr.name === 'description'){
        console.log(pr);
        aboutProject.description = {
            createdBy : user,
            text : pr.text,  
            media : {
                mediaType : pr.mediaType,
                url : pr.media.url
            },
            visibileTo : {
                value : pr.visibileTo.value,
                name : name
            }
        };
    }
    // Objective
    if(pr.name === 'objective'){
        aboutProject.objective = {
            createdBy : user,
            text : pr.text,
            media : {
                mediaType : pr.mediaType,
                url : pr.media.url
            },
            visibileTo : {
                value : pr.visibileTo.value,
                name : name
            }
        };
    }
    // Effort
    if(pr.name === 'effort'){
        console.log(pr);
        aboutProject.effort = {
            createdBy : user,
            knowledge : { value : pr.knowledge.value },
            feasibility : { value :pr.feasibility.value },
            idea :{ value : pr.idea.value },
            innovation : { value : pr.innovation.value },
            presentation : { value : pr.presentation.value },
            visibileTo : {
                value : pr.visibileTo.value,
                name : name
            }
        };
    }
    // Scope
    if(pr.name === 'scope'){
        aboutProject.scope = {
            lastUpdatedBy : user,
            howProjectCame : pr.howProjectCame,
            whatToProduce : pr.whatToProduce,
            whatItContains : pr.whatItContains,
            whatItNotContain : pr.whatItNotContain,
            particularIdea : pr.particularIdea,
            primaryTarget : pr.primaryTarget,
            whoIsInvolved : pr.whoIsInvolved,
            whatItSaysAboutTou : pr.whatItSaysAboutTou,
            milestone : {
                projectLaunch : pr.milestone.projectLaunch,
                concept : pr.milestone.concept,
                initialDesign : pr.milestone.initialDesign,
                finalDesign : pr.milestone.finalDesign
            },
            visibileTo : {
                value : pr.visibileTo.value,
                name : name
            }
        };
    }
    
    aboutProject.save(function(err){
        if(err){
            console.log(err);
        }
       
    });
    
    return callback(aboutProject);
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