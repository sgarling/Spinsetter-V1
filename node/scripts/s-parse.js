// Libraries
var feedparser = require('feedparser');
var jsdom = require('jsdom');
var qs = require('qs');
var url = require('url');

// Database
var db = require('riak-js').getClient();

// Blogs
var blogs = require('../config/blogs.json');

// Regular expressions
var parseTrackID = /\/([0-9]+)/;
var parseTrackInfo = /\/([a-z]+)\/([0-9]+)/;

// Add track to db
function addTrack (trackInfo)
{
    var track = { resource: trackInfo[1], id: trackInfo[2] };
    console.log('Adding track to database' + trackInfo[1] + " " + trackInfo[2]);
    db.save('tracks', track.id, track);
}

// Process feed for track
function processFeed (article)
{
    // Use jQuery to select element
    jsdom.env({
      html: article.description,
      scripts: [
        'http://code.jquery.com/jquery-1.5.min.js'
      ],
      done: function(errors, window)
      {
        // Grab source
        var $ = window.$;
        var src = $('iframe').attr('src');
        if(!src || src === undefined)
            return;

        // Parse uri
        var uri = qs.parse(decodeURIComponent(url.parse(src).query));
        if(!uri || uri === undefined)
            return;

        // Parse track id
        var trackID = parseTrackID.exec(uri.url);
        var trackInfo = parseTrackInfo.exec(uri.url);

        if (!trackID)
            return;

        // Add track
        addTrack(trackInfo);
      }
    });
}

// Read feed into database
function importFeed (blog)
{
    feedUrl = decodeURIComponent(blog.url);
    feedparser.parseUrl(feedUrl)
            .on('article', processFeed);
};

// Process feeds
function processFeeds (blogs)
{
  console.log ('Processing feeds');
  console.log (blogs.length);
  for (var i = 0; i < blogs.length; i++)
  {
    importFeed(blogs[i]);
  }
}

// Main code
processFeeds(blogs);
