/* Express quick setup */
var express = require('express');
var app = express();

/* redis setup */
var redis = require('redis');

var host = process.env['DOTCLOUD_DB_REDIS_HOST'] || undefined;
var port = process.env['DOTCLOUD_DB_REDIS_PORT'] || undefined;
port = parseInt(port);
var user = process.env['DOTCLOUD_DB_MONGODB_LOGIN'] || undefined;
var pass = process.env['DOTCLOUD_DB_MONGODB_PASSWORD'] || undefined;

var client = redis.createClient(port, host, null);

client.auth(pass, function(err) {
    if(err) console.log(err);
});

client.on("error", function (err) {
    console.log("Error " + err);
});


app.get("/", function(req, res){
    var html = '<div id="content" data-stack="node" data-appname="' + process.env['DOTCLOUD_PROJECT'] + '">';
    html += 'Hello World, from Express!';
    html += '<script type="text/javascript" src="https://helloapp.dotcloud.com/inject.min.js"></script>';

    client.set("test_string", "test_value", redis.print);
    client.get("test_string", function(err, reply) {
        console.log(reply);
    });
    res.send(html);
});

app.listen(8080);
