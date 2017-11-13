const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/config');
const expressValidator = require('express-validator');
const app = express();
const port = 3000;

mongoose.Promise = require('bluebird');

mongoose.connect(config.connectionString, {
	useMongoClient: true
});

mongoose.connection.on('connected', () => {
	console.log('connection to database established successfully');
	console.log('Database :', config.database);
});

mongoose.connection.on('error', (err) => {
	console.log('Error ocered while connecting to database ', err);
	console.log('Database :', config.database);
});

/**
 * importing models 
 */
require('./models/user_model');
require('./models/posts_model');
require('./models/usertoken_model');
require('./models/userImages_model');
require('./models/chat_model');

/**
 * Importing routes
 */
const users = require('./routes/user_routes');
const posts = require('./routes/posts_routes');
const images = require('./routes/images_routes');
const chat = require('./routes/chat_routes');
const friends=require('./routes/friend_route');
const verifyRoutes=require('./routes/verify_routes');
/**
 * For cross domain calls
 */
app.use(cors());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/notify', function(req, res) {
    res.render('pages/notify');
});


/**
 * Defining static folders
 */
app.use('/assets',express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(__dirname + '/uploads'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add this after the bodyParser middlewares!


app.use(passport.initialize());

app.use(passport.session());

require('./helpers/passport')(passport);

/**
 * Defining routes to route engine
 */
app.use('/register', users);
app.use('/users', users);
app.use('/post', posts);
app.use('/images', images);
app.use('/chat', chat);
app.use('/friends',friends);
app.use('/verify',verifyRoutes);
/**
 * starting the server
 */
app.listen(port, () => {
	console.log("Server started at : ", port);
});