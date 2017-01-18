///////////////////////////////////////////////////
// Purpose: Requires necessary packages and runs
// server on port 3000
///////////////////////////////////////////////////

var express         = require('express');
var parseString     = require('xml2js').parseString;
var mongoose        = require('mongoose');
var http            = require('http');
var app             = express();
var indexController = require('./controllers/indexController.js');

// Import Mongoose Schemas
var Team            = require('./models/team');
var Player          = require('./models/player');

// http port that we will be listening on
var port = 3000;

app.use('/', indexController);

// Initialize Mongoose connection
mongoose.Promise = global.Promise;
var mongoURI = 'mongodb://localhost/smartboxtv-backend';
mongoose.connect(mongoURI);

//Databse Setup and start server after database check
var db = mongoose.connection;
db.on('error', function(err) { console.log(err); });
db.once('open', function() {
  initializeDatabase();
  app.listen(port, function(){
    console.log('=======================');
    console.log('Running on port ' + port);
    console.log('========================');
  });
});

// Initialize database if no fixture data exists
// Params: None
function initializeDatabase() {

  db.collection('teams').count(function (err, count) {
    if (!err && count === 0) {
      var myObj = {};
      var options = {
        hostname: "s3.amazonaws.com",
          path: '/nunchee-fxassets-local/dump.xml'
      };
      http.get(options, function (response) {
        var completeResponse = '';
        response.on('data', function (chunk) {
          // Gather XML as string
          completeResponse += chunk;
        });
        response.on('end', function() {
          // Parse XML to JSON
          parseString(completeResponse, function (err, result) {
            // Create Teams from JSON data
            result.sport.team.forEach(function(teamObj) {
              Team.create({
                _id: teamObj.$.id,
                name: teamObj.$.name,
                active: teamObj.$.active,
                players: []
              })
              .then(function(team){
                // If team has players, create players and add them to Player array on Team object
                if (teamObj.player) {
                  teamObj.player.forEach(function(playerObj) {
                    Player.create({
                      _id: playerObj.$.id,
                      name: playerObj.name,
                      position: playerObj.position,
                      team: team.id
                    })
                    .then(function(player){
                      team.players.push(player);
                      team.save();
                    })
                    .catch(function(err) {
                      console.log(err);
                    })
                  });
                }
                return team;
              })
              .catch(function(err){
                console.log(err);
              });
            });
          });
        });  // Close response.on finish
      }) // Close http request
      .on('error', function (e) {
          console.log('problem with request: ' + e.message);
      });
    }
  });
}
