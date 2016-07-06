var pattern = Trianglify({cell_size: 20, seed: '6hqhq', x_colors: 'random'});

$(document).ready(function() {
    $('body').css("background", "url("+ pattern.png() +")");
});
