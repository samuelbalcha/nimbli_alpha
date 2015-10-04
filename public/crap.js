run(function($rootScope, authorizationService, AUTH_EVENTS, AccountService, $auth){
       return $rootScope.$on("$stateChangeStart", function(event, next){
           console.log("making request");
           var authenticator, permissions;
           permissions = (next && next.data) ? next.data.permissions : null;
         
           if($auth.isAuthenticated()){
               console.log("authenticated");
                var user = AccountService.getCurrentUser();
                
                Account.getAccess().success(function(user){
                   
                   authenticator = new authorizationService(user);
                   console.log(authenticator);
                   if ((permissions != null) && !authenticator.canAccess(permissions)) {
                        event.preventDefault();
                        if (!user) {
                            return $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        } else {
                            return $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        }
                   }
               })
           }
       })
});

  var userId = req.user;
            Project.find().or([{ createdBy: userId }, { team: userId}, { supervisors :userId }, {owners : userId}], function(err, projects){
                if(err){
                    console.log(err);
                    res.status(401).send({ message: 'User has no projects' });
                }
                
                console.log("with or", projects);
            });



//ProjectRequest
exports.createProjectRequest = function(req, res){
    var prReq = req.body;
    
    ProjectRequest.findOne({'project' : req.params.id  , 'user' : prReq.user}, function(err, existingRequest){
        if(err){
            res.status(401).send({ message : err });
        }
        if(existingRequest){
            // modify with new request 
           console.log(prReq , "and" , existingRequest);
           
            existingRequest.role = prReq.role || existingRequest.role;
            existingRequest.note = prReq.note || existingRequest.note;
            existingRequest.dateRequested = Date.now();
            existingRequest.save(function(err){
                if(err){
                    console.log(err);
                   res.status(401).send({ message : "could not add request"});
                }
               res.status(201).send(existingRequest);
            });
        }
        else{
              var newReq = new ProjectRequest({
                     user : prReq.user,
                     project : req.params.id,
                     role : prReq.role,
                     note : prReq.note
                 });
            console.log("new req", newReq);
            newReq.save(function(err){
                if(err){
                    console.log(err);
                    res.status(401).send({ message : "could not add request"});
                }
                res.status(201).send(newReq);
            });  
        }
    });
};

exports.getProjectRequests = function(req, res){
    
     ProjectRequest.find({'project' : req.params.id }).populate('user', 'displayName avatar' ).sort({ dateRequested : 'desc'}).exec(function(err, projectRequests) {
        if (err){
            res.status(404).send(err);
        }
        //console.log(projectRequests);
        res.status(200).send(projectRequests);
    });
    
};

exports.updateProjectRequest = function(req, res){
    
    var prReq = req.body;
   
   ProjectRequest.findOne({_id : prReq.id }, function(err, existingRequest) {
       if(err){
           console.log(err);
           res.send(err);
       }
       if(!existingRequest){
           res.send(err);
       }
       else if(prReq.status === 1){
           existingRequest.requestStatus = 1;
           existingRequest.responseDate = Date.now();
           updateProjectAfterRequest(existingRequest.project, existingRequest.user, existingRequest.role);
       }
       else if(prReq.status === 2){
           existingRequest.requestStatus = 2;
           existingRequest.responseDate = Date.now();
       }
       existingRequest.save(function(err){
           if(err){
               console.log(err);
               res.send(err);
           }
       });
       
       res.send(existingRequest);
   });
    
};

