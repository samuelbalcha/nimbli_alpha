'use strict';

var mongoose = require('mongoose');
var shortid = require('shortid');

// DiscussionSchema
var discussionSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    project : { type: String, ref: 'Project'},
    postedBy: { type: String, ref: 'User'},
    dateCreated : Date,
    dateUpdated : Date,
    visibility : [ { type : String } ],
    post : { type: String, trim: true },
    postType : Number
});

discussionSchema.pre('save', function(next) {
    var discussion = this;
    discussion.dateCreated = Date.now();
    next();
});
