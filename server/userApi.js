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
            
            Project.where('createdBy', req.user).find({}, function(err, projects){
                if(err){
                    console.log(err);
                    res.status(401).send({ message: 'User has no projects' });
                }
                
                for (var i =0; i < projects.length; i++) {
                    user.roles.owner.push(projects[i]._id);
                }
                 
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
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }
        //console.log(req.user); // returns id

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
    User.find(function(err, users) {
        
        if (err){
            res.send(err);
        }
        res.json(users); 
    });
};

exports.user =  function(req, res) {

    User.findOne({'_id' : req.params.id},function(err, user) {
        if (err){
            res.send(err);
        }
        res.json(user); 
    });
};

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
