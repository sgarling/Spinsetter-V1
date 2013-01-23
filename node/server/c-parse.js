// Libraries
var feedparser = require('feedparser');
var jsdom = require('jsdom');
var qs = require('qs');
var url = require('url');

// Database
var db = require('riak-js').getClient();

// Regular expressions
var parseTrack = /\/([0-9]+)/;

// Add track to db
function addTrack (trackID)
{
    var track = {id: parseInt(trackID),
                 date: new Date()};
    db.save('tracks', trackID, track);
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
      done: function(errors, window) {

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
        var trackID = parseTrack.exec(uri.url);

        if (!trackID)
            return;

        // Add track
        addTrack(trackID[1]);
      }
    });
}

// Read feed into database
exports.importFeed = function (url)
{
    feedUrl = decodeURIComponent(url);
    feedparser.parseUrl(feedUrl)
            .on('article', processFeed);
}

