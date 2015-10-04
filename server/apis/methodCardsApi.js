'use strict';

var ProjectSchema = require('../models/project');
var CardSchema = require('../models/methodCard');

var Card = CardSchema.Card;
var Description = CardSchema.Description;
var Objective = CardSchema.Objective;
var Effort = CardSchema.Effort;
var Milestone = CardSchema.Milestone;
var ProjectScope = CardSchema.ProjectScope;
var Background = CardSchema.Background;
var Travel = CardSchema.Travel;
var AboutTeam = CardSchema.AboutTeam;
var SetupTeam = CardSchema.SetupTeam;
var SkillTeam = CardSchema.SkillTeam;

exports.createFramingCard = function(req, res){
    var pr = req.body;
  
   var name = pr.visibileTo.value == 0 ? 'Public' : 'Private';
   if(pr.name === 'description'){
       handleDescription(name, pr, res, req.user);
   } 
   if(pr.name === 'objective'){
       handleObjective(name, pr, res, req.user);
   } 
   if(pr.name === 'effort'){
       handleEffort(name, pr, res, req.user);
   } 
    if(pr.name === 'scope'){
       handleScope(name, pr, res, req.user);
   } 
   if(pr.name === 'background'){
       handleBackground(name, pr, res, req.user);
   }
   if(pr.name === 'travel'){
       handleTravel(name, pr, res, req.user);
   }
    if(pr.name === 'milestone'){
       handleMilestone(name, pr, res, req.user);
   } 
};

exports.getFramingCards = function(req, res){
   addDefaultFrameCards(function(result){
         res.send(result);       
    });
};



exports.getCard = function(req, res){
    
  Card.findById(req.id, function(err, card){
    if(err){
        console.log("updating card " + card, err);
    }
    else{
        res.send(card);
    }
    });
};

exports.updateFramingCard = function(req, res){
    var pr = req.body;
  
    
    Card.findById(pr._id, function(err, card){
        if(err){
            console.log("updating card " + card, err);
        }
        else{
            var name = pr.visibileTo.value == 0 ? 'Public' : 'Private';
            card.visibileTo =  { value : pr.visibileTo.value , name : name };
            card.updatedBy = req.user;
            card.updatedDate = Date.now();
            
            if(pr.name === 'description' || pr.name === 'objective' || pr.name === 'travel'){
                card.text = pr.text;
                console.log("was here")
                card.media = { mediaType : pr.media.mediaType, url : pr.media.url };
            }
            if(pr.name === 'effort'){
                card.knowledge.value  = pr.knowledge.value;
                card.feasibility.value = pr.feasibility.value;
                card.idea.value =  pr.idea.value;
                card.innovation.value = pr.innovation.value;
                card.presentation.value = pr.presentation.value;
            } 
            if(pr.name === 'scope'){
                card.whatToProduce =  pr.whatToProduce;
                card.whatItContains = pr.whatItContains;
                card.whatItNotContain = pr.whatItNotContain;
                card.primaryTarget = pr.primaryTarget;
            } 
            if(pr.name === 'background'){
                card.howProjectCame =  pr.howProjectCame;
                card.whatItSaysAboutYou = pr.whatItSaysAboutYou;
                card.particularIdea = pr.particularIdea;
                card.whoIsInvolved = pr.whoIsInvolved;
            }
            if(pr.name === 'milestone'){
                console.log(pr.items)
                card.items = pr.items;
            }
            
            card.save(function(err){
                if(err){
                    console.log("couldnt save card ", err);
                }
                console.log(card);
                res.send(card);
            });
        }
    });
};

exports.removeCard = function(req, res){
     Card.findOneAndRemove({ _id : req.params.id }, function(err, po){
        if(err){
            console.log(err);
            res.status(404).send(err);
        }
        
        res.send(200);
    });
};

