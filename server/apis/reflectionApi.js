'use strict';

var ReflectionSchema = require('../models/reflection');
var Reflection = ReflectionSchema.Reflections;
var USER_ROLES = require('../constants').USER_ROLES;

exports.createReflection = function(req, res){
    var po = req.body;
    console.log(po);
    var reflect = new Reflection({
            project : po.project,
            postedBy: po.postedBy,
            visibileTo : po.visibileTo,
            content : po.content,
            mood : po.mood
        });
    
    reflect.save(function(err) {
        if(err){
            console.log(err);
            res.status(403).send({ message : err });
        }
        res.status(201).send(reflect);
    });
};

exports.getReflections = function(req, res){
  
    var conditions =  { project : req.params.id, postedBy : req.user };
  
    Reflection.find(conditions)
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
                        res.status(200).send(posts);
                    }   
               });
};

exports.getSharedReflections = function(req, res){
  
    var conditions =  { project : req.params.id, visibileTo: req.user };

    Reflection.find().where({"postedBy" : { "$ne": req.user }})
              .or(conditions)
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
                        res.status(200).send(posts);
                    }   
               });
};

exports.removeReflection = function(req, res){
    Reflection.findOneAndRemove({ _id : req.params.id }, function(err, po){
        if(err){
           // console.log(err);
            res.status(404).send(err);
        }
        res.send(200);
    });
};