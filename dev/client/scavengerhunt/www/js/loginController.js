angular.module('scavengerhunt.login', [])

.controller('LoginCtrl', function($rootScope, $state, $scope, $ionicModal, $timeout, request) {
  // Form data for the login modal
  $scope.loginData = {};
  var userInfo = $scope.loginData;

  

  // Triggered when it's a new users creating a profile.
  $scope.newUserLogin = function() {

    console.log("New user data: ", $scope.loginData);

    request.request('http://localhost:3000/api/users/newUser', userInfo, function(response) {
      console.log('made a new user! ', response);
      if(response === 'userCode'){
        $scope.closeLogin(); 
      }
    });
  };



  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log("accessed doLogin function");
    $rootScope.user = userInfo.username;
    request.request('http://johnpizzo.me:3000/api/users/loginUser', userInfo, function(response) {
      console.log('Welcome back User: ', response[0].username);
      if(response[0].username === userInfo.username) {
        $scope.closeLogin();
      }
    });
  };

  //triggered when the user logs in thru facebook
  $scope.fbLogin = function() {
    openFB.login(function(response) {
          if (response.status === 'connected') {
            console.log('Facebook login succeeded');
            $scope.closeLogin();
          } else {
            alert('Facebook login failed');
          }
        },
    {scope: 'email,publish_actions'});
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function(){
    $state.go('app.home');
  }

});



