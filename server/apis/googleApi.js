'use strict';
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var config = require('../config');

var oauth2Client = new OAuth2(config.GOOGLE_CLIENTID, config.GOOGLE_CLIENT_SECRET, config.GOOGLE_REDIRECT_URL);
google.options({ auth: oauth2Client });
var scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.appdata'
];

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope: scopes // If you only need one scope you can pass it as string
});


exports.getCallback = function(req, res){
  var drive = google.drive({ version: 'v2', auth: oauth2Client });
  console.log(drive.files);  
 res.send("hi")   
}


/**
// insertion example
drive.files.insert({
  resource: {
    title: 'Test',
    mimeType: 'text/plain'
  },
  media: {
    mimeType: 'text/plain',
    body: 'Hello World updated with metadata'
  },
  auth: oauth2Client
}, function(err, response) {
  console.log('error:', err, 'inserted:', response.id);
});
*/