var mongoose  = require('mongoose');
var PlayerSchema = require('./player').schema;


var TeamSchema = new mongoose.Schema({
  _id: String,
  name: String,
  active: Boolean,
  players: [PlayerSchema]
});

module.exports = mongoose.model('Team', TeamSchema);
