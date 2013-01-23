if (Meteor.is_client) {
    var url = "http://feeds.feedburner.com/ChemicalJump";
    Template.hello.greeting = function () {
        return "Fetch recent songs from music blog: " ;
    };

    Template.hello.events = {
        'click #fetchButton' : function () {
            console.log("Recent songs from stream!");
            $('#fetchButton').attr('disabled','true').val('loading...');
            userName = $('#userName').val();
            Meteor.call('getTrackList', url, function(err, respJson) {
                if(err) {
                    window.alert("Error: " + err.reason);
                    console.log("error occured on receiving data on server. ", err );
                } else {
                    console.log("respJson: ", respJson);
                    Session.set("recentTweets",respJson);
                }
                $('#fetchButton').removeAttr('disabled').val('Fetch');
            });
            Meteor.setTimeout(getTrackListCallback, 1000);
        }
    };

    Template.hello.recentTweets = function() {
        return Session.get("recentTweets") || [];
    };

    Template.hello.url= function() {
        return url;
    };
}

if (Meteor.is_server) {
    var json;
    var api;

    Meteor.methods({
        getTrackListCallback : function()
        {
            console.log("Callback");
            var result = Meteor.http.get(api, {timeout:30000});
            if(result.statusCode==200) {
                console.log("Callback");
                console.log(result.content);
            } else {
                console.log("Response issue: ", result.statusCode);
                var errorJson = JSON.parse(result.content);
                throw new Meteor.Error(result.statusCode, errorJson.error);
            }
        },

        getTrackList : function(url) {
            var encodedURL = encodeURIComponent(url);
            api = "http://localhost:8080/" + encodedURL + "";
            console.log("URL:", api)
            var result = Meteor.http.get(api, {timeout:30000});
            if(result.statusCode==200) {
                console.log(result.content);
                var respJson = JSON.parse(result.content);
                var json = respJson;
                return respJson;
            } else {
                console.log("Response issue: ", result.statusCode);
                var errorJson = JSON.parse(result.content);
                throw new Meteor.Error(result.statusCode, errorJson.error);
            }
        }
    });
}
