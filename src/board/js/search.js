$("#bookmarkSearchField").keyup(function(e) {
    var input = $(this);
    var list = "ul#bookmarks li";
    search(input, list);
});

$("#search_img").keyup(function(e) {
    var input = $(this);
    var list = "ul#thumbnails li";
    search(input, list);
});
function search(input, list) {
    if ($(input).val() === "") {
        $(list).each(function(i) {
            $(this).css("display", "flex");
        });
    } else {
        $(list).each(function(i) {
            if ($(this).attr("titel").toLowerCase().indexOf($(input).val().toLowerCase()) > -1) {
                $(this).css("display", "flex");
            } else {
                $(this).css("display", "none");
            }
        });
    }
}
function filter(value, list) {
    if (value == "all") {
        $(list).each(function(i) {
            $(this).css("display", "flex");
        });
    } else {
        $(list).each(function(i) {
            if ($(this).attr("category").toLowerCase().indexOf(value.toLowerCase()) > -1) {
                $(this).css("display", "flex");
            } else {
                $(this).css("display", "none");
            }
        });
    }
}
