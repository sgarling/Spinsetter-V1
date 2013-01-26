var express = require('express');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var parse = require('./server/c-parse.js').importFeed(process.argv[2], io);

// Config
app.configure(function(){
    app.use('', express.static(__dirname + '/public'));
});

// Views
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client/index.html');
});

// Server
server.listen(8080);