function handleMilestone(name, pr, res, user){
     var milestoneCard =  createMilestone();
           milestoneCard.createdBy = user;
           milestoneCard.project = pr.project;
           milestoneCard.visibileTo =  { value : pr.visibileTo.value , name : name };
           milestoneCard.text = pr.text;
            if(pr.media && pr.media.mediaType){
                milestoneCard.media = { mediaType : pr.media.mediaType, url : pr.media.url };
            }
           milestoneCard.items = pr.items;
            
        milestoneCard.save(function(err){
            if(err){
                console.log("saving milestoneCard", err);
            }
          
            ProjectSchema.Project.findById(pr.project, function(err, project){
                if(err){
                    console.log("adding milestoneCard to project", err);
                }
                if(!project){
                    console.log("no project");
                }
                
                project.methodCards.push(milestoneCard._id);
                project.save(function(err){
                    if(err){
                        console.log("error when adding travelCard", err);
                         res.send(404);
                    }
                   res.send(milestoneCard);
                });
            });
        }); 
 }
function handleTravel(name, pr, res, user){
     var travelCard =  createTravel();
           travelCard.createdBy = user;
           travelCard.project = pr.project;
           travelCard.visibileTo =  { value : pr.visibileTo.value , name : name };
           travelCard.text = pr.text;
            if(pr.media && pr.media.mediaType){
                travelCard.media = { mediaType : pr.media.mediaType, url : pr.media.url };
            }
        travelCard.save(function(err){
            if(err){
                console.log("saving travelCard", err);
            }
          
            ProjectSchema.Project.findById(pr.project, function(err, project){
                if(err){
                    console.log("adding travelCard to project", err);
                }
                if(!project){
                    console.log("no project");
                }
                
                project.methodCards.push(travelCard._id);
                project.save(function(err){
                    if(err){
                        console.log("error when adding travelCard", err);
                         res.send(404);
                    }
                   res.send(travelCard);
                });
            });
        }); 
 }

function handleBackground(name, pr, res, user){
     var backgroundCard =  createBackground();
           backgroundCard.createdBy = user;
           backgroundCard.project = pr.project;
           backgroundCard.visibileTo =  { value : pr.visibileTo.value , name : name };
           backgroundCard.howProjectCame =  pr.howProjectCame;
           backgroundCard.whatItSaysAboutYou = pr.whatItSaysAboutYou;
           backgroundCard.particularIdea = pr.particularIdea;
           backgroundCard.whoIsInvolved = pr.whoIsInvolved;
           
        backgroundCard.save(function(err){
            if(err){
                console.log("saving backgroundCard", err);
            }
           
                 ProjectSchema.Project.findById(pr.project, function(err, project){
                    if(err){
                        console.log("adding backgroundCard to project", err);
                    }
                    if(!project){
                        console.log("no project");
                    }
                
                    project.methodCards.push(backgroundCard._id);
                    project.save(function(err){
                        if(err){
                            console.log("error when adding backgroundCard", err);
                             res.send(404);
                        }
                       res.send(backgroundCard);
                    });
                });
           
        }); 
 }

