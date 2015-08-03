'use strict';

var mongoose = require('mongoose');
var shortid = require('shortid');

// RequestSchema
var requestSchema = new mongoose.Schema({
     _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    senderUser : { type: String, ref: 'User'},
    project : { type: String, ref: 'Project'},
    role : String, 
    dateRequested : Date,
    status : String,
    note : { type : String, trim : true },
    responseDate : Date,
    toUser : { type: String, ref: 'User'}
});

requestSchema.pre('save', function(next) {
    var re = this;
    re.dateRequested = Date.now();
    next();
});

var ProjectRequest = mongoose.model('ProjectRequest', requestSchema);
module.exports = { ProjectRequest : ProjectRequest };