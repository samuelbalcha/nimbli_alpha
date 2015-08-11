'use strict';

// set up ========================
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors'); // not used yet
var logger = require('morgan'); // not used yet
var multer  = require('multer');

var upload = multer({ dest: './uploads/' });

// configuration =================
var config = require('./config');

app.use(express.static(__dirname + '../../public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

//app.use(cors);
var moment = require('moment');
var jwt = require('jwt-simple');

// connect to mongo
mongoose.connect(config.MONGO_URI);

var User = require('./models/user');
var userApi = require('./apis/userApi');
var projectApi = require('./apis/projectApi');
var auth = require('./apis/authentication');
var projectRequestApi = require('./apis/projectRequestApi');
var projectWallApi = require('./apis/projectWallApi');

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
app.get('/api/emailcheck/:email', auth.checkEmail(User)); 
app.post('/auth/signup', auth.signUp(User));
app.post('/auth/login', auth.logIn(User));
app.post('/auth/google', auth.googleLogin(User));

// Profile
app.put('/api/me', ensureAuthenticated, userApi.updateProfile);
app.get('/api/me', ensureAuthenticated, userApi.getProfile);
app.get('/api/access', ensureAuthenticated, userApi.getAccess);
app.put('/api/users/avatar/:id', ensureAuthenticated, upload.single('file'), userApi.uploadAvatar);
app.get('/api/users/avatar/:filename', userApi.getAvatar);

// Project
app.get('/api/projects', projectApi.getProjects);
app.get('/api/projects/:id', projectApi.getProject);
app.get('/api/projects/cover/:filename', projectApi.getProjectCover);
app.get('/api/projects/user/:id', projectApi.getUserProjects);

app.post('/api/projects', ensureAuthenticated, projectApi.createProject);
app.delete('/api/projects/:id', ensureAuthenticated, projectApi.deleteProject);
app.put('/api/projects/:id', ensureAuthenticated, projectApi.updateProject);
app.put('/api/addusertoproject', ensureAuthenticated, projectApi.addUserToProject);
app.put('/api/projects/:id/cover', ensureAuthenticated, upload.single('file'), projectApi.uploadCover);

// Brief
app.put('/api/projects/:id/brief', projectApi.updateBrief);

// ProjectRequest
app.post('/api/projectrequests', ensureAuthenticated, projectRequestApi.createProjectRequest);
app.get('/api/projectrequest/:projectId/:user', ensureAuthenticated, projectRequestApi.getProjectRequest);
app.put('/api/projectrequest/:id', ensureAuthenticated, projectRequestApi.updateProjectRequest);
app.get('/api/projectrequests/:projectId/:user', ensureAuthenticated, projectRequestApi.getProjectRequests);
app.delete('/api/projectrequest/:id', ensureAuthenticated, projectRequestApi.removeRequest);

//ProjectWall
app.get('/api/projectwall/:id', projectWallApi.getPosts);
app.post('/api/projectwall/:id', ensureAuthenticated, upload.single('file'), projectWallApi.createPost);

// Test APIs
app.get('/api/users', userApi.users);
app.get('/api/users/:id', userApi.user);
app.delete('/api/users/:id', userApi.delUser);
app.get('/api/aws/:id', userApi.aws(config.AWS_KEYID, config.AWS_SECRET, config.AWS_BUCKET, config.AWS_ACL));
app.delete('/api/users/:id',userApi.delUser);
app.get('/api/aws/:id', ensureAuthenticated, userApi.aws(config.AWS_KEYID, config.AWS_SECRET, config.AWS_BUCKET, config.AWS_ACL));

// listen (start app with node server.js) ======================================
app.listen(process.env.PORT);
console.log("App listening on port ", process.env.PORT);
