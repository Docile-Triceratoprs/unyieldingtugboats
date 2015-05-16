angular.module('scavengerhunt.profile', [])
.controller('ProfileCtrl', function (PhotoFact, $rootScope, $scope) {
    $scope.init = function () {
      $scope.console.log("Profile:", $rootScope.user);
      $scope.user = $rootScope.user;
      $scope.photos = PhotoFact.getPhotosByUser($scope.user);
    };
});