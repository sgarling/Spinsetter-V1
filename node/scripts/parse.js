// Libraries
var feedparser = require('feedparser');
var jsdom = require('jsdom');
var qs = require('qs');
var url = require('url');
var kue = require('kue')
  , jobs = kue.createQueue();

// Blogs file
var blogs = require('../config/blogs.json')

// Database
var db = require('riak-js').getClient();

// Process feeds
function processFeeds ()
{
  console.log ('Processing feeds');
  console.log (blogs.length);
  for (var i = 0; i < blogs.length; i++)
  {
    console.log(blogs[i].name);
  }

}

processFeeds();

// Exit
process.exit (0);
