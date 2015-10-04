angular.module('nimbliApp').controller('CarouselCtrl', function($scope){
    'use strict';
    
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.slides = [
                     {'image' : 'images/carousel/1.jpg', 'text': 'Innovate' }, 
                     {'image' : 'images/carousel/2.png', 'text': 'Ideate'}, 
                     {'image' : 'images/carousel/3.jpg', 'text': 'Brainstorm'}];
});