// Libraries
var express = require('express');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Database
var db = require('riak-js').getClient();

// Local libraries
var parse = require('./server/c-blogs.js').registerFeedListener(db, io);

// Config
app.configure(function()
    {
        app.use('', express.static(__dirname + '/public'));
    });

// Views
app.get('/', function (req, res)
    {
        res.sendfile(__dirname + '/public/html/index.html');
    });

app.get('/profile/:name', function(req, res)
    {
        res.sendfile(__dirname + '/public/html/profile.html');
    });


// Server
server.listen(8080);
