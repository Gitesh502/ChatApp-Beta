"use strict";

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");
var passport = require("passport");
var mongoose = require("mongoose");
var config = require("./config/config");
var expressValidator = require("express-validator");
var app = express();
var port = process.env.port || 3000;

mongoose.Promise = require("bluebird");

mongoose.connect(config.connectionString, {
  useMongoClient: true
});

mongoose.connection.on("connected", function() {
  console.log("connection to database established successfully");
  console.log("Database :", config.database);
});

mongoose.connection.on("error", function(err) {
  console.log("Error ocered while connecting to database ", err);
  console.log("Database :", config.database);
});

/**
 * importing models
 */
require("./models/user_model");
require("./models/posts_model");
require("./models/usertoken_model");
require("./models/userImages_model");
require("./models/chat_model");
require("./models/friendRequests_model");
require("./models/notification_model");
require('./models/comments_model');

/**
 * Importing routes
 */
var users = require("./routes/user_routes");
var posts = require("./routes/posts_routes");
var images = require("./routes/images_routes");
var chat = require("./routes/chat_routes");
var _sockets = require("./routes/socket_routes");
var friends = require("./routes/friend_route");
var verifyRoutes = require("./routes/verify_routes");
var notifications = require("./routes/notification_route");
/**
 * For cross domain calls
 */
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// set the view engine to ejs
app.set("view engine", "ejs");

app.get("/notify", function(req, res) {
  res.render("pages/notify");
});

/**
 * Defining static folders
 */
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add this after the bodyParser middlewares!

app.use(passport.initialize());

app.use(passport.session());

require("./helpers/passport")(passport);

/**
 * Defining routes to route engine
 */
app.use("/register", users);
app.use("/users", users);
app.use("/post", posts);
app.use("/images", images);
app.use("/chat", chat);
app.use("/friends", friends);
app.use("/verify", verifyRoutes);
app.use("/notifications", notifications);

/**
 * starting the server
 */
app.listen(port, function() {
  console.log("Web Server started at : ", port);
});
