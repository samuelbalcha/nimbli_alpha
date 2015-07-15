'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// ProjectSchema
var projectSchema = new mongoose.Schema({
    title : { type: String, trim : true, unique : true },
    company : String,
    coverPicture: { type: String, trim: true },
    driveLink : String,
    skills : [{
        name : String,
        id : Number
    }],
    brief : { type: mongoose.Schema.Types.ObjectId, ref: 'Brief'},
    location : { type: String, trim: true },
    owners : [ { type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    likesCount : Number,
    viewsCount : Number,
    dateCreated : Date,
    dateStarted : Date,
    dateCompleted : Date,
    dateCancelled : Date,
    dateUpdated : Date,
    status : Number,
    description : { type: String, trim: true },
    team : [ { type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

/* project status
  0 : Created
  1 : Published
  2 : Accepted
  3 : Cancelled
  4 : InProgress
  5 : Completed
 */

projectSchema.pre('save', function(next) {
    var project = this;
    project.dateCreated = Date.now();
    project.status = 0;

    next();
});

var briefSchema = new mongoose.Schema({
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

var Project = mongoose.model('Project', projectSchema);
var Brief = mongoose.model('Brief', briefSchema);

module.exports = { Project : Project, Brief : Brief };
