// Libraries
var feedparser = require('feedparser')
var jsdom = require('jsdom');
var url = require('url');
var qs = require('qs');

// Regular expressions
var parseTrack = /\/([0-9]+)/;

// Globals
var urls = 0;
var tracks = new Array();

// Add track to array

function addTrack (track)
{
    tracks.push(track);
}

// Output array
function outputArray ()
{
    console.log(JSON.stringify({tracks: tracks}));
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
        urls--;

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
        var track_id = parseTrack.exec(uri.url);

        if (!track_id)
            return;

        // Add track
        addTrack(track_id[1]);

        if (urls === 0)
            outputArray();
      }
    });

    urls++;
}

// Fetch feed
feedUrl = process.argv[2];
feedparser.parseUrl(feedUrl)
  .on('article', processFeed);