function updateProjectAfterRequest(pid, user, role){
    
    Project.findById(pid, function(err, project) {
        if(err || !project){
            console.log(err);
            return err;
        }
        if(role === 2){
            if(project.owners.indexOf(user) === -1)
                project.owners.push(user);
        }
       if(role === 1){
           if(project.supervisors.indexOf(user) === -1)
                project.supervisor.push(user);
       }
       if(role === 0){
           if(project.team.indexOf(user) === -1)
                project.team.push(user);
       }
       
       project.save(function(err){
           if(err){
               console.log(err);
               return err;
           }
       });
       
       console.log("proj ", project);
    });
}
<script>
  var developerKey = 'AIzaSyDEgL-EiVFkoekLipiIvoU_usHCSNH2oSs';
  var clientId = "895486469121-o1kenpcafsn0a1k2710ecu3ol0jvvegg.apps.googleusercontent.com";

  function onApiLoad(){
    gapi.load('auth', { 'callback' : onAuthApiLoad });
    gapi.load('picker');
  }
  
  function onAuthApiLoad(){
    window.gapi.auth.authorize({
      'client_id' : clientId,
      'scope' : ['https://www.googleapis.com/auth/drive']
    }, handleAuthResult);
  }
  
  var oauthToken;
  
  function handleAuthResult(authResult){
    if(authResult && !authResult.error){
        oauthToken = authResult.access_token;
        createPicker();
    } 
  }
  
  function createPicker(){
    var picker = new google.picker.PickerBuilder().addView(new google.picker.DocsUploadView())
                                                  .addView(new google.picker.DocsView())
                                                  .setOAuthToken(oauthToken).setDeveloperKey(developerKey).build();
    picker.setVisible(true);
  }
</script>

