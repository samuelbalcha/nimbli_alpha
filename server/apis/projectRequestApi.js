'use strict';

var ProjectRequestSchema = require('../models/projectRequest');
var USER_ROLES = require('constants');

var ProjectRequest = ProjectRequestSchema.ProjectRequest;

/**
 * creats a new project and saves it to collection. 
 * it creates a brief object and attaches it to the project.
 * it addes the projectid to the user.
 */
exports.createProjectRequest = function(req, res){
    
    var pr = req.body;
    ProjectRequest.findOne({ senderUser : pr.senderUser, project : pr.projectId }, function(err, existingPR){
        if (existingPR && existingPR.length > 0) {
            res.status(409).send({ message: 'You have already sent a request' });
        }
        if(err){
            res.status(403).send({ message : err });
        }
        else{
           
            var projectRequest = new ProjectRequest({
                senderUser : pr.senderUser,
                project : pr.projectId,
                role : pr.role === 0 ? 'team' : 'supervisor',
                status : 'new',
                note : pr.note,
                toUser : pr.toUser
            });
            
            projectRequest.save(function(err) {
                if(err){
                    res.status(403).send({ message : err });
                }
            });
            
            res.status(201).send(projectRequest);
        }
    });
};

exports.getProjectRequest = function(req, res){
    var pr = req.params;
    console.log(pr);
    ProjectRequest.find({senderUser : pr.user, project : pr.projectId }, function(err, found){
        if(err){
            res.status(403).send({ message : err });
        }
        if(found){
            console.log(found);
            res.status(200).send(found);
        }
        else res.status(200).send([]);
    });
};

exports.updateProjectRequest = function(req, res){
    var pr = req.params;
    console.log("updateProjectRequest",pr);
    ProjectRequest.findById(req.params.id , function(err, pReq){
        if(err){
            res.status(403).send({ message : err });
        }
        
        pReq.status = 'Accepted';
        pReq.responseDate = Date.now();
        
        pReq.save(function(err){
            if(err){
                res.status(403).send({ message : err });
            }
            res.status(200).send(pReq);
        }); 
    });
};

exports.getProjectRequests = function(req, res){
    var pr = req.params;
    
    ProjectRequest.find({ toUser : pr.user, project : pr.projectId, status : 'new' }, function(err, prs){
        if(err){
            res.status(403).send({ message : err });
        }
        if(!prs){
            res.status(404).send();
        }
        res.status(200).send(prs);
    });
};

exports.removeRequest = function(req, res){
    ProjectRequest.findOneAndRemove({ _id : req.params.id }, function(err, pr){
        if(err){
            res.status(404).send(err);
        }
        res.send(200);
    });
    
    
};