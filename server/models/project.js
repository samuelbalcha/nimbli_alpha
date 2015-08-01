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
    title : { type: String, trim : true, unique : true },
    company : String,
    coverPicture: { type: String, trim: true },
    driveLink : String,
    brief : { type: String, ref: 'Brief'},
    location : { type: String, trim: true },
    owners : [ { type: String, ref: 'User'}],
    createdBy: { type: String, ref: 'User'},
    likesCount : Number,
    viewsCount : Number,
    dateCreated : Date,
    dateStarted : Date,
    dateCompleted : Date,
    dateCancelled : Date,
    dateUpdated : Date,
    status : {
            type: [{
                type: String,
                enum: [ 'Private', 'Published', 'Started', 'InProgress', 'Completed', 'Accepted']
            }],
            default: 'Private'
        },
    description : { type: String, trim: true },
    team : [ { type: String, ref: 'User'}],
    supervisors : [ { type: String, ref: 'User'}],
    school : { type: String }
   // projectRequest : [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectRequest'}]
});

projectSchema.pre('save', function(next) {
    var project = this;
    project.dateCreated = Date.now();
    next();
});

// BriefSchema
var briefSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    outcome : String,
    objective : String,
    deliverable : String,
    approach : String,
    performanceIndicators : String,
    riskAssessment : String,
    dateUpdated : Date,
    startDate : Date,
    endDate : Date,
    briefCreatedByUser : Boolean
});

// RequestSchema
var requestSchema = new mongoose.Schema({
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    project : { type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    role : Number, 
    dateRequested : Date,
    requestStatus : { type: Number, default : 0 },
    note : { type : String, trim : true },
    responseDate : Date
});

requestSchema.pre('save', function(next) {
    var re = this;
    re.dateRequested = Date.now();
    next();
});

// role : 0 = TeamMember, 1 = Supervisor, 2 = Owner 
// requestStatus : 0 = Active, 1 = Accepted,  2 = Rejected 

var Project = mongoose.model('Project', projectSchema);
var Brief = mongoose.model('Brief', briefSchema);
var ProjectRequest = mongoose.model('ProjectRequest', requestSchema);

module.exports = { Project : Project, Brief : Brief , ProjectRequest : ProjectRequest };
