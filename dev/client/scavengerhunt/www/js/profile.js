angular.module('scavengerhunt.profile', [])
.controller('ProfileCtrl', function (PhotoFact, $rootScope, $scope) {
    $scope.init = function () {
      console.log("Profile:", $rootScope.user);
      $scope.user = $rootScope.user;
      PhotoFact.getPhotosByUser($scope.user, function (photos) {
        $scope.photos = photos;
      });
    };
});