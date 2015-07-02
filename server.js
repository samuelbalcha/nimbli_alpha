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
var config = require('./config');

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
var userApi = require('./userApi');
var auth = require('./authentication');

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

app.post('/auth/signup', auth.signUp(User));
app.post('/auth/login', auth.logIn(User));
app.post('/auth/google', auth.googleLogin(User));

app.put('/api/me', ensureAuthenticated, userApi.updateProfile);
app.get('/api/me', ensureAuthenticated, userApi.getProfile);

// Test APIs
app.get('/api/users', userApi.users);
app.get('/api/users/:id', userApi.user);
app.del('/api/users/:id',userApi.delUser);
app.get('/api/aws/:id', userApi.aws(config.AWS_KEYID, config.AWS_SECRET, config.AWS_BUCKET, config.AWS_ACL));


// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
