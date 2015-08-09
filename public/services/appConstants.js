'use strict';

angular.module('nimbliApp').constant('APP_PERMISSIONS', {
  viewTeamWorkSpace: "viewTeamWorkSpace",
  editTeamWorkSpace: "editTeamWorkSpace",
  editProfile: "editProfile",
  editProject: "editProject"
});

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
    onlyTeam : "team"
});

angular.module('nimbliApp').constant('POST_TYPE', {
    text: "text",
    link : "link",
    attachement : "attachement"
});