<div id="project-header" class="card">
        <div class="card-height-indicator"></div>
        <div class="card-content">
            <div class="card-image" style="height:220px;">
                <img  ng-src="{{ project.coverPicture }}" alt="Loading image...">
                <h3 ng-model="project.title" class="card-image-headline">
                    {{ project.title }}
                </h3>
            </div>
            <div class="card-body" ng-show="userRole !== undefined" style="height:5px; padding:2px"> 
               
                
                  <div ng-switch="userRole" class="card-body" style="height:5%;">
                    <div ng-switch-when="anonymous">
                       <div ng-include="'partials/project/apply-follow.tpl.html'"></div>
                    </div>
                    <div ng-switch-when="owner">
                       <div ng-include="'partials/project/owner.tpl.html'"></div>
                    </div>
                  </div>
                  
            </div>
            <div class="card-footer">
               <div class="col-md-12">
                    <div class="row">
                        <form ng-hide="post.imageFile" style="height:100px" name="postForm">
                            <textarea ng-model="post.content"
                                      class="form-control"
                                      name="content"
                                      placeholder="Write something..."
                                      contentType="post.content"
                                      rows="3" style="margin-bottom:5px; resize: none;" required>
                            </textarea> 
                        </form>
                     </div>
               
                        <ul class="nav nav-pills pull-left"> 
                           <li> 
                                <div class="btn" style="margin-top: -25px;">
                                    <i class="fi-camera"></i>
                                    <input width="30px" name="file" accept="image/*" ngf-select="" 
                                          ng-model="post.imageFile"  class="fileupload" type="file" id="picturePost">
                                </div>
                           </li>
                           <li>
                                <a class="btn" ng-click="setContentType(POST_TYPE.attachment)" style="cursor:pointer; marging-right:10px"> 
                                   <i class="fi-paperclip"></i>
                                </a>
                           </li>
                            <li>
                                <a class="btn" ng-click="setContentType(POST_TYPE.attachment)" style="cursor:pointer; marging-left:10px"> 
                                   <i class="fi-video"></i>
                                </a>
                           </li>
                        </ul>    
                         <ul class="nav nav-pills pull-right">
                             <li id="visibilitySelector">
                                 <ol style="margin-right: -10px;"  class="nya-bs-select btn-md btn-default" ng-model="post.visibileTo">
                                    <li nya-bs-option="option in options">
                                        <a>{{ option }}</a>
                                    </li>
                                 </ol>  
                             </li>
                            <li>
                               <a class="btn btn-primary btn-raised" type="submit" ng-click="createPost()" 
                                  style="margin-right: 20px; margin-top: 20px;">POST
                                </a> 
                           </li>
                        </ul>
                  
                </div>
            </div>
        </div>
    </div>
    
    
     <div ng-if="formVisible">
        <div class="panel panel-default">
            <hr class="divider">
            <div class="panel-body">
                <form ng-hide="post.imageFile" style="height:100px" name="postForm">
                    <textarea id="content"
                              ng-model="post.content"
                              class="form-control"
                              name="content"
                              placeholder="Write something..."
                              contentType="post.content"
                              rows="3" style="margin-bottom:5px;" required>
                    </textarea> 
                </form>
                <div class="col-md-12" ng-if="post.imageFile">
                    <div class="col-md-3">
                        <img  style="margin-top:-20px; margin-left:-5px"  
                             ngf-src="post.imageFile" width="150px" height="100px" 
                             ng-show="post.imageFile.type.indexOf('image') > -1" ngf-accept="'image/*'">
                    </div>
                    <div class="col-md-8">
                        <textarea 
                              ng-model="post.content"
                              class="form-control"
                              name="content"
                              placeholder="Write something..."
                              rows="3" style="margin-bottom:5px;">
                        </textarea> 
                    </div>
                </div>
            </div>
            <div class="panel-footer" style="height:60px !important;">
                <div class="pull-left">
                    <ul class="nav nav-pills pull-left"> 
                        <li>
                           <div class="btn" style="margin-top: 10px;">
                                <span class="mdi-image-camera-alt btn-primary"></span>
                                <input name="file" accept="image/*" ngf-select="" 
                                 ng-model="post.imageFile"  class="fileupload" type="file" id="picturePost">
                           </div>
                        </li>
                        <li>
                             <a class="btn" ng-click="setContentType(POST_TYPE.attachment)" style="cursor:pointer"><span class="mdi-file-attachment  btn-primary"></span></a>
                        </li>
                        <li>
                             <a class="btn" ng-click="setContentType(POST_TYPE.link)" style="cursor:pointer"><span class="mdi-av-play-circle-fill  btn-primary"></span></a>
                        </li>
                    </ul>
                </div>
                <div class="pull-right">
                     <ul class="nav nav-pills pull-right"> 
                        <li>
                            <ol style="margin-top: 10px;margin-right: 10px;"  class="nya-bs-select btn-md btn-info" ng-model="post.visibileTo">
                                <li nya-bs-option="option in options">
                                    <a>{{ option }}</a>
                                </li>
                            </ol>  
                        </li>
                        <li>
                            <button type="submit" ng-click="createPost()" ng-disabled="postForm.$invalid"
                                    class="btn btn-md btn-primary" style="margin-right: 10px;">POST
                            </button> 
                        </li>
                    </ul>
                </div>
             
            </div>
        </div>
    </div>
    
    
    *******************************
    <div class="main" ng-controller="ProjectWallCtrl">
    <div>
        <h3 class="text-muted">Group Activities</h3>
        <hr class="divider">
        <li ng-repeat="po in posts">
            <div class="col-md-1">
            <div class="row-picture">
                <img class="circle" width="24" height="24" ng-src="{{ po.postedBy.avatar }}" alt="{{ po.postedBy.displayName }}">
            </div>
        </div>
            <div class="col-md-11">
                <div class="panel panel-default">
                    <div class="panel-body">
                     <div class="row panel-tools">
                        <div class="col-md-3">
                            <p>
                                <a class="panel-heading" href="/#/users/{{ po.postedBy._id}}">{{ po.postedBy.displayName }}</a> 
                                <span am-time-ago="po.dateCreated" style="font-size:11px"></span>
                            </p>
                             
                        </div>
                        <div ng-if="formVisible" class="col-md-5">
                            <p> {{ po.action }} </p>
                        </div>
                        <div ng-if="formVisible" class="col-md-2">
                            <p class="text-muted"> 
                                {{ po.visibility }} <i ng-class="{'glyphicon glyphicon-eye-close label-info': po.visibility == 'public' }"></i>  
                            </p>
                        </div>
                        <div ng-if="po.postedBy._id == currentUser._id">
                            <span class="btn glyphicon glyphicon-trash" ng-click="removePost(po)"></span>
                        </div>
                    </div>
                
                    <div class="row" ng-switch="po.postType">
                        <div class="col-md-12" ng-when="0">
                            <div class="col-md-offset-1 col-sm-7">
                                <p>{{ po.caption }} </p>                                        
                            </div>
                            <div class="col-sm-4">
                                
                            </div>
                        </div>
                        <div ng-when="1">
                               <div class="col-md-8">
                                    <div class="afkl-lazy-wrapper afkl-img-ratio-2-1" 
                                         style="padding: 10px;" width="350px" height="300px"  
                                        afkl-lazy-image="data:image/png;base64,{{po.base64Img }}">
                                    </div>
                                   <div class="col-md-4">
                                        <p>{{ po.caption }} </p>
                                   </div>     
                                </div>
                        </div>
                         <div ng-when="2">
                            <div class="col-md-offset-1 col-sm-7">
                                    <p>{{ po.caption }} </p>   
                            </div>
                            <div class="col-sm-4">
                                
                            </div>
                        </div>
                    </div>
                  
                </div>
                    <div class="panel-footer">
                        <div ng-if="formVisible" class="row">
                            <textarea  placeholder="write comment" 
                                        class="form-control pull-right" rows="2"
                                        style="border:1px #ddd solid; width:85%; margin-right:10px">
                            </textarea>
                        </div>
                    </div>
                </div>
        </li>
