'use strict';

var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var shortid = require('shortid');

// SkillSchema
//var SkillSchema = new mongoose.Schema({ id: Number, name: String });

// UserSchema
var userSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
   email: {
        type: String,
        unique : true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password : { type: String, select: false },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    displayName :{ type: String, trim: true},
    avatar: { type: String, trim: true},
    google : String,
    skills : [{
        name : String,
        id : Number
    }],
    about : { type: String, trim: true },
    location : { type: String, trim: true},
    roles : {
        owner : [ { type: String, ref: 'Project'}],
        teamMember : [{ type: String, ref: 'Project'}],
        supervisor : [{ type: String, ref: 'Project'}]
    },
    
    userType :  [{
            type: String,
            enum: ['Student', 'Teacher', 'Organization personnel'],
            default : 'Student'
        }],
   
    school :  { type: mongoose.Schema.Types.ObjectId, ref: 'School'},
    program : String,
    degree : {
            type: [{
                type: String,
                enum: ['Bachelors', 'Masters', 'Phd']
            }],
            default: 'Bachelors'
        },
    title : String,
    organization: String,
    userRole: String,
    dateUpdated : Date
});


userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        if(err){
            console.log(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err){
                console.log(err);
            }
            user.password = hash;
            next();
        });
    });
    
    user.dateUpdated = Date.now();
});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

var User = mongoose.model('User', userSchema);
module.exports = User;
