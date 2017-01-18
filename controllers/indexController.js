///////////////////////////////////////////////////
// Purpose: Defines all routes supported by server
///////////////////////////////////////////////////

var express     = require('express');
var router      = express.Router();
var Team        = require('../models/team');
var Player      = require('../models/player');
var server      = require('../server.js');

// Root route redirects to api/teams route
// Params: None
router.get('/', function(req, res) {
  res.redirect('/api/teams');
});

// Return list of all teams
// Params: None
router.get('/api/teams', function(req, res) {
  Team.find()
  .then(function(teams){
    res.json(teams);
  })
  .catch(function(err) {
    console.log(err);
  })
});

// Return Team and associated players
// Params:
//   idTeam: Team ID (String)
router.get('/api/teams/:idTeam', function(req, res) {
  // For simplicity, no validation checking for :idTeam
  Team.find({_id: req.params.idTeam})
  .then(function(team){
    res.json(team);
  })
  .catch(function(err) {
    console.log(err);
    res.json({status: 500, message: "An error occurred"});
  })
});

// Return only list of players on team
// Params:
//   idTeam: Team ID (String)
router.get('/api/teams/:idTeam/players', function(req, res) {
  Player.find({team: req.params.idTeam}).exec()
  .then(function(players){
    res.json(players);
  })
  .catch(function(err) {
    console.log(err);
    res.json({status: 500, message: "An error occurred"});
  })
});

// Return players at requested position on active teams
// Params:
//   position: Player Position (String)
router.get('/api/teams/players/:position', function(req, res) {
  Team.find({active: true}).exec()  // Find all teams that are active
  .then(function(teams){
    var activePlayers = [];
    teams.forEach(function(team){  // Loop through each team, check if players exist
      if (team.players.length) {
        team.players.forEach(function(player) {
          activePlayers.push(player)  // If players exist, push to array of active players
        });
      }
    })
    return activePlayers;
  })
  .then(function(players) {
    var playersToShow = players.filter(function(player) {  // Create new array of players who play the position in params
      return player.position == req.params.position;
    });
    res.json(playersToShow);
  })
  .catch(function(err) {
    console.log(err);
    res.json({status: 500, message: "An error occurred"});
  })
});


module.exports = router;
