'use strict';

var mongoose = require('mongoose'),  
    extend = require('mongoose-schema-extend');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var cardSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name : String,
    createdBy : { type: String, ref: 'User'},
    updatedBy :  { type: String, ref: 'User'},
    createdDate : Date,
    updatedDate : Date,
    visibileTo : { value : Number , name : String }
}, { collection : 'methodcards' , discriminatorKey : '_type' });


var frameSchema = cardSchema.extend({
   typeOf : String,
   project : { type: String, ref: 'Project'},
   subType : String
});

var descriptionSchema = frameSchema.extend({
    text : String,
    media : { mediaType : String, url : String }
});

var objectiveSchema = frameSchema.extend({
    text : String,
    media : { mediaType : String, url : String }
});

var effortSchema = frameSchema.extend({
    knowledge : { value : Number , name : String },
    feasibility : { value : Number , name : String },
    idea : { value : Number , name : String },
    innovation : { value : Number , name : String },
    presentation : { value : Number , name : String }
});

var milestoneSchema = frameSchema.extend({
    projectLaunch : Date,
    concept : Date,
    initialDesign : Date,
    finalDesign : Date,
    
    items : [{
        title : String,
        date : Date,
        status : String,
        visibileTo : { value : Number , name : String }
    }]
});

var scopeSchema = frameSchema.extend({
    whatToProduce : String,
    whatItContains : String,
    whatItNotContain : String,
    primaryTarget : String
});

var backgroundSchema = frameSchema.extend({
    howProjectCame : String,
    whoIsInvolved : String,
    whatItSaysAboutYou : String,
    particularIdea : String
});

var travelSchema = frameSchema.extend({
    text : String,
    media : { mediaType : String, url : String }
});

var aboutTeamSchema = frameSchema.extend({
    teamName: String,
    aboutUs : String,
    avatar : String
});

var teamSetupSchema = frameSchema.extend({
    decisionMaking : String,
    timeManagement :{ 
        availability : String,
        lateComing : String,
        absence : String
    },
    communication : {
        onlineOffline : String,
        appropriateWays : String
    },
    teamValues : String
});

var teamSkillSchema = frameSchema.extend({
    skllName: String,
    aboutUs : String,
    avatar : String
});



var MethodCard = mongoose.model('MethodCard', cardSchema);
var FramingCard = mongoose.model('FramingCard', frameSchema);

var ProjectDescription = mongoose.model('ProjectDescription', descriptionSchema);
var ProjectObjective = mongoose.model('ProjectObjective', objectiveSchema);
var ProjectEffort = mongoose.model('ProjectEffort', effortSchema);
var ProjectMilestone = mongoose.model('ProjectMilestone', milestoneSchema);
var ProjectScope = mongoose.model('ProjectScope', scopeSchema);
var ProjectBackground = mongoose.model('ProjectAbout', backgroundSchema);
var ProjectTravel = mongoose.model('ProjectTravel', travelSchema);
var TeamAbout = mongoose.model('TeamAbout', aboutTeamSchema);
var TeamSetup = mongoose.model('TeamSetup', teamSetupSchema);
var TeamSkill = mongoose.model('TeamSkill', teamSkillSchema);

module.exports = { 
                   Card : MethodCard, Framing : FramingCard, 
                   Description : ProjectDescription, Objective : ProjectObjective,
                   Effort : ProjectEffort, Milestone : ProjectMilestone,
                   ProjectScope : ProjectScope, Background : ProjectBackground,
                   Travel : ProjectTravel,
                   AboutTeam : TeamAbout, SetupTeam : TeamSetup, SkillTeam : TeamSkill
                };
