angular.module('nimbliApp').service('DriveService', function($q, $window, $http, APP_KEYS){
    'use strict';

    var oauthToken;
    var scope = [   'https://www.googleapis.com/auth/drive', 
                    'https://www.googleapis.com/auth/drive.file',
                    'https://www.googleapis.com/auth/drive.readonly'];
    
    return ({
        init : function(){
            var defer= $q.defer();
            gapi.load('auth', {'callback' : function(){
              $window.gapi.auth.authorize({'client_id' : APP_KEYS.driveClient, 'scope' : scope }, function(authResult) {
                if(authResult && !authResult.error){
                    oauthToken = authResult.access_token;
                    defer.resolve(oauthToken);
                }
                else{
                    defer.reject(authResult.error);
                }
              });   
            }});
            return defer.promise;
        },
        getPicker : function(){
           
            gapi.load('picker');
            console.log(google);
            var picker = new google.picker.PickerBuilder().addView(new google.picker.DocsUploadView())
                                                          .addView(new google.picker.DocsView())
                                                          .setOAuthToken(oauthToken).setDeveloperKey(APP_KEYS.developerKey).build();
            return picker;
        },
        
        createProjectFolder : function(title, callback){
           
            var  header = { 
                'path': '/drive/v2/files/',
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + oauthToken,             
                } 
            };
             
            var data = {
                "title": title,
                "mimeType": "application/vnd.google-apps.folder"
            };
            
            gapi.client.drive.files.insert(header, data).execute(function(resp){
               return callback(resp);
            });
        },
        
        insertFile : function (folderId, postData, callback) {
            
            var boundary = '-------314159265358979323846';
            var delimiter = "\r\n--" + boundary + "\r\n";
            var close_delim = "\r\n--" + boundary + "--";

            var reader = new FileReader();
            reader.readAsBinaryString(postData.file);
            reader.onload = function(e) {
                var contentType = postData.file.type || 'application/octet-stream';
                var metadata = {
                    'title': postData.file.name,
                    'mimeType': contentType,
                    "parents": [{
                        "kind": "drive#fileLink",
                        "id": folderId
                    }],
                    description : postData.content
                };
                
                var base64Data = $window.btoa(reader.result);
                var multipartRequestBody =
                    delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    JSON.stringify(metadata) +
                    delimiter +
                    'Content-Type: ' + contentType + '\r\n' +
                    'Content-Transfer-Encoding: base64\r\n' +
                    '\r\n' +
                    base64Data +
                    close_delim;
                
                var request = gapi.client.request({
                    'path': '/upload/drive/v2/files/',
                    'method': 'POST',
                    'params': {'uploadType': 'multipart'},
                    'headers': {
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody});
                if (!callback) {
                    callback = function(file) {
                        return file;
                    };
                }
                request.execute(callback);
            };
        },
        getFile : function(id){
            var defer= $q.defer();
            this.init().then(function(data){
                var request = gapi.client.drive.files.get({
                        'fileId': id
                });
                request.execute(function(res){
                     defer.resolve(res);
                });
            });
            return defer.promise;
        },
        
        getToken : function(){
            return oauthToken;
        }
       
    });
 
    

});