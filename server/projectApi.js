'use strict';

var ProjectSchema = require('./models/project');
var Project = ProjectSchema.Project;
    
exports.createProject = function(req, res){
    
    var pr = req.body;
    var br = ProjectSchema.Brief;
    
    Project.findOne({ title : pr.title}, function(err, existingProject){
        if (existingProject) {
            res.status(409).send({ message: 'The project title is already taken' });
        }
        if(err){
            res.status(403).send({ message : err });
        }
    
        //Create Brief 
        var brf = new br({ 
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
            res.status(201).send(project);
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
    
    Project.find().sort({ dateCreated : 'desc'}).exec(function(err, projects) {
        if (err){
            res.status(404).send(err);
        }
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
        var brf = ProjectSchema.Brief;
        
        brf.findOneAndRemove({ _id : pr.brief }, function(err, br){
            if(err){
                console.log("could not remove brief");
            }
            console.log("removed brief" + br._id);
        });
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
    
    Project.findOne({ '_id' : req.params.id}).populate('brief').exec(function(err, project) {
        if(err){
            console.log(err);
            res.status(401).send({ message: err });
        }
        if(!project){
            res.status(401).send({ message: 'Project not found' });
        }
        else{
            res.status(200).send(project);
        }
    });
};
