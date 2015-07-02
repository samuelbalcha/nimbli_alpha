/**
 console.log($scope.email + " " + $scope.password);

 $scope.loginUser = function(){
            $http.post(
                '/api/login',
                {
                    email: $scope.email,
                    password : $scope.password
                }).success(function(response){
                $location.path('/users');
            });
        }


angular.module('nimbliApp')
    .controller('LoginController', function ($scope, $auth) {

        $scope.authenticate = function(provider) {
            $auth.authenticate(provider);
        };
    });


angular.module('nimbliApp')
    .controller('IndexController', function ($scope, $http) {
        $scope.users = {};

        // when landing on the page, get all users and show
        $http.get('/api/users')
            .success(function(data)
            {
                $scope.users = data;
                console.log(data);
            })
            .error(function(data)
            {
                console.log('Error: ' + data);
            });
    });

 // create user
 app.post('/api/users', function(req, res, next) {

    // create a user
    var user = new User();
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.about = req.body.about;
    user.skills = req.body.skills;
    user.createdAt = Date.now();
    user.avatar = req.body.avatar;
    console.log(user + " before create");
    // save the user
    user.save(function(err, user)
    {
        if(!err){
            console.log('_id of saved user: ' + user._id);
            res.json(user);
        }
    });

});

 var policy = {
        expiration: expiration.toISOString(),
        conditions: [
            {bucket : "designfactory"},
            ["starts-with", "$key", "uploads/"],
            {"acl": "public-read"},
            {"success_action_redirect": "http://localhost:8080"},
            ["starts-with", "$Content-Type", "image/"],
            {"x-amz-meta-uuid": "14365123651274"},
            ["starts-with", "$x-amz-meta-tag", ""],

            {"x-amz-credential": credential},
            {"x-amz-algorithm": "AWS4-HMAC-SHA256"},
            {"x-amz-date": amzDate.toISOString() }
        ]
    };

 <input type="hidden" name="AWSAccessKeyId" value="{{ aws.keyid }}" />
 <input type="hidden" name="key" value="{{ aws.keyname }}" />
 <input type="hidden" name="Content-Type" value="image/jpeg" />
 <input type="hidden" name="acl" value="public-read" />
 <input type="hidden" name="Policy" value="{{ aws.policy }}"/>
 <input type="hidden" name="Signature" value="{{ aws.signature }}" />


 app.post('/api/user/uploads/', multipartyMiddleware, function(req, res){

      var file = req.files.file;
      console.log(file);
      //console.log(file.type);

      if(!file){
          res.json(400, { error:"Error in file upload" });
      }

      User.findById(req.params.id, function (err, user) {

          if(err){
           res.json(400, { error : err});
         }
          user.avatar = file;

          user.save(function(err){
              if(err){
                  res.json(400 ,{ error : err} );
              }

          });
      });
});


 */