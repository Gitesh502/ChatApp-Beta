var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socketioJwt = require('socketio-jwt');
const socketController = require('../controller/socket_controller/sockets');
const config = require('../config/config');

io.use(socketioJwt.authorize({
  secret: config.secretkey,
  handshake: true
}));
io.on('connection', socketController.connect);
server.on('listening',function(){
    console.log('Socket server is running at'+4000);
});
server.listen(4000);
