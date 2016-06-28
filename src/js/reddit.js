// Grab the latest front page.
$.getJSON("https://www.reddit.com/.json", function (data) {
    var returnData = data;
    var childPostsArray = returnData.data.children;
    var postLength = childPostsArray.length;
    for (var i=0; i < postLength; i++) {
        $("#content").append('<li class="list-group-item">' + '<img class="img-circle media-object pull-left" src="' + returnData.data.children[i].data.preview.images[0].source.url + '" width="32" height="32">' + '<div class="media-body">' + '<strong>' + returnData.data.children[i].data.title + '</strong>' + '<p>Score: ' + returnData.data.children[i].data.score + '</p>' + '</div>' + '</li>');
    }
});