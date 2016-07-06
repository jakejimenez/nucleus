// modules
//var redditSubModule = "all";
var http = require('http');
var shell = require('electron').shell;
var Push = require('push.js');
var Configstore = require('configstore');
var pkg = require('../package.json');
// Init the configstore and give it an ID.
var conf = new Configstore(pkg.name + "config", {
  currentSub: ""
});

// Autoexec
$(document).on('click', 'a[href^="http"]', function (event) {
  event.preventDefault();
  shell.openExternal(this.href);
});


// Variables needed globally...
var i = 0;
var globalRequestLimit;
var globalSubreddit;
var url;

// Functions
function getRedditPosts(limit, subreddit) {

  // Notify user.
  Push.create('Nucleus', {
    body: 'Just a moment while we pull the most recent posts',
    icon: {
      x16: '../images/reddit_256.png',
      x32: '../images/reddit_256.png'
    },
    timeout: 1000
  });

  // Declare some variables for future use.
  var globalRequestLimit;
  var globalSubreddit = subreddit;

  if (limit === "" || limit === undefined) {
    var url = "http://www.reddit.com/" + subreddit + ".json?limit=100";
    var globalRequestLimit = 50;
  } else {
    var url = "http://www.reddit.com/" + subreddit + ".json?limit=" + limit + "";
    var globalRequestLimit = limit;
  }

  // Make the http request.
  var request = http.get(url, function (response) {
    var json = '';
    response.on('data', function (chunk) {
      json += chunk;
    });

    // "For" loop
    response.on('end', function () {
      Push.create('Nucleus', {
        body: 'Done!',
        icon: {
          x16: '../images/reddit_256.png',
          x32: '../images/reddit_256.png'
        },
        timeout: 1000
      });
      var redditResponse = JSON.parse(json);
      redditResponse.data.children.forEach(function (child) {
        if (child.data.domain !== 'self.node') {
          // This i++ is to add a "View more posts" when the x number are finished
          i++
          var randomNum = Math.floor(Math.random() * 150)
          $("#listofposts").append('<a type="button" href="' + child.data.url + '" id="' + randomNum + '" class="list-group-item animated bounceInLeft">' + '<img src="http://megaicons.net/static/img/icons_sizes/8/178/512/logos-reddit-icon.png" alt="thumbnail" class="pull-left img-rounded thumbnail-post" width="25" height="25">' + '<span class="badge">' + child.data.score + '</span>' + child.data.title + '</a>');
          if (i === globalRequestLimit) {
            $("#listofposts").append('<a type="button" id="pullmoreposts" class="list-group-item animated bounceInLeft disabled" href="#"><strong>Pull more posts...</strong></a>');
          } else {
            return false;
          }
        }
      });
    })
  });
  request.on('error', function (err) {
    Push.create('Nucleus', {
      body: err,
      icon: {
        x16: '../images/reddit_256.png',
        x32: '../images/reddit_256.png'
      },
      timeout: 3000
    });
  });
}

function slimGetRedditPosts(url) {

  $("#listofposts").empty();

  // Make the http request.
  var request = http.get(url, function (response) {
    var json = '';
    response.on('data', function (chunk) {
      json += chunk;
    });

    // "For" loop
    response.on('end', function () {
      Push.create('Nucleus', {
        body: 'Done!',
        icon: {
          x16: '../images/reddit_256.png',
          x32: '../images/reddit_256.png'
        },
        timeout: 1000
      });
      var redditResponse = JSON.parse(json);
      redditResponse.data.children.forEach(function (child) {
        if (child.data.domain !== 'self.node') {
          // This i++ is to add a "View more posts" when the x number are finished
          i++
          var randomNum = Math.floor(Math.random() * 150)
          $("#listofposts").append('<a type="button" href="' + child.data.url + '" id="' + randomNum + '" class="list-group-item animated bounceInLeft">' + '<img src="http://megaicons.net/static/img/icons_sizes/8/178/512/logos-reddit-icon.png" alt="thumbnail" class="pull-left img-rounded thumbnail-post" width="25" height="25">' + '<span class="badge">' + child.data.score + '</span>' + child.data.title.substring(0, 95) + '</a>');
          if (i === globalRequestLimit) {
            $("#listofposts").append('<a type="button" id="pullmoreposts" class="list-group-item animated bounceInLeft disabled" href="#"><strong>Pull more posts...</strong></a>');
          } else {
            return false;
          }
        }
      });
    })
  });
  request.on('error', function (err) {
    Push.create('Nucleus', {
      body: err,
      icon: {
        x16: '../images/reddit_256.png',
        x32: '../images/reddit_256.png'
      },
      timeout: 3000
    });
  });
}


// Listeners
// Get new subreddit posts
$("#init-search").click(function () {
  var requestedSubreddit = document.getElementById('sub-search').value;
  if (requestedSubreddit === "") {
    Push.create('Nucleus', {
      body: 'No subreddit entered, redirecting to frontpage.',
      icon: {
        x16: '../images/reddit_256.png',
        x32: '../images/reddit_256.png'
      },
      timeout: 3000
    });
    conf.set('currentSubUrl', 'http://www.reddit.com/.json?limit=100');
    slimGetRedditPosts(conf.get('currentSubUrl'));
  } else {
    $("#listofposts").empty();
    conf.set('currentSub', "/r/" + requestedSubreddit);
    getRedditPosts(globalRequestLimit, "/r/" + requestedSubreddit);
  }
});
// If the enter button is pressed, search for new sub.
$(document).keypress(function (e) {
  if (e.which == 13) {
    $("#init-search").click();
  }
});
// Get new posts
$("#reloadposts").click(function () {
  $("#listofposts").empty();
  getRedditPosts(50, conf.get('currentSub'));
});

// Function Executions
getRedditPosts(100, "");