function handleScope(name, pr, res, user){
     var scopeCard =  createScope();
           scopeCard.createdBy = user;
           scopeCard.project = pr.project;
           scopeCard.visibileTo =  { value : pr.visibileTo.value , name : name };
           scopeCard.whatToProduce =  pr.whatToProduce;
           scopeCard.whatItContains = pr.whatItContains;
           scopeCard.whatItNotContain = pr.whatItNotContain;
           scopeCard.primaryTarget = pr.primaryTarget;
           
        scopeCard.save(function(err){
            if(err){
                console.log("saving scopeCard", err);
            }
          
            ProjectSchema.Project.findById(pr.project, function(err, project){
                if(err){
                    console.log("adding scopeCard to project", err);
                }
                if(!project){
                    console.log("no project");
                }
                
                project.methodCards.push(scopeCard._id);
                project.save(function(err){
                    if(err){
                        console.log("error when adding scopeCard", err);
                         res.send(404);
                    }
                   res.send(scopeCard);
                });
            });
        }); 
 }
 
 function handleEffort(name, pr, res, user){
     var effortCard =  createEffort();
           effortCard.createdBy = user;
           effortCard.project = pr.project;
           effortCard.visibileTo =  { value : pr.visibileTo.value , name : name };
           effortCard.knowledge = { value : pr.knowledge.value , name : 'knowledge' };
           effortCard.feasibility = { value : pr.feasibility.value , name : 'feasibility' };
           effortCard.idea = { value : pr.idea.value , name : 'idea' };
           effortCard.innovation = { value : pr.innovation.value , name : 'innovation' };
           effortCard.presentation = { value : pr.presentation.value , name : 'presentation' };
        
        effortCard.save(function(err){
            if(err){
                console.log("saving effortCard", err);
            }
          
            ProjectSchema.Project.findById(pr.project, function(err, project){
                if(err){
                    console.log("adding effortCard to project", err);
                }
                if(!project){
                    console.log("no project");
                }
                
                project.methodCards.push(effortCard._id);
                project.save(function(err){
                    if(err){
                        console.log("error when adding effortCard", err);
                         res.send(404);
                    }
                   res.send(effortCard);
                });
            });
        }); 
 }
 
 function handleDescription(name, pr, res, user){
     var descriptionCard =  createDescription();
           descriptionCard.createdBy = user;
           descriptionCard.project = pr.project;
           descriptionCard.visibileTo =  { value : pr.visibileTo.value , name : name };
           descriptionCard.text = pr.text;
            if(pr.media && pr.media.mediaType){
                descriptionCard.media = { mediaType : pr.media.mediaType, url : pr.media.url };
            }
        descriptionCard.save(function(err){
            if(err){
                console.log("saving descriptionCard", err);
            }
          
            ProjectSchema.Project.findById(pr.project, function(err, project){
                if(err){
                    console.log("adding descriptionCard to project", err);
                }
                if(!project){
                    console.log("no project");
                }
                
                project.methodCards.push(descriptionCard._id);
                project.save(function(err){
                    if(err){
                        console.log("error when adding descriptionCard", err);
                         res.send(404);
                    }
                   res.send(descriptionCard);
                });
            });
        }); 
 }
 
 function handleObjective(name, pr, res, user){
       var objectiveCard =  createObjective();
           objectiveCard.createdBy = user;
           objectiveCard.project = pr.project;
           objectiveCard.visibileTo =  { value : pr.visibileTo.value , name : name };
           objectiveCard.text = pr.text;
           objectiveCard.media = { mediaType : pr.media.mediaType, url : pr.media.url };

        objectiveCard.save(function(err){
            if(err){
                console.log("saving objectiveCard", err);
            }
          
            ProjectSchema.Project.findById(pr.project, function(err, project){
                if(err){
                    console.log("adding objectiveCard to project", err);
                }
                if(!project){
                    console.log("no project");
                }
                
                project.methodCards.push(objectiveCard._id);
                project.save(function(err){
                    if(err){
                        console.log("error when adding objectiveCard", err);
                         res.send(404);
                    }
                   res.send(objectiveCard);
                });
            });
        }); 
 }
 
 function createDescription(){
      var descriptionCard = new Description({ 
           name : 'description',
           project : '',
           typeOf : 'frame',
           createdBy : '',
           updatedBy :  '',
           createdDate : Date.now(),
           updatedDate : Date.now(),
           visibileTo : { value : 0 , name : 'Public' },
           text : '',
           media : { mediaType : '', url : '' },
           subType : 'aboutproject'
       });
       return descriptionCard;
 }
 
 function createObjective(){
      var objectiveCard = new Objective({ 
           name : 'objective',
           typeOf : 'frame',
           project : '',
           createdBy : '',
           updatedBy :  '',
           createdDate : Date.now(),
           updatedDate : Date.now(),
           visibileTo : { value : 0 , name : 'Public' },
           text : '',
           media : { mediaType : '', url : '' },
           subType : 'aboutproject'
    });
    return objectiveCard;
 }

function createEffort(){
     // Effort
    var effortCard = new Effort({ 
           name : 'effort',
           typeOf : 'frame',
           createdBy : '',
           project : '',
           updatedBy :  '',
           createdDate : Date.now(),
           updatedDate : Date.now(),
           visibileTo : { value : 0 , name : 'Public' },
           knowledge : { value : 1 , name : 'knowledge' },
           feasibility : { value : 1 , name : 'feasibility' },
           idea : { value : 1 , name : 'idea' },
           innovation : { value : 1 , name : 'innovation' },
           presentation : { value : 1 , name : 'presentation' },
           subType : 'aboutproject'
    });
    return effortCard;
}

