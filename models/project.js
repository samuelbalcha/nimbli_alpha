var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// ProjectSchema
var projectSchema = new mongoose.Schema({
    title : { type: String, trim : true },
    company : String,
    coverPicture: { type: String, trim: true },
    driveLink : String,
    skills : [{
        name : String,
        id : Number
    }],
    brief : { type: ObjectId },
    location : { type: String, trim: true },
    owners : [],
    createdBy: { type : ObjectId },
    likesCount : Number,
    viewsCount : Number,
    dateCreated : Date,
    dateStarted : Date,
    dateCompleted : Date,
    dateCancelled : Date,
    status : Number
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
    var currentDate = Date.now();
    project.dateCreated = currentDate;
    project.status = 0;
    next();
});

var briefSchema = new mongoose.Schema({
    outcome : String,
    objective : String,
    deliverable : String,
    scope : String,
    approach : String,
    exclusion : String,
    constraint : String,
    businessCase : String,
    reasonsForSelectingSolution : String,
    timetable : String,
    monitoring : String,
    performanceIndicators : String,
    riskAssessment : String,
    startDate : Date,
    endDate : Date
});

var Project = mongoose.model('Project', projectSchema);
var Brief = mongoose.model('Brief', briefSchema);

module.exports = { Project : Project, Brief : Brief };
