'use strict';

var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

// SkillSchema
//var SkillSchema = new mongoose.Schema({ id: Number, name: String });

// UserSchema
var userSchema = new mongoose.Schema({
    email : { type: String, unique: true, lowercase: true },
    password : { type: String, select: false },
    displayName :{ type: String, trim: true},
    avatar: { type: String, trim: true},
    google : String,
    github : String,
    linkedin : String,
    skills : [{
        name : String,
        id : Number
    }],
    about : { type: String, trim: true},
    location : { type: String, trim: true},
    roles : {
        owner : [ { type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
        teamMember : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project'}]
    }
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

var User = mongoose.model('User', userSchema);
module.exports = User;
