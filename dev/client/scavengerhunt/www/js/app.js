//app.js
//------------------
 // loads all other controllers and factories onto the page.
 // handles application routing using ui-router
 // asynchronously loads the google maps api
 // defines AppController
 
angular.module('scavengerhunt', ['ionic',
               'ngCordova',
               'requestFactory',
               'scavengerhunt.newhuntFactory',
               'scavengerhunt.photofact', 
               'scavengerhunt.huntfactory',
               'scavengerhunt.photos',
               'scavengerhunt.hunts',
               'scavengerhunt.newPhoto',
               'scavengerhunt.newhunts',
               'scavengerhunt.login',
               'scavengerhunt.profile',
               'uiGmapgoogle-maps'])
.config(function($stateProvider, $urlRouterProvider) {
  
  openFB.init({appId: '371900856327943'});

  // hunts view (homepage)
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('app', {
    url: '/app', 
    templateUrl: 'templates/renderer.html'
  })
  .state('app.home', {
    url: '/home',
    templateUrl: 'templates/hunts.html',
    controller: 'HuntsCtrl'
  })
  .state('app.profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html'
  })
  // photos view
  .state('app.pics', {
    url: '/pics',
    cache: false,
    templateUrl: 'templates/pics.html',
    controller: 'PhotosCtrl'
  })

  // the first form for creating a new hunt
  .state('app.newhunt', {
    url: '/newhunt',
    templateUrl: 'templates/newhuntsmodal.html',
    controller: 'NewHuntCtrl'
  })

  // the photo selection view
  .state('app.newhuntphotos', {
    url: '/newhunt/photoSelect',
    cache: false,
    templateUrl: 'templates/newHuntPhotoSelect.html',
    controller: 'NewHuntCtrl'
  })

  // review and save hunt. shows photo map.
  .state('app.newhuntreview', {
    url: '/newhunt/review',
    cache: false,
    templateUrl: 'templates/newHuntReview.html',
    controller: 'NewHuntCtrl'
  })

  // add new photo 
  .state('app.newphoto', {
    url: '/newphoto',
    cache: false,
    templateUrl: 'templates/newPhoto.html',
    controller: 'NewPhotoCtrl'
  });

  $urlRouterProvider.otherwise('login');

})
.config(function($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})
.config(function(uiGmapGoogleMapApiProvider) {
  // asynchronously load the google maps api, as instructed by angular-google-maps.
  // (see their docs for reference)
  uiGmapGoogleMapApiProvider.configure({
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  });
})

