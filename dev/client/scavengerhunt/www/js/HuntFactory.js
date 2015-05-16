//Factory to get hunts from the server to display to the user
//----------------------------------------------------

angular.module('scavengerhunt.huntfactory', [])
.factory('HuntFact', function(request) {
  var hunts = []; 
  return {

    //get hunts from the database by making a request to api/hunts
    getHunts: function(zip, radius, callback) {
      var zipCode = '';
      if (zip) {
        zipCode = '?zip='+zip+'&radius='+radius;
      }

      //uses request Factory to send request to back end
      request.request('http://johnpizzo.me:3000/api/hunts' + zipCode, null, function(data) {
        callback(data);
      });
    }

  }
});
