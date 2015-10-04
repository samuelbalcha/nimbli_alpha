'use strict';

angular.module('nimbliApp').constant('USER_ROLES', {
    owner: "owner",
    teamMember : "teamMember",
    supervisor : "supervisor",
    anonymous : "anonymous"
});

angular.module('nimbliApp').constant('AUTH_EVENTS', {
    notAuthenticated: "notAuthenticated",
    notAuthorized : "notAuthorized",
    authorized : "authorized"
});

angular.module('nimbliApp').constant('POST_VISIBILITY', {
    toPublic: "public",
    toConnection : "connection",
    onlyTeam : "team",
    everyone : "everyone",
    supervisors : "supervisors",
    customize : "customize",
    onlyMe : "only me",
    toPrivate : "private"
});

angular.module('nimbliApp').constant('POST_TYPE', {
    text: 0,
    image : 1,
    link : 2,
    attachement : 3,
    video : 4
});

angular.module('nimbliApp').constant('POST_ACTION', {
    text: "posted on the wall",
    image : "uploaded a photo",
    link : "shared a link",
    attachement : "added an item on Google Drive",
    video : "uploaded a video"
});

angular.module('nimbliApp').constant('ATTACHMENT_TYPE', {
    PDF:  { type : "application/pdf", icon : '../images/file_icons/pdf-icon.png '},
    WORD : { 
        type : "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
        icon : '../images/file_icons/word-icon.png'
    },
    EXCEL : { 
        type : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
        icon : '../images/file_icons/excel-icon.png'
    },
    TEXT : { type : "text/plain", icon : '../images/file_icons/text-icon.png' },
    PPT : { type : "application/powerpoint", icon : '../images/file_icons/ppt-icon.png' },
    OTHER : { type : "application/vnd", icon : '../images/file_icons/blank-icon.png' }
});

angular.module('nimbliApp').constant('MOODS', {
   HAPPY :  { name : 'happy', icon : '' }, 
   EXCITED : { name : 'excited', icon : '' }, 
   MOTIVATED : { name : 'motivated', icon : '' },
   PROUD: { name : 'proud', icon : '' }, 
   SURPRISED : { name : 'surprised', icon : '' }, 
   WORRIED : { name : 'worried', icon : '' } ,
   DISCOURAGED : { name : 'discouraged', icon : ''}, 
   ANGRY : { name : 'angry', icon : '' }, 
   DISSAPOINTED : { name : 'dissapointed', icon : ''}, 
   SORRY : { name : 'sorry', icon : '' },
   LOST : { name : 'lost', icon : '' }, 
   IMPATIENT : { name : 'impatient', icon : '' }
});

angular.module('nimbliApp').constant('APP_KEYS', {
    developerKey : 'AIzaSyDEgL-EiVFkoekLipiIvoU_usHCSNH2oSs',
    driveClient : '701735845992-7sp1sl65pb8o42hapvj0qdu5e4iash2o.apps.googleusercontent.com',
});