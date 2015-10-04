'use strict';

var mongoose = require('mongoose');
var shortid = require('shortid');

// ActivitySchema
var activitySchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    project : { type: String, ref: 'Project'},
    postedBy: { type: String, ref: 'User'},
    dateCreated : Date,
    visibileTo : [ { type: String, ref: 'User'} ],
    action : { type: String, trim: true }
});

activitySchema.pre('save', function(next) {
    var activity = this;
    activity.dateCreated = Date.now();
    next();
});

var Activities = mongoose.model('Activities', activitySchema);
module.exports = { Activities : Activities };