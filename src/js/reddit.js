// modules
var redditSubModule = "all";
var http = require('http');
var shell = require('electron').shell;

// Autoexec
$(document).on('click', 'a[href^="http"]', function (event) {
  event.preventDefault();
  shell.openExternal(this.href);
});

// Functions
function getRedditPosts() {
  var url = "http://www.reddit.com/.json?limit=50";

  var request = http.get(url, function (response) {
    var json = '';
    response.on('data', function (chunk) {
      json += chunk;
    });

    response.on('end', function () {
      var redditResponse = JSON.parse(json);
      redditResponse.data.children.forEach(function (child) {
        if (child.data.domain !== 'self.node') {
          var randomNum = Math.floor(Math.random() * 150)
          $("#listofposts").append('<a type="button" data-aos="flip-down" href="' + child.data.url + '" id="' + randomNum + '" class="list-group-item">' + child.data.title.substring(0, 95) + '</a>');
        }
      });
    })
  });
  request.on('error', function (err) {
    console.log(err);
  });
}

// Listeners
$("#reloadposts").click(function() {
  $("#listofposts").empty();
  getRedditPosts();
});
 
// Function Executions
getRedditPosts();