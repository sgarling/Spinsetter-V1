// Database
var db = require('riak-js').getClient();

db.getAll('tracks', function (err, tracks, meta)
{
    if(err) throw err;
    console.log(tracks);
    tracks.forEach(function (track, i, arr)
    {
        db.remove('tracks', track.id);
    });
});
