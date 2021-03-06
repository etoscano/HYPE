'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var app = require('express')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort =  process.env.PORT || 3000;

// var cors = require('cors');
//
// app.use(cors());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

////// MAIL ///////////////////////////////////////


var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var nodemailer = require('nodemailer');

app.post('/send-email', function (req, res) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'leta.barrows@ethereal.email',
          pass: 'wN31h5Bv31kJeg64xj'
        }
      });
      var mailOptions = {
        from: req.body.email,
        to: 'leta.barrows@ethereal.email',
        subject: req.body.subject,
        text: req.body.message
      };
      // if (mailOptions.subject !== undefined && mailOptions.text !== undefined) {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            console.log('mail ' + mailOptions.subject + " - " + mailOptions.text);
          }
        });
        res.writeHead(301, {Location: '/pages/contact-us.html?msg=thanks'});
        res.end();
      }
    // }
);

/////////////////////////////////////////////////////////
let serveStatic = require("serve-static");

let { setupDataLayer } = require("./service/DataLayer");


app.use(serveStatic(__dirname + "/public"));

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());


// first setup the datalayer then start the server
  setupDataLayer().then(() => {
    console.log("Set up data layer");
    // Start the server
    http.createServer(app).listen(serverPort, function () {
      console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
      console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    });
  });
});


//////////////////////////////////////////////////////
// const express = require('express');
// const app = express();
// const path = require('path');
// const port = process.env.PORT || 3000;
// const bodyParser = require('body-parser');
//
// app.listen(port, () => console.log(`listening on port ${port}!`));
// app.use(express.static(__dirname + '/public'));
//
//
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/pages/index.html'));
// });
//
// app.get('/index.html', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/pages/index.html'));
// });
//
// app.get('/events.html', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/pages/events.html'));
// });
//
// app.get('/volunteers.html', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/pages/volunteers.html'));
// });
//
// app.get('/event.html', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/pages/event.html'));
// });
// app.get('/volunteer.html', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/pages/volunteer.html'));
// });
//
// app.get('/about.html', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/pages/about.html'));
// });
//
// app.get('/activities.html', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/pages/activities.html'));
// });
//
// app.get('/contact-us.html', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/pages/contact-us.html'));
// });
//
// app.get('/terms.html', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/pages/terms.html'));
// });
//
//


