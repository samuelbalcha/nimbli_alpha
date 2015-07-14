'use strict';

var moment = require('moment');
var jwt = require('jwt-simple');
var request = require('request');
var config = require('./config_local');

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */

function createJWT(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}


exports.checkEmail = function(User){
    return function(req, res){
              
         User.findOne({ email: req.params.email }, function(err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({ message: 'Email is already taken' });
                    }
         });
         
        res.status(200).send('Email not found');
    }
};

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
exports.signUp = function(User){

    return function(req, res) {

        User.findOne({ email: req.body.email }, function(err, existingUser) {
            if (existingUser) {
                return res.status(409).send({ message: 'Email is already taken' });
            }
            if(err){
                return res.status(403).send({ message : 'User could not be registered. Please try again.' });
            }
            var user = new User({
                displayName: req.body.displayName,
                email: req.body.email,
                password: req.body.password
            });

            user.save(function() {
                res.send({ token : createJWT(user) });
            });
        });
    };
};

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
exports.logIn = function(User){

    return function(req, res) {
        User.findOne({ email: req.body.email }, '+password', function(err, user) {
            if (!user) {
                return res.status(401).send({ message: 'Wrong email and/or password' });
            }
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (!isMatch) {
                    return res.status(401).send({ message: 'Wrong email and/or password' });
                }
                res.send({ token: createJWT(user) });
            });
        });
    };
};


/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
exports.googleLogin = function(User){

    return function(req, res) {
        var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
        var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: config.GOOGLE_SECRET,
            redirect_uri: req.body.redirectUri,
            grant_type: 'authorization_code'
        };

        // Step 1. Exchange authorization code for access token.
        request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
            var accessToken = token.access_token;
            var headers = { Authorization: 'Bearer ' + accessToken };

            // Step 2. Retrieve profile information about the current user.
            request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {

                // Step 3a. Link user accounts.
                if (req.headers.authorization) {
                    User.findOne({ google: profile.sub }, function(err, existingUser) {
                        if (existingUser) {
                            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
                        }
                        var token = req.headers.authorization.split(' ')[1];
                        var payload = jwt.decode(token, config.TOKEN_SECRET);

                        User.findById(payload.sub, function(err, user) {

                            if (!user) {
                                return res.status(400).send({ message: 'User not found' });
                            }
                            user.google = profile.sub;
                            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
                            user.displayName = user.displayName || profile.name;
                            user.save(function() {
                                var token = createJWT(user);
                                res.send({ token: token });
                            });
                        });

                    });
                } else {
                    // Step 3b. Create a new user account or return an existing one.
                    User.findOne({ google: profile.sub }, function(err, existingUser) {
                        if (existingUser) {
                            return res.send({ token: createJWT(existingUser) });
                        }
                        var user = new User();
                        user.google = profile.sub;
                        user.picture = profile.picture.replace('sz=50', 'sz=200');
                        user.displayName = profile.name;
                        user.save(function(err) {
                            var token = createJWT(user);
                            res.send({ token: token });
                        });
                    });
                }
            });
        });
    };
};
