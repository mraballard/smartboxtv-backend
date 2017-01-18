var mongoose  = require('mongoose');
var TeamSchema = require('./team');
var ObjectId = mongoose.Schema.Types.ObjectId;


var PlayerSchema = new mongoose.Schema({
  name: String,
  position: String,
  team:
    {
      type: ObjectId,
      ref: 'Team'
    }
});

module.exports = mongoose.model('Player', PlayerSchema);
