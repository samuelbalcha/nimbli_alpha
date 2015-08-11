'use strict';
var fs = require('fs');
var DiscussionsSchema = require('../models/discussion');
var USER_ROLES = require('constants');

var Discussion = DiscussionsSchema.Discussions;

exports.createPost = function(req, res){
    
    var po, post;
    if(req.file){
         po = req.body;
         
         post = new Discussion();
         post.content = po.content; 
         post.caption = po.caption;
         post.action = po.action;    
         post.postType = po.postType;   
         post.visibility = po.visibility;    
         post.postedBy = po.postedBy;
         post.project = po.project;
         post.img.data = fs.readFileSync(req.file.path);
         post.img.contentType = 'image/png';
         
         post.save(function(err) {
         if(err){
                console.log(err);
                res.status(403).send({ message : err });
          }
    });
     }
     else{
       po = req.body;
       post = new Discussion({
                project : po.project,
                postedBy: po.postedBy,
                visibility : po.visibileTo,
                content : po.content,
                postType : po.contentType,
                action : po.action
            });
            
     }  
    
   console.log(post);
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
              .populate('postedBy', 'displayName avatar')
              .sort({ dateCreated : 'desc'})
              .exec(function(err, posts){
                    if (err){
                        res.status(404).send(err);
                    }
                    if(!posts){
                        res.status(404).send();
                    }
                    else{
                        posts.forEach(function(idx, post){
                            var base64 = (post.img.data.toString('base64'));
                            console.log("getPosts", base64)
                        });
                        
                        res.status(200).send(posts);
                    }   
              });
};

