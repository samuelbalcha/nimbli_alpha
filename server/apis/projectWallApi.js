'use strict';
var fs = require('fs');
var DiscussionsSchema = require('../models/discussion');
var USER_ROLES = require('constants');
var Discussion = DiscussionsSchema.Discussions;


exports.createPost = function(req, res){
        
   var po = req.body;
    
    var post = new Discussion({
            project : po.project,
            postedBy: po.postedBy,
            visibileTo : po.visibileTo,
            content : po.content,
            postType : po.contentType,
            action : po.action,
            thumbnailUrl : po.thumbnailUrl,
            docId : po.docId,
            caption : po.caption
    });
    
    post.save(function(err) {
        if(err){
            console.log(err);
            res.status(403).send({ message : err });
        }
        res.status(201).send(post);
    });  
};

exports.getPosts = function(req, res, next){
     /**
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
   */
    Discussion.find({ project : req.params.id , visibileTo : req.user })
              .populate('postedBy', 'displayName firstName lastName avatar')
              .sort({ dateCreated : 'desc'}).limit(20)
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

exports.removePost = function(req, res){
    Discussion.findOneAndRemove({ _id : req.params.id }, function(err, po){
        if(err){
            console.log(err);
            res.status(404).send(err);
        }
        
        res.send(200);
    });
};

exports.getPost = function(id, callback){
    Discussion.findById(id).populate('postedBy', 'displayName firstName lastName avatar')
            .sort({ dateCreated : 'desc'})
            .exec(function(err, post){
            if (err){
                  return err;
            }
            if(!post){
               return null;
            }
            else{
               return callback(post);
            }   
    });
};