'use strict';

var mongoose = require('mongoose');
var shortid = require('shortid');

// ProjectSchema
var projectSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    
    // Initial
    title : { type: String, trim : true, unique : true },
    description : { type: String, trim: true },
    coverPicture: { type: String, trim: true },
    drive : {
        folderId : String,
        owner : { type: String, ref: 'User'},
        dateCreated : Date,
        link : String
    },
    location : { type: String, trim: true },
    
    likesCount : Number,
    viewsCount : Number,
    
    // Dates
    dateCreated : Date,
    dateStarted : Date,
    dateCompleted : Date,
    dateCancelled : Date,
    dateUpdated : Date,
    
    status : {
        type: [{
            type: String,
            enum: [ 'Not started', 'Private', 'Published', 'Started', 'InProgress', 'Completed', 'Accepted']
        }],
        default: 'Not started'
    },
        
    visibileTo : {
            type: [{
                type: String,
                enum: [ 'Public', 'Private']
            }],
            allowed : [{ type: String, ref: 'User'}]
        },
        
    // People
    createdBy: { type: String, ref: 'User'},
    owners : [ { type: String, ref: 'User'}],
    team : [ { type: String, ref: 'User'}],
    supervisors : [ { type: String, ref: 'User'}],
    
    // Organizations
    school : { type: String },
    company : String,
    methodCards : [ { type : String, ref : 'MethodCard' }]  
});

projectSchema.pre('save', function(next) {
    var project = this;
    project.dateCreated = Date.now();
    
    next();
});

var Project = mongoose.model('Project', projectSchema);
module.exports = { Project : Project };
