'use strict';

var crypto = require('crypto');
var User = require('./models/user');
var auth = require('./authentication');
var ProjectSchema = require('./models/project');
var Project = ProjectSchema.Project;

exports.getAccess = function(req, res){

     User.findById(req.user, function(err, user) {
        if(err){
            console.log(err);
            res.status(401).send({ message: err });
        }
        if(!user){
            res.status(401).send({ message: 'User not found' });
        }
        else{
            
             var userId = req.user;
            Project.find().or([{ createdBy: userId, team: userId, supervisors :userId }], function(err, projects){
                if(err){
                    console.log(err);
                    res.status(401).send({ message: 'User has no projects' });
                }
                
                console.log("with or", projects);
            });
            
            Project.where('createdBy', req.user).find({}).distinct('_id', function(err, projects){
                if(err){
                    console.log(err);
                    res.status(401).send({ message: 'User has no projects' });
                }
                
                for (var i =0; i < projects.length; i++) {
                    if(projects[i]._id !== undefined)
                        user.roles.owner.push(projects[i]._id);
                }
                 console.log(user);
                res.send(user);
            });
        }
        
     });
};

function isPartOf(owners, user){
    
    for(var i=0; i < owners.length; i++){
        var id = owners[i];
        if(id === user){
            return true;
        }
    }
    
    return false;
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
            res.send(user);
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
        user.avatar = req.body.avatar || user.avatar;

        user.save(function(err) {
            if(err){
                console.log(err);
            }
            res.status(200).end();
        });
    });
};

// User routes Test purposes ======================================
exports.users = function(req, res) {

    //get all users in the database
    User.find().select('displayName about skills' ).exec(function(err, users) {
        
        if (err){
            res.status(401).send({ message : err});
        }
        res.status(200).send(users); 
    });
};

exports.user =  function(req, res) {
   
    User.findOne({'_id' : req.params.id}).populate(({ path: 'Project' })).exec(function(err, user) {
        if (err){
            res.status(401).send({ message: err});
        }
        
         getUserProjects(user.roles.owner, function(data){
             
             res.status(200).send({ user: user, userProjects : data }); 
         });
         
    });
   
};


function getUserProjects(pids, callback){
    var userProjects = [];
    
    Project.find({_id : { $in: pids } }, function(err, projects){
        if(err){
            console.log(err);
        }
        if(!projects){
        }
        else{
            projects.forEach(function(project, idx){
                userProjects.push({
                    _id : project._id,
                    title : project.title,
                    coverPicture : project.coverPicture,
                    description : project.description,
                    status : project.status,
                    dateCreated: project.dateCreated
                });
            });
             
            callback(userProjects);
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
