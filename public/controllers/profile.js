'use strict';

angular.module('nimbliApp')
    .controller('ProfileCtrl',  function($scope, $auth, $alert, AccountService, $location, $modal) {

        $scope.editMode = false;

        /**
         * Get user's profile information.
         */
        $scope.getProfile = function() {
            AccountService.getProfile()
                .success(function(data) {
                    $scope.user = data;
                    
                    if($scope.user.avatar === null || $scope.user.avatar === undefined){
                        $scope.user.avatar = '//placehold.it/230';
                    }
                })
                .error(function(error) {
                    $auth.logout().then(function(){
                        $location.path('/signup');

                        $alert({
                            content: error.message,
                            animation: 'fadeZoomFadeDown',
                            type: 'material',
                            duration: 3
                        });
                    });
                 });
        };

        /**
         * Update user's profile information.
         */
        $scope.updateProfile = function() {

            AccountService.updateProfile({
                displayName: $scope.user.displayName,
                about: $scope.user.about,
                skills : $scope.user.skills,
                location: $scope.user.location,
                avatar : $scope.user.avatar
            }).then(function() {
                    $alert({
                        content: 'Profile has been updated',
                        animation: 'fadeZoomFadeDown',
                        type: 'info',
                        duration: 3
                    });
                });
        };

        /**
         * Link third-party provider.
         */
        $scope.link = function(provider) {
            $auth.link(provider)
                .then(function() {
                    $alert({
                        content: 'You have successfully linked ' + provider + ' account',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                })
                .then(function() {
                    $scope.getProfile();
                })
                .catch(function(response) {
                    $alert({
                        content: response.data.message,
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                });
        };

        /**
         * Unlink third-party provider.
         */
        $scope.unlink = function(provider) {
            $auth.unlink(provider)
                .then(function() {
                    $alert({
                        content: 'You have successfully unlinked ' + provider + ' account',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                })
                .then(function() {
                    $scope.getProfile();
                })
                .catch(function(response) {
                    $alert({
                        content: response.data ? response.data.message : 'Could not unlink ' + provider + ' account',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                });
        };

        $scope.getProfile();

        $scope.truncateAbout = function(about){
            if(about.length > 140){
                return 'Maximum allowed character is 140';
            }
        };

        $scope.addSkill = function(){

            if($scope.newSkill.name.length === 0){
                return;
            }
            var skill = {
                 id : $scope.user.skills.length + 1,
                 name : $scope.newSkill.name.trim()
            };

            $scope.user.skills.push(skill);
            $scope.newSkill.name = '';
        };

        $scope.removeSkill = function(index){
            $scope.user.skills.splice(index, 1);
            this.updateProfile();
        };

        $scope.newSkill = { name : '' };

        var template = 'partials/modal/modal_upload_avatar.tpl.html';
        $scope.openModal = function(){

            var theModal =  $modal({
                scope: $scope,
                template: template,
                show: true
            });
           $scope.showModal = function() {
                theModal.$promise.then(theModal.show);
           };
           $scope.closeModal = function(){
                theModal.$promise.then(theModal.hide);
           };
        };

        $scope.edit = function(){
            this.editMode = true;
        };

        $scope.save = function(){
            this.updateProfile();
            this.editMode = false;
        };

        $scope.cancel = function(){
            this.editMode = false;
        };

    });