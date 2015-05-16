angular.module('scavengerhunt.newPhoto', [])
.controller('NewPhotoCtrl', function ($rootScope, $cordovaFileTransfer, $scope) {
  console.log('Camera Controller');
  console.log(navigator.camera);
  var options = {
    quality: 50,
    encodingType: navigator.camera.EncodingType.JPEG,
    destinationType: navigator.camera.DestinationType.FILE_URI
  };
  $scope.init = function () {
    console.log("INIT");
  }
  var fail = function (err) {
    console.log('fail:', err);
  };
  var pass = function (data) {
    console.log("Image taken.");
    $scope.fileUri = data;
    $scope.$apply();
    //   CordovaExif.readData(data, function(exifObject) {
    //     console.log("EXIF OBJECT:",exifObject, typeof exifObject);
    // });

  };
  
  $scope.sendPictureWithLocation = function (data,tags, info) {
    console.log(tags, ":TAGS");
    console.log(info, ":info");
    console.log(data, ":DATA");
      var user = $rootScope.user;
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(JSON.stringify(position.coords));
        var options = new FileUploadOptions();
        options.mimeType = "image/jpeg";
        options.params = {
          lon: position.coords.longitude,
          lat: position.coords.latitude,
          tags: tags,
          info: info,
          user: user
        };

        $cordovaFileTransfer.upload("http://localhost:3000/api/photos/new", data, options, true)
          .then(function (response) {
            console.log("Uploaded:", response);
          });  
      });
    };
console.log("PICTURE");
  navigator.camera.getPicture(pass, fail, options);
});