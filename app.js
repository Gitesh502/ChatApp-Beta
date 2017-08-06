//Allows to set up middlewares to respond to HTTP Requests
//Allows to dynamically render HTML Pages based on passing arguments to templates
//Allows to build MVC framework in node js
//Follow for more info : https://expressjs.com/
const express = require('express'); 
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
//User built file , where database connection string and secret key are defined
const config = require('./config/config');
//connecting to monogo db using connection string
mongoose.connect(config.connectionString);

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

const app = express();

const users = require('./routes/user_routes');

const port = 3000;

app.use(cors());

//to server static files mean to call statics files in server (like html,css,js pages) belwo code is used
//https://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));

//Parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./helpers/passport')(passport);

app.use('/users', users);

//start server
app.listen(port, () => {
    console.log("Server started at : ", port);
});
