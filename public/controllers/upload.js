angular.module('nimbliApp')
    .controller('UploadCtrl', function($scope, $http) {

        var user = $scope.user;
       // console.log("modal user" + user._id);
        $scope.title = "Upload picture";
        $scope.myImage='';
        $scope.myCroppedImage='';
        $scope.canUpload = false;

        $http.get('/api/aws/' + user._id)
             .success(function(response){
                console.log(response);
                $scope.aws = response;
                angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
            })
             .error(function(err){
                 console.log(err);
             });

         var handleFileSelect = function(evt) {
            console.log("mt")
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function($scope){
                    $scope.myImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
            console.log( "total " + file.size);
        };

        //From http://stackoverflow.com/questions/25981813/angular-file-upload-with-ngimgcrop
        function base64ToBlob(base64Data, contentType) {
            contentType = contentType || '';
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);

            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);

                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, { type: contentType });
        }


        $scope.submit = function () {
            var file = base64ToBlob($scope.myCroppedImage.replace('data:image/png;base64,',''), 'image/jpeg');


            var fd = new FormData();

           // var key = "events/" + (new Date).getTime() + '-' + file.name;
            var aws = $scope.aws;

            fd.append('key', aws.keyname);
            fd.append('acl', 'public-read');
            fd.append('Content-Type', file.type);
            fd.append('AWSAccessKeyId', aws.keyid);
            fd.append('policy', aws.policy)
            fd.append('signature',aws.signature);

            fd.append("file",file);

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);


            xhr.open('POST', 'https://samppa.s3.amazonaws.com', true);
            //xhr.setRequestHeader("Content-Type","application/octet-stream");
            xhr.send(fd);
        };

        function uploadProgress(evt) {
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
            }
            else {
                document.getElementById('progressNumber').innerHTML = 'unable to compute';
            }
        }

        function uploadComplete(evt) {
            // Close modal.
           $scope.user.avatar = 'https://s3-us-west-2.amazonaws.com/samppa/' + $scope.user._id + '.jpg';
            $scope.updateProfile();
           $scope.closeModal();
        }

        function uploadFailed(evt) {
            alert("There was an error attempting to upload the file." + evt);
        }

        function uploadCanceled(evt) {
            alert("The upload has been canceled by the user or the browser dropped the connection.");
        }




    });