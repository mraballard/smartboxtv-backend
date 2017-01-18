var express       = require('express');
var bodyParser    = require('body-parser');
var parseString   = require('xml2js').parseString;
var convert       = require('xml-js');
var mongoose      = require('mongoose');
var logger        = require('morgan');
var http          = require('http');
var pry           = require('pryjs');
var app           = express();
var router        = express.Router();
var indexController = require('./controllers/indexController.js');
var Team        = require('./models/team');
var Player      = require('./models/player');

// app.use(bodyParser.json());  // Need this?
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(xmlParser());
app.use(logger('dev'));
app.use('/', indexController);


mongoose.Promise = global.Promise;
var mongoURI = 'mongodb://localhost/smartboxtv-backend';
mongoose.connect(mongoURI);


//Databse Setup
var db = mongoose.connection;
db.on('error', function(err) { console.log(err); });
db.once('open', function(){ console.log('Connected to Mongo database'); });


app.get('/', function(req, res) {
  res.json({status: 200, message: "Server up and running"});

  db.collection('teams').count(function (err, count) {
    // CHECK IF DATABASE IS EMPTY
      if (!err && count === 0) {
        var myObj = {};
        // IF EMPTY, POPULATE DATABASE
        var options = {
              hostname: "s3.amazonaws.com",
              path: '/nunchee-fxassets-local/dump.xml'
          };
        // GET ROUTE FOR DATABASE INITIALIZATION - XML DATA SOURCE
        http.get(options, function (response) {
            var completeResponse = '';
            response.on('data', function (chunk) {
                completeResponse += chunk;
            });
            response.on('end', function() {
              // var result = convert.xml2json(completeResponse, {compact: true, spaces:4, fullTagEmptyElement: true});
              // console.log(result);
              parseString(completeResponse, function (err, result) {
                // eval(pry.it);
                result.sport.team.forEach(function(teamObj) {
                  Team.create(teamObj.$);
                });
              });
            });
          }).on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
      }
  });
});

app.listen(3000);
