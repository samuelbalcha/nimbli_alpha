'use strict';

// set up ========================
var express  = require('express');
var app      = express();
var http = require('http');
var httpServer = http.Server(app);
var io = require('socket.io').listen(httpServer);

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
var googleApi = require('./apis/googleApi');
var reflectionApi = require('./apis/reflectionApi');
var activityApi = require('./apis/activitiesApi');
var cardsApi = require('./apis/methodCardsApi');

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

io.sockets.on('connection', function(socket){
    socket.on('join', function(data) {
        socket.room = data.room;
        socket.join(data.room);
    });
  
    socket.on('leave', function(data) {
        socket.leave(data.room);
        socket.disconnect();
    });
    
    socket.on('wall', function (data) {  
        projectWallApi.getPost(data.message._id, function(po){
            io.sockets.in(data.room).emit('wall', { room: data.room, message : po, project : data.project });
        });
    });
    
    socket.on('wall-post-removed', function (data) {  
       io.sockets.in(data.room).emit('wall-post-removed', { room: data.room, message : data.message });
    });
    
    socket.on('msg', function (data) {
        //console.log("msg", data);
        io.sockets.in('msg-'+data.to._id).emit('msg', { data: data }); 
    });
 
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
  
});

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
app.get('/api/projects/user/:id', ensureAuthenticated, projectApi.getUserProjects);

app.post('/api/projects', ensureAuthenticated, projectApi.createProject);
app.delete('/api/projects/:id', ensureAuthenticated, projectApi.deleteProject);
app.put('/api/projects/:id', ensureAuthenticated, projectApi.updateProject);
app.put('/api/addusertoproject', ensureAuthenticated, projectApi.addUserToProject);
app.put('/api/projects/:id/cover', ensureAuthenticated, upload.single('file'), projectApi.uploadCover);

// AboutProject
app.put('/api/projects/:id/about', ensureAuthenticated, projectApi.updateAboutProject);

// MethodCards
app.get('/api/cards/', ensureAuthenticated, cardsApi.getFramingCards);
app.post('/api/cards/', ensureAuthenticated, cardsApi.createFramingCard);
app.put('/api/cards/', ensureAuthenticated, cardsApi.updateFramingCard);
app.get('/api/cards/:id', ensureAuthenticated, cardsApi.getCard);
app.delete('/api/cards/:id', ensureAuthenticated, cardsApi.removeCard);

// ProjectRequest
app.post('/api/projectrequests', ensureAuthenticated, projectRequestApi.createProjectRequest);
app.get('/api/projectrequest/:projectId/:user', ensureAuthenticated, projectRequestApi.getProjectRequest);
app.put('/api/projectrequest/:id', ensureAuthenticated, projectRequestApi.updateProjectRequest);
app.get('/api/projectrequests/:projectId/:user', ensureAuthenticated, projectRequestApi.getProjectRequests);
app.delete('/api/projectrequest/:id', ensureAuthenticated, projectRequestApi.removeRequest);
app.get('/api/projectrequest/:user', ensureAuthenticated, projectRequestApi.getUserProjectRequests);

//ProjectWall
app.get('/api/projectwall/:id', ensureAuthenticated, projectWallApi.getPosts);
app.post('/api/projectwall/:id', ensureAuthenticated, upload.single('file'), projectWallApi.createPost);
app.delete('/api/projectwall/:id', ensureAuthenticated, projectWallApi.removePost);

//Reflection
app.get('/api/reflections/:id', ensureAuthenticated, reflectionApi.getReflections);
app.get('/api/reflections/:id/shared', ensureAuthenticated, reflectionApi.getSharedReflections);
app.post('/api/reflections/:id', ensureAuthenticated, reflectionApi.createReflection);
app.delete('/api/reflections/:id', ensureAuthenticated, reflectionApi.removeReflection);

//Activities
app.get('/api/activities/:id', ensureAuthenticated, activityApi.getActivities);

// Test APIs
app.get('/api/oauth2callback', googleApi.getCallback);
app.get('/api/users', userApi.users);
app.get('/api/users/:id', userApi.user);
app.delete('/api/users/:id', userApi.delUser);
app.get('/api/aws/:id', userApi.aws(config.AWS_KEYID, config.AWS_SECRET, config.AWS_BUCKET, config.AWS_ACL));
app.delete('/api/users/:id',userApi.delUser);
app.get('/api/aws/:id', ensureAuthenticated, userApi.aws(config.AWS_KEYID, config.AWS_SECRET, config.AWS_BUCKET, config.AWS_ACL));

var port = process.env.PORT;
// Server start
httpServer.listen(port).on('error', function(err){
    if(err.code === 'EADDRINUSE'){
        port++;
        console.log('Address in use, retrying on port ' + port);
        
        setTimeout(function () {
            httpServer.listen(port);
         }, 250);
    }
});

console.log("App listening on port ", process.env.PORT);
var http=require('http');

