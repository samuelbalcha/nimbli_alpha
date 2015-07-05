'use strict';

// set up ========================
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var cors = require('cors');
var logger = require('morgan');

// configuration =================
var config = require('./config_local');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
var moment = require('moment');
var jwt = require('jwt-simple');

// connect to mongo
mongoose.connect(config.MONGO_URI);

var User = require('./models/user');
var ProjectSchema = require('./models/project');
var userApi = require('./userApi');
var projectApi = require('./projectApi');
var auth = require('./authentication');
var Project = ProjectSchema.Project;
var Brief = ProjectSchema.Brief;

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.headers.authorization.split(' ')[1];

    var payload = null;
    try {
        payload = jwt.decode(token, config.TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).send({ message: err.message });
    }

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }
    req.user = payload.sub;
    next();
}

// Authentication
app.post('/auth/signup', auth.signUp(User));
app.post('/auth/login', auth.logIn(User));
app.post('/auth/google', auth.googleLogin(User));

// Profile
app.put('/api/me', ensureAuthenticated, userApi.updateProfile);
app.get('/api/me', ensureAuthenticated, userApi.getProfile);

// Project
app.post('/api/projects', ensureAuthenticated, projectApi.createProject);
app.get('/api/projects', projectApi.getProjects);
app.get('/api/projects/:id', projectApi.getProject);
app.del('/api/projects/:id', projectApi.deleteProject);
app.put('/api/projects/:id', ensureAuthenticated, projectApi.updateProject);

// Brief
app.post('/api/projects/:id/briefs', function(req, res){
    var br = req.body.brief;

    Brief.findById(req.body.projectId, function(err, brief){
        if(!brief){
            // create a new brief
            var newBrief = new Brief({
                outcome: br.outcome,
                objective : br.objective,
                deliverable : br.deliverable,
                scope : br.scope,
                approach : br.approach,
                exclusion : br.exclusion,
                constraint : br.constraint,
                businessCase : br.businessCase,
                reasonsForSelectingSolution : br.reasonsForSelectingSolution,
                timetable : br.timetable,
                monitoring : br.monitoring,
                performanceIndicators : br.performanceIndicators,
                riskAssessment : br.riskAssessment,
                dateUpdated: Date.now()
            });

            newBrief.save(function(err){
                if(err){
                    console.log(err);
                }
                res.status(200).end();
            });
        }
    });
});

// Test APIs
app.get('/api/users', userApi.users);
app.get('/api/users/:id', userApi.user);
<<<<<<< HEAD
app.delete('/api/users/:id',userApi.delUser);
app.get('/api/aws/:id', userApi.aws(config.AWS_KEYID, config.AWS_SECRET, config.AWS_BUCKET, config.AWS_ACL));
=======
app.del('/api/users/:id',userApi.delUser);
app.get('/api/aws/:id', ensureAuthenticated, userApi.aws(config.AWS_KEYID, config.AWS_SECRET, config.AWS_BUCKET, config.AWS_ACL));
>>>>>>> 9f819001329c872bf935a23c11a4918ae1387f56


// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
