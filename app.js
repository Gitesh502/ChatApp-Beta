//Allows to set up middlewares to respond to HTTP Requests
//Allows to dynamically render HTML Pages based on passing arguments to templates
//Allows to build MVC framework in node js
//Follow for more info : https://expressjs.com/
const express = require('express'); 

var multer = require('multer');

//The path module provides utilities for working with file and directory paths
//Its an pre built module for node js no need to install
//For more info : https://nodejs.org/api/path.html or https://www.w3schools.com/nodejs/ref_path.asp
const path = require('path');

//Parse incoming request bodies in a middleware before your handlers, available under the req.body property
//for more info https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');

//For allowing cross site requets
const cors = require('cors');

//For passport type authentication
//For info check : https://blog.risingstack.com/web-authentication-methods-explained/
const passport = require('passport');

//Acts as ORm for node js
const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

//User built file , where database connection string and secret key are defined
const config = require('./config/config');

//connecting to monogo db using connection string
mongoose.connect(config.connectionString, { useMongoClient: true });

//Predefined function , invoked when database is connected successfully
mongoose.connection.on('connected', () => {
    console.log('connection to database established successfully');
    console.log('Database :', config.database);
});

//Predefined function , invoked when there is error while connecting to database
mongoose.connection.on('error', (err) => {
    console.log('Error ocered while connecting to database ', err);
    console.log('Database :', config.database);
});

require('./models/user_model');
require('./models/posts_model');
require('./models/usertoken_model');
require('./models/userImages_model');

const users = require('./routes/user_routes');
const posts=require('./routes/posts_routes');
const images=require('./routes/images_routes');

const app = express();

const port = 3000;

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
//to server static files mean to call statics files in server (like html,css,js pages) belwo code is used
//https://expressjs.com/en/starter/static-files.html

//app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(__dirname+'/uploads'));
//app.use(express.static(path.join(__dirname,'client')));
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./helpers/passport')(passport);

app.use('/users', users);
app.use('/post',posts);
app.use('/images',images);

//start server
app.listen(port, () => {
    console.log("Server started at : ", port);
});