function createMilestone(){
    // Milestone
    var milestoneCard = new Milestone({ 
           name : 'milestone',
           typeOf : 'frame',
           createdBy : '',
           project : '',
           updatedBy :  '',
           createdDate : new Date(),
           updatedDate : Date.now(),
           visibileTo : { value : 0 , name : 'Public' },
           projectLaunch : new Date(),
           concept :  new Date(),
           initialDesign :  new Date(),
           finalDesign :  new Date(),
           subType : 'aboutproject',
           items : [{ title : '', date : new Date(), status : '' ,  
                     visibileTo : { value : 0 , name : 'Public' } }]
       });
     
     return milestoneCard;
}

function createScope(){
    var scopeCard = new ProjectScope({ 
           name : 'scope',
           typeOf : 'frame',
           createdBy : '',
           project : '',
           updatedBy :  '',
           createdDate : Date.now(),
           updatedDate : Date.now(),
           visibileTo : { value : 0 , name : 'Public' },
           whatToProduce : '',
           whatItContains : '',
           whatItNotContain : '',
           primaryTarget : '',
           subType : 'aboutproject'
    });
    
    return scopeCard;
}

function createTravel(){
    var travelCard = new Travel({ 
           name : 'travel',
           typeOf : 'frame',
           project : '',
           createdBy : '',
           updatedBy :  '',
           createdDate : Date.now(),
           updatedDate : Date.now(),
           visibileTo : { value : 0 , name : 'Public' },
           text : '',
           media : { mediaType : '', url : '' },
           subType : 'aboutproject'
    });
    
    return travelCard;
}

function createBackground(){
    var backgroundCard = new Background({ 
           name : 'background',
           typeOf : 'frame',
           createdBy : '',
           project : '',
           updatedBy :  '',
           createdDate : Date.now(),
           updatedDate : Date.now(),
           visibileTo : { value : 0 , name : 'Public' },
           howProjectCame : '',
           whoIsInvolved : '',
           whatItSaysAboutYou : '',
           particularIdea : '',
           subType : 'aboutproject'
    });
    
    return backgroundCard;
}

// TEAM

function createAboutTeam(){
    var aboutTeam = new AboutTeam({ 
           name : 'about',
           typeOf : 'frame',
           createdBy : '',
           project : '',
           updatedBy :  '',
           createdDate : Date.now(),
           updatedDate : Date.now(),
           visibileTo : { value : 0 , name : 'Public' },
           teamName : '',
           aboutUs : '',
           avatar :'',
           subType : 'team'
    });
    
    return aboutTeam;
}

function createTeamSkill(){
    var aboutTeam = new SkillTeam({ 
           name : 'skill',
           typeOf : 'frame',
           project : '',
           createdBy : '',
           updatedBy :  '',
           createdDate : Date.now(),
           updatedDate : Date.now(),
           visibileTo : { value : 0 , name : 'Public' },
           skillName : '',
           aboutUs : '',
           avatar :'',
           subType : 'team'
    });
    
    return aboutTeam;
}

function createTeamSetup(){
    var aboutTeam = new SetupTeam({ 
           name : 'setup',
           typeOf : 'frame',
           createdBy : '',
           project : '',
           updatedBy :  '',
           createdDate : Date.now(),
           updatedDate : Date.now(),
           visibileTo : { value : 0 , name : 'Public' },
           subType : 'team',
           timeManagement :{ 
              availability : '',
              lateComing : '',
              absence : ''
            },
            communication : {
                onlineOffline : '',
                appropriateWays : ''
            },
            teamValues :'' 
    });
    
    return aboutTeam;
}


function addDefaultFrameCards(callback){
    
    var descriptionCard = createDescription();
    var objectiveCard = createObjective();
    var effortCard = createEffort();
    var milestoneCard = createMilestone();
    var scopeCard = createScope();
    var backgroundCard = createBackground();
    var travelCard = createTravel();
    
    var aboutTeam = createAboutTeam();
    var teamSetup = createTeamSetup();
    var teamSkill = createTeamSkill();
    
    var result = [ descriptionCard, objectiveCard, effortCard, 
                   milestoneCard, scopeCard, backgroundCard, 
                   travelCard, aboutTeam, teamSetup, teamSkill ]; 
    
    return callback(result);
}