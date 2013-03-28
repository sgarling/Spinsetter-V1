// Process feeds
exports.registerFeedListener = function (db, io)
{
    io.sockets.on('connection', function (socket)
    {
        db.getAll('tracks', function (err, tracks, meta)
        {
            if(err) throw err;
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
