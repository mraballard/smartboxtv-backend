var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var xmlParser     = require('express-xml-bodyparser');
var mongoose      = require('mongoose');
var router        = express.Router();
var indexController = require('./controllers/indexController.js');
var Team        = require('./models/team');
var Player      = require('./models/player');

// app.use(bodyParser.json());  // Need this?
// app.use(bodyParser.urlencoded({extended: false}));
app.use(xmlParser());
app.use('/', indexController);


mongoose.Promise = global.Promise;
var mongoURI = 'mongodb://localhost/smartboxtv-backend';
mongoose.connect(mongoURI);


//Databse Setup
var db = mongoose.connection;
db.on('error', function(err) { console.log(err); });
db.once('open', function(){ console.log('Connected to Mongo database'); });

// GET ROUTE FOR DATABASE INITIALIZATION - XML DATA SOURCE
db.collection('teams').count(function (err, count) {
  // CHECK IF DATABASE IS EMPTY
    if (!err && count === 0) {
      // IF EMPTY, POPULATE DATABASE
      Team.create({name: 'Test', active: false})
        .then(function(res) {
          console.log(db.collection('teams').find());
        });
    }
});




app.get('/', function(req, res) {
  res.json({status: 200, message: "Server up and running"});
});

app.listen(3000);
