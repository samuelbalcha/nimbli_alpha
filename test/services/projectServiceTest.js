describe ('Service: ProjectService', function () {
  
   var $httpBackend, ProjectService, NotificationService, user_roles;
   var url = '/api/projects';
   var pr = new project();
   pr.title = 'Project 1';
  
    beforeEach(function(){
        module('nimbliApp');
        inject(function( _$httpBackend_, _ProjectService_, _NotificationService_, USER_ROLES) {
            $httpBackend = _$httpBackend_;
            ProjectService = _ProjectService_;
            NotificationService = _NotificationService_;
            user_roles = USER_ROLES;
        });
    });
    
    afterEach (function () {
        //$httpBackend.verifyNoOutstandingExpectation ();
        $httpBackend.verifyNoOutstandingRequest ();
    });
    
    
    describe('when getProjects is called', function() {
       
       it('should return projects', function(){
           
         var projects = createProjects(1, 5);
         $httpBackend.whenGET(url).respond(projects);
         ProjectService.getProjects();
         
         $httpBackend.expectGET('partials/project/list-projects.html').respond('');
         $httpBackend.flush();
         
         expect(ProjectService.getProjectCount()).toBe(4); 
       }); 
    });
    
    describe('when getProject is called', function() {
       
       it('should return project', function(){
         var p = new project();
         p.title = 'Project 1';
         $httpBackend.whenGET(url + '/' + 1).respond(p);
         
         ProjectService.getProject(1);
         $httpBackend.expectGET('partials/project/list-projects.html').respond('');
         $httpBackend.flush();
         
         expect(ProjectService.getCurrentProject().title).toBe('Project 1'); 
       }); 
    });
    
    describe('when updateProject is called', function() {
       
       it('should update project and return it', function(){
         
         pr.title = 'Project 1 with update';
         pr._id = 1; 
         $httpBackend.expectPUT(url + '/' + 1, pr).respond(pr);
         $httpBackend.expectGET('partials/project/list-projects.html').respond('');
         
         ProjectService.updateProject(pr); 
         $httpBackend.flush();
         
         expect(ProjectService.getCurrentProject().title).toBe('Project 1 with update');   
       }); 
    });
    
    describe('when deleteProject is called', function() {
       
       it('should delete project and currentProject returns null', function(){
         var p = new project();
         p.title = 'Project 1';
         
         ProjectService.setCurrentProject(p);
         var currentProject = ProjectService.getCurrentProject();
         
         expect(currentProject.title).toBe('Project 1');
         $httpBackend.whenDELETE(url + '/' + 1).respond(p);
         
         ProjectService.removeProject(1);
         $httpBackend.expectGET('partials/project/list-projects.html').respond('');
         $httpBackend.flush();
         
         expect(ProjectService.getCurrentProject()).toBe(null);   
       }); 
    });
    
    describe('when createProject is called', function() {
        
        it('should create project and set it to currentProject', function(){
            var p = new project();
            p.title = 'New project';
            p._id = 12;
            
            $httpBackend.whenPOST(url, p).respond(p);
            ProjectService.createProject(p);
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            
            expect(ProjectService.getCurrentProject()._id).toBe(12);
        });
    });
    
    describe('when getUserProjects is called', function() {
        
        it('should get all projects related to user', function(){
            var projects = createProjects(1, 4, 56);
           
            // /api/projects/user/:id
            $httpBackend.whenGET(url + '/user/' + 56).respond(projects);
            ProjectService.getUserProjects(56);
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            
            expect(ProjectService.getProjectCount()).toBe(3);
        });
    });
    
    describe('when getUserProjects is called', function() {
        
        it('should get all projects related to user', function(){
            var projects = createProjects(1, 4, 56);
            var p = new project();
            p._id = 30;
            p.title = "something else";
            projects.push(p);
        
            // /api/projects/user/:id
            $httpBackend.whenGET(url + '/user/' + 56).respond(projects);
            var filter = 0;
            ProjectService.getUserProjects = jasmine.createSpy("getUserProjects() spy").and.callFake(function() {
                for(var i= 0; i < projects.length; i++){
                   if(projects[i].createdBy === 56){
                     filter++;
                   }
                }
            });
          
            ProjectService.getUserProjects(56);
           
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            expect(projects.length).toEqual(4);
            expect(filter).toBe(3);
        });
    });
    
     describe('when addUserToProject is called', function() {
        
        it('should add user to the project with the provided role', function(){
            var projects = createProjects(1, 2, 56);
            var pr = projects[0];
            pr.team = [];
            ProjectService.setCurrentProject(pr);
            
            // /api/projects/projectId/user/:id, { role } 
            $httpBackend.whenPUT(url + '/' + 1 + '/user/' + 56, { userId: 345, role: 'team', projectId : 1 } ).respond(projects);
            ProjectService.addUserToProject = jasmine.createSpy("addUserToProject()").and.callFake(function() {
                var currentProject = ProjectService.getCurrentProject();
                currentProject.team.push(345);  
            });
            
            ProjectService.addUserToProject({ _id: 345, role: 'team' });
            $httpBackend.expectGET('partials/project/list-projects.html').respond('');
            $httpBackend.flush();
            
            expect(ProjectService.getCurrentProject().team[0]).toEqual(345);
        });
    });
    
    describe('when setUserProjectRole is called', function() {
        
        it('should set userRole with the provided role and publish using NotificationService', function(){
           
            spyOn(NotificationService, "publish");
            ProjectService.setUserProjectRole(user_roles.owner);
            
            expect(ProjectService.getUserProjectRole()).toEqual(user_roles.owner);
            expect(NotificationService.publish).toHaveBeenCalled();
        });
    });
    
   function project (title, company, school, supervisors, team, status) { 
       _id: 1;
       title : title ||'Project 1';
       company : company || 'nimbli.org'; 
       coverPicture : 'http://imagestore.com/1.jpg'; 
       school : school || 'Aalto University';
       supervisors : supervisors || [ { id : 1, name : 'Mikko Koria'}, { id: 2, name: 'Eetu Kalevi'} ]; 
       companyStaff : [ { id : 1, name : 'Jukka Pekka'}, { id: 2, name: 'Andre John'} ];
       team : team || [ ];
       description : 'This is good stuff';
       status : status || 'Private';
       dateCreated : ' ';
       createdBy : 1;
   };
   
   function createProjects(i, max, user){
        var projects = [];
         for( i= 1; i < max; i++){
             var p = new project();
             p.title = 'Project ' + i;
             p._id = i;
             p.company = 'Company ' + i;
             p.createdBy = user;
             projects.push(p);
         }
         
         return projects;
   }
    
});