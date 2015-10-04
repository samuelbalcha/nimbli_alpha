'use strict';

var ActivitiySchema = require('../models/activity');
var Activity = ActivitiySchema.Activities;
var User = require('../models/user');

exports.createActivity = function(po){
   
    var activity = new Activity({
            project : po.project,
            postedBy: po.postedBy,
            visibileTo : po.visibileTo,
            action : po.action   
        });
  
    activity.save(function(err) {
        if(err){
            console.log(err);
        }
    });
    
    return; 
};

exports.getActivities = function(req, res, next){
    
    User.findById(req.user, function(err, user) {
        if(err){
            console.log(err);
            res.status(401).send({ message: err });
        }
        if(!user){
            res.status(401).send({ message: 'User not found' });
        }
        else{
            var list = [];
            fillup(user.roles.owners, list, req.user)
            fillup(user.roles.supervisors, list, req.user)
            fillup(user.roles.teamMember, list, req.user, function() {
               // console.log(list);
                res.json(list)
            })
        }
    });
    
};

function fillup(roles, list, user, callback){
    if(roles && roles.length > 0){
        for(var i = 0 ; i < roles.length; i++){
            console.log("id ",roles[i]);
            Activity.find({ project : roles[i] }, 
                function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result, roles[i]);
                        list.push(result);
                    }
                }
            );
        }
        
       callback(list);
   //{ project : params[i] }).and({$or: [{ visibileTo : '*' }, { visibileTo: user }]})
    }
}