</div>
    </div>
</div>


### Project view


    <!-- Nav -->
     <tab-nav-top></tab-nav-top>
    <!-- side -->
    <div ng-if="!editMode">
        <public-side></public-side> 
    </div>
    <div ng-if="editMode">
        <admin-side></admin-side>
    </div>
    <!-- header -->
    <div class="main" ng-if="!privateWall" >
        <public-header></public-header> 
    </div>
    <div class="main" ng-if="privateWall" ng-hide="editMode">
        <team-header></team-header>
    </div>
    <!-- wall -->
    <div class="main" ng-if="!privateWall">
        <public-wall></public-wall> 
    </div>
    <div class="main" ng-if="privateWall">
        <team-wall></team-wall>
    </div>
</div>
<!-- chat -->

 <div class="row-content" style="width:79%">
                               <a ng-hide="person.chatActive" class="btn  btn-primary"  ng-click="chat(person)" style="margin-left:5px; cursor:pointer"> Chat  </a> 
                               <div ng-show="person.chatActive" style="overflow: auto" height="300px">
                                    <div class="panel">
                                        <div class="panel-body">
                                            
                                        </div>
                                        <div class="panel-footer">
                                            <div class="input-group">
                                                <input id="btn-input" type="text" class="form-control input-sm" placeholder="Type your message here..." />
                                                 <button class="btn btn-default btn-sm pull-right"> Send</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            

<!-- flipCard -->

  <li ng-repeat="frameCard in frameCards" class="col-md-3">
              <div class="flip-card-container">
                <div class="flip-card">
                    <div class="front">
                        <div class="cover">
                            <img ng-src="{{ frameCard.src }}"/>
                        </div>
                        
                        <div class="content">
                            <div class="">
                                <h4 class="text-center colored-h capital">  {{ frameCard.title }}</h4>
                                <p class="text-center"></p>
                                <a href="" class="btn btn-primary btn-fab btn-raised">
                                   {{ frameCard.items.length }}  
                                </a> <span class="nimbli-icon-text"> items</span>
                            </div>
                            <div class="footer">
                                <div class="rating">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </div>
                            </div>
                        </div>
                    </div> <!-- end front panel -->
                    <div class="back">
                        <div class="header">
                            <h5 class="motto capital">
                                {{ frameCard.description }}
                            </h5>
                        </div> 
                        <div class="content">
                            <div ng-repeat="item in frameCard.items">
                                <h5 class="space">
                                   <a class="modal-heading capital" ng-click="openCard(item)" style="cursor:pointer"> 
                                       <span class="{{ item.icon }} mdi-material-teal"></span>
                                        <span class="nimbli-icon-text"> {{ item.name }}</span>
                                    </a>
                                </h5>
                            </div>
                        </div>
                        <div class="footer">
                            <div class=" text-center">
                               
                            </div>
                        </div>
                    </div> <!-- end back panel -->
                </div> <!-- end card -->
            </div> <!-- end card-container -->
              
        </li>