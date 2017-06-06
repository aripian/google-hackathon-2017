var express = require('express');
var path = require('path');
var app = express();


var bodyParser = require('body-parser');
var gcm = require('node-gcm');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//To allow cross origin request
app.use(function(req, res, next) {
  res.header('AMP-Access-Control-Allow-Source-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//To server static assests in root dir
app.use(express.static(__dirname));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//To server index.html page
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/payment-status', function (req, res) {
  res.render('payment-status');
})

app.get('/price', function(req, res) {
  res.render('plans', {
    success: true,
    premium: Math.floor((Math.random() * 100) + 200),
    regular: Math.floor((Math.random() * 100) + 75)
  });
});


//To receive push request from client
app.post('/send_notification', function (req, res) {
  if (!req.body) {
    res.status(400);
  }

  var message = new gcm.Message();
  var temp = req.body.endpoint.split('/'); //End point send from client
  var regTokens = [temp[temp.length - 1]];

  var sender = new gcm.Sender("AIzaSyAKlZYO0XKTsDHSUtK9P6tiNK7cJWB8Tt4"); //API key
  console.log("this is triggered!!")
  // Now the sender can be used to send messages
  sender.send(message, { registrationTokens: regTokens }, function (error, response) {
  	if (error) {
      console.error(error);
      res.status(400);
    }
  	else {
     	console.log(response);
      res.status(200);
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Local Server : http://localhost:3000');
});
