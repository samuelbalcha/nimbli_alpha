'use strict';

var mongoose = require('mongoose');
var shortid = require('shortid');

// ReflectionSchema
var reflectionSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    project : { type: String, ref: 'Project'},
    postedBy: { type: String, ref: 'User'},
    dateCreated : Date,
    dateUpdated : Date,
    visibileTo : [ { type: String, ref: 'User'} ],
    content : { type: String, trim: true },
    mood : String
});

reflectionSchema.pre('save', function(next) {
    var reflection = this;
    reflection.dateCreated = Date.now();
    next();
});

var Reflections = mongoose.model('Reflection', reflectionSchema);
module.exports = { Reflections : Reflections };