var mongoose  = require('mongoose');
var TeamSchema = require('./team');
var ObjectId = mongoose.Schema.Types.ObjectId;


var PlayerSchema = new mongoose.Schema({
  _id: String,
  name: String,
  position: String,
  team:
    {
      type: String,
      ref: 'Team'
    }
});

module.exports = mongoose.model('Player', PlayerSchema);
