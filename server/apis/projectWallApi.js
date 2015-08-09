'use strict';

var DiscussionsSchema = require('../models/discussion');
var USER_ROLES = require('constants');

var Discussion = DiscussionsSchema.Discussions;

exports.createPost = function(req, res){
    var po = req.body;
   
    var post = new Discussion({
                project : po.project,
                postedBy: po.postedBy,
                visibility : po.visibileTo,
                content : po.content,
                postType : po.contentType,  
            });
            
    post.save(function(err) {
        if(err){
            res.status(403).send({ message : err });
        }
    });
    
    res.status(201).send(post);
};

exports.getPosts = function(req, res){
    var params = req.query;
    var visibility;
    
    if(params.visibileTo === 'team'){
        visibility = ['team', 'connection', 'public'];
    }
    
    if(params.visibileTo === 'connection'){
        visibility = ['connection', 'public'];
    }
    
    if(params.visibileTo === 'public'){
        visibility = [ 'public'];
    }
   
    Discussion.find({ project : req.params.id , visibility : { $in: visibility }  })
              .populate('postedBy', 'displayName')
              .sort({ dateCreated : 'desc'})
              .exec(function(err, posts){
                    if (err){
                        res.status(404).send(err);
                    }
                    if(!posts){
                        res.status(404).send();
                    }
                    else{
                        res.status(200).send(posts);
                    }   
              });
};

