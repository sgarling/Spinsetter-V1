// Libraries
var feedparser = require('feedparser');
var jsdom = require('jsdom');
var qs = require('qs');
var url = require('url');

// Database
var db = require('riak-js').getClient();

// Regular expressions
var parseTrack = /\/([0-9]+)/;
var parseTrack2 = /\/([a-z]+)\/([0-9]+)/;

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
        var trackInfo = parseTrack2.exec(uri.url);

        if (!trackID)
            return;

        // Add track
        //addTrack(trackID[1]);
        //console.log(newID[0]);
        addTrack(trackInfo);
      }
    });
}

// Read feed into database
exports.importFeed = function (url, io)
{
    // Listen for added track and notify iface
    db.registerListener({
        "riak.request.end": function(event) {
            if (event.method.toUpperCase() == 'PUT')
            {
                db.getAll('tracks', function (err, tracks, meta)
                    {
                        if(err) throw err;
                        io.sockets.on('connection', function (socket)
                        {
			    console.log('booty');
                            var trackList = new Array();
                            tracks.forEach(function (track, i, arr)
                                           {
                                                trackList.push(track);
                                           }
                                          );

			    console.log('Emmitting tracks to client');
                            socket.emit('tracks', trackList);
                        });
                    });
            }
        }
    });

    feedUrl = decodeURIComponent(url);
    feedparser.parseUrl(feedUrl)
            .on('article', processFeed);
};
