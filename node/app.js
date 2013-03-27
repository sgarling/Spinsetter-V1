// Libraries
var express = require('express');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Config files
var blogs = require('./server/blogs.json')

// Local libraries
var parse = require('./server/c-parse.js').processFeeds(blogs, io);

// Config
app.configure(function()
    {
        app.use('', express.static(__dirname + '/public'));
    });

// Views
app.get('/', function (req, res)
    {
        res.sendfile(__dirname + '/client/index.html');
    });
app.get('/:name', function(req, res)
    {
        res.sendfile(__dirname + '/public/html/' + req.params.name);
    });

// Server
server.listen(8000);
