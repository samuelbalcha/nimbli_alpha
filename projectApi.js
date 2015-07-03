'use strict';

var ProjectSchema = require('./models/project');
var Project = ProjectSchema.Project;

exports.createProject = function(req, res){

    var pr = req.body.project;

    Project.findOne({ title : req.body.project.title}, function(err, existingProject){
        if (existingProject) {
             res.status(409).send({ message: 'The project is already taken' });
        }
        if(err){
             res.status(403).send({ message : err });
        }

        var project = new Project({
            title : pr.title,
            company : pr.company,
            description : pr.description,
            createdBy : req.user
        });

        project.save(function(err) {
            if(err){
                console.log(err);
            }
            res.status(201).send(project);
        });
    });
};

exports.updateProject = function(req, res){

    var pr = req.body.project;

    Project.findById(pr._id, function(err, project) {
        if (!project) {
            res.status(404).send({ message: 'Project not found' });
        }
        //console.log(req.user); // returns id

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
            }

            res.status(200).end();
        });
    });
};

exports.getProjects = function(req, res){

    Project.find(function(err, projects) {
        if (err){
            res.status(404).send(err);
        }
        res.json(projects);
    });
};

exports.deleteProject = function(req, res){

    Project.findOneAndRemove({ _id : req.params.id }, function(err, pr){
        if(err){
            console.log(err);
            res.status(404).send(err);
        }
        console.log("removed: " + pr._id);
    });
    res.send(200);
};

exports.getProject = function(req, res) {

    Project.findOne({ '_id' : req.params.id}, function(err, project) {
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