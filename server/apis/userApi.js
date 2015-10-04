'use strict';

var crypto = require('crypto');
var User = require('../models/user');
var auth = require('./authentication');
var ProjectSchema = require('../models/project');
var Project = ProjectSchema.Project;

var fs = require('fs');
var mongoose = require('mongoose');
var conn = mongoose.connection;
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);

exports.getAccess = function(req, res){
  console.log("getAccess called");
     User.findById(req.user, function(err, user) {
        if(err){
            console.log(err);
            res.status(401).send({ message: err });
        }
        if(!user){
            res.status(401).send({ message: 'User not found' });
        }
        else{
                getUserRoles(req.user, user, res);
                res.send(user);
            }
     });
};

function getUserRoles(userId, user, res){
    var people = [];
            
    Project.find({ createdBy : userId, $or : [{ team : userId, supervisor : userId }] }).distinct('_id', function(err, projects){
        if(err){
            console.log(err);
            res.status(401).send({ message: 'User has no projects' });
        }
        
        for (var i =0; i < projects.length; i++) {
            if(projects[i]._id !== undefined){
                if(projects[i].team.indexOf(userId) !== -1){
                    user.roles.teamMember.push(projects[i]._id);
                }
                if(projects[i].supervisor.indexOf(userId) !== -1){
                    user.roles.supervisor.push(projects[i]._id);
                }
                if(projects[i].owners.indexOf(userId) !== -1){
                    user.roles.owner.push(projects[i]._id);
                }
                
                people = addPeople(people, projects[i].team);
                people = addPeople(people, projects[i].supervisors);
                people = addPeople(people, projects[i].owners);
            }   
        } 
        console.log("getUserRoles", people);
    });
}

function addPeople(people, toAdd){
    for(var i=0; i < toAdd.length; i++){
        
        var person = { _id: toAdd[i]._id, name : toAdd[i].displayName };
        if(people.indexOf(person) == -1){
            people.push(person);
        } 
    }
    
    return people;
}

exports.getProfile = function(req, res) {

    User.findById(req.user, function(err, user) {
        if(err){
            console.log(err);
            res.status(401).send({ message: err });
        }
        if(!user){
            res.status(401).send({ message: 'User not found' });
        }
        else{
            //console.log(user);
            res.status(200).send(user);
        }
    });
};

exports.updateProfile = function(req, res) {
    User.findById(req.user, function(err, user) {
        if(err){
            console.log(err);
            res.status(401).send({ message : err });
        }
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }
        console.log(req.body); // returns id
       
        user.displayName = req.body.displayName || user.displayName;
        user.email = req.body.email || user.email;
        user.skills = req.body.skills || user.skills;
        user.about = req.body.about || user.about;
        user.markModified('skills');
        user.location = req.body.location || user.location;
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.title = req.body.title || user.title;
        user.dateUpdated = Date.now();
        user.save(function(err) {
            if(err){
                console.log(err);
            }
            res.status(200).send(user);
        });
    });
};

// User routes Test purposes ======================================
exports.users = function(req, res) {

    //get all users in the database
    User.find().select('displayName about' ).exec(function(err, users) {
        
        if (err){
            res.status(401).send({ message : err});
        }
        res.status(200).send(users); 
    });
};

exports.user =  function(req, res) {
    
    User.findOne({'_id' : req.params.id}, function(err, user) {
        if (err){
            res.status(401).send({ message: err});
        }
        if(!user){
            res.status(401).send({ message : err });
        }
        else{
             var userProjects, teamMember, supervised;
             getUserProjects(user.roles.owner, function(data){
                 userProjects = data;
             }); 
             getUserProjects(user.roles.teamMember, function(data){
                 teamMember = data;
             });
             getUserProjects(user.roles.supervisor, function(data){
                 supervised = data;
                 res.status(200).send({ user: user, contributions : [ userProjects, teamMember, supervised ] });
             }); 
        }});    
};

function getUserProjects(pids, callback){
    
    Project.find({_id : { $in: pids } })
           .populate('team', 'displayName avatar')
           .populate('supervisors', 'displayName avatar')
           .populate('owners', 'displayName avatar')
           .sort({ dateCreated : 'desc'}).exec(function(err, projects){
            if(err){
                console.log(err);
            }
            if(!projects){
                 console.log("no project found");
            }
            else{
                callback (projects);
            }
    });
}

exports.delUser =  function(req, res){
    User.findOneAndRemove({ _id : req.params.id }, function(err, user){
        if(err){
            console.log(err);
        }
        console.log("removed: " + user._id);
    });
    res.send(200);
};

exports.aws = function(keyId, secret, bucket, acl){

    return function(req, res){

        var id = req.params.id;
        var keyname = id + ".jpg";
        var policy2 = {
            expiration: getExpiryTime(),
            conditions: [
                {bucket: bucket },
                ["starts-with", "$key", keyname],
                {"acl": acl },
                ["starts-with", "$Content-Type", ""],
                ["content-length-range", 0, 524288000]
            ]
        };
        //v2_uploader
        // stringify and encode the policy
        var stringPolicy = JSON.stringify(policy2);
        var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

        // sign the base64 encoded policy
        var signature = crypto.createHmac('sha1', secret)
                              .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

        var aws = {
            keyid: keyId,
            policy: base64Policy,
            signature: signature,
            keyname: keyname
        };
        res.json(aws);
   };
};

function getExpiryTime () {
    var _date = new Date();
    return '' + (_date.getFullYear()) + '-' + (_date.getMonth() + 1) + '-' +
        (_date.getDate() + 1) + 'T' + (_date.getHours() + 3) + ':' + '00:00.000Z';
}

exports.uploadAvatar = function(req, res){
    if(req.file === null || req.file === undefined) return;
    
    var is, os;
    var extension = req.file.originalname.split(/[. ]+/).pop();
    var filename =  req.params.id + '_' + Date.now() + '.'+ extension;
    
    is = fs.createReadStream(req.file.path);
    gfs.files.find({ filename:  new RegExp('^'+ req.params.id +'$', "i") }).toArray(function (err, files) {
         if (err) {
             res.send(500).send({ message : err });
         }
         if(files.length > 0){
            //if file exists update with new file 
            gfs.remove({ filename: new RegExp('^'+ req.params.id +'$', "i") }, function (err) {
                if (err){ 
                    console.log("could not remove image", req.params.id);
                    res.send(500).send({ message : err }); 
                }
            });
         }
        os = gfs.createWriteStream({ filename: filename });
        is.pipe(os);
        
        os.on('close', function (file) {
        //Update user avatar
            User.findById(req.params.id, function(err, user) {
                if(err){
                    res.send(500).send({ message : err });
                }
                if (!user) {
                    res.status(404).send({ message: 'User not found' });
                }
                else{
                    user.avatar = '/api/users/avatar/' + filename;
                    user.dateUpdated = Date.now();
                    user.save(function(err) {
                        if(err){
                            console.log(err);
                            res.status(500).send(err);
                        }
                        res.status(200).send(user);
                    });
                }
            });
            
            //delete file from upload folder
            fs.unlink(req.file.path, function() {});
        });
    });     
};

exports.getAvatar = function(req, res){
   
    res.set('Content-Type', 'image/jpeg');
    var readstream = gfs.createReadStream({filename: req.params.filename });
    readstream.pipe(res); 
};