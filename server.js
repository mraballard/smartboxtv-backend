var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var xmlParser     = require('express-xml-bodyparser');
var mongoose      = require('mongoose');


// app.use(bodyParser.json());  // Need this?
// app.use(bodyParser.urlencoded({extended: false}));
app.use(xmlParser());
app.use(express.static('public'));


mongoose.Promise = global.Promise;
var mongoURI = 'mongodb://localhost/smartboxtv-backend';
mongoose.connect(mongoURI);


//Databse Setup
var db = mongoose.connection;
db.on('error', function(err){ console.log(err); });
db.once('open', function(){ console.log('Connected to Mongo database'); });


app.get('/', function(req, res) {
  res.json({status: 200, message: "Server up and running"});
});

app.listen(3000);
