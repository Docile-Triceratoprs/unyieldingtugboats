var Hunts = require('./huntModel');
var rp = require('request-promise');

module.exports = {

  // Hunt Helper Functions
  // ---------------------

  // Get a list of hunts from the database, optional zip code, limit 10
  // curl -i http://localhost:3000/api/hunts
  // OR
  // curl -i http://localhost:3000/api/hunts?zip=94536
  getHunts: function(req, res, next) {
    var queryObj = {};
    if (req.query.address) {
      var address = getCords(req.query.address);
      var radius = parseInt(req.query.radius);
      //retrieve hunts in specified address

      rp('http://maps.googleapis.com/maps/api/geocode/json?address=' + address)
        .then(function(body){
          var result = JSON.parse(body);
          lat = result.results[0].geometry.location.lat;
          lng = result.results[0].geometry.location.lng;
          console.log('google answered ',lat,' - ',lng);
          var cords = [lng, lat];
          var loc = {
                         "lat" : lat,
                         "lng" : lng
                        };
          
          getHuntsByLoc(cords, radius, req, res, next);
        });

      
    } else {
      //retrieve most recently added hunts
      Hunts.find({})
           .limit(10)
           .sort({date: -1})
           .exec(function(err, results) { 
              if (err) {
                console.log('Error fetching from Hunts DB');
                next(err);
              } else {
                res.queryResults = JSON.stringify(results);
                next();
              }
            });
    }

  },

  getHuntsByLoc : function(cords, radius, req, res, next) {
    Hunts.find({loc: {

                $nearSphere: {
                  $geometry: {
                    type : "Point",
                    coordinates : cords,
                  },
                  $maxDistance: radius
                }

      }})
           .limit(10)
           .exec(function(err, results) { 
              if (err) {
                console.log('Error fetching from Hunts DB');
                next(err);
              } else {
                res.queryResults = JSON.stringify(results);
                next();
              }
            });
  },

  // Add a new hunt to the database
  // curl -H "Content-Type: application/json" -X POST -d '{"info" : "infos about hunt", "region" : 94536, "tags" : [ "tag", "another tag" ], "photos" : [ "photo1_id", "photo2_id" ]}' http://localhost:3000/api/hunts/new
  addHunt: function(req, res, next) {
    console.log(req.body);
    var address = req.body.address;
    rp('http://maps.googleapis.com/maps/api/geocode/json?address=' + address)
        .then(function(body){
          var result = JSON.parse(body);
          lat = result.results[0].geometry.location.lat;
          lng = result.results[0].geometry.location.lng;
          console.log('google answered ',lat,' - ',lng);
          var cords = [lng, lat];
          req.body.loc = {};
          req.body.type = cords;
          
          Hunts.create(req.body, function(err) {
            if (err) {
            console.log('Error creating new hunt');
            next(err);
          } else {
            console.log('hunt was added');
           next();
         }
       });


        });

     
  },
  
  updateReview: function(req,res,next) {
    Hunts.findOne({_id :req.body.hunt._id}, function(err, hunt) {
      if(err) {
        console.log('error in search parameters for query');
        res.writeHead(404)
        res.end('query for hunt failed in review update');
      }
      else if(hunt) {
        if(req.body.comment) {
          hunt.comments = hunt.comments || [];
          hunt.comments.push(req.body.comment);
        }
        hunt.totalReviews = hunt.totalReviews || 0;
        hunt.totalReviews++;
        hunt.accumulatedScore = hunt.accumulatedScore || 0;
        hunt.accumulatedScore += req.body.rating.score;
        hunt.averageScore = hunt.averageScore || 0;
        hunt.averageScore = hunt.accumulatedScore / hunt.totalReviews;
        hunt.save(function(err, hunt) {
          if(err) {
            console.log('error in saving review', err)
            res.writeHead(505)
            res.end('error in saving to database')
          }
          else {
            console.log('success on saving review!');
            res.writeHead(201);
            res.end(JSON.stringify(hunt));
          }
        })
      }
      else {
        console.log('query did not find results');
        res.writeHead(404)
        res.end('query did not find results')
      }
    });
  },

  // End request with proper code and response data
  fns: function(req, res){

    if (res.queryResults) {

      res.writeHead(200);
      res.end(res.queryResults);

    } else {

      res.writeHead(201);
      res.end('Successfully added your hunt');

    }

  }
}
