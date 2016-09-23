var init = false;
var user;
var gridster;
var m;
var finishedLoadingBookmarks = false;
$(function() {
    if (!init) {
        init = true;
        user = decodeURIComponent(escape(getCookie("mail")));
        //check login status
        $.ajax({
            async: false,
            url: '../php/action.php',
            type: 'post',
            data: {
                'action': 'checkLoginStauts',
                'user': 'undefined',
                'from': "board"
            },
            success: function(data, status) {
                if (data !== "") {
                    window.location = data;
                }
                if (getCookie("mail") === "") {
                    setInterval(function() {
                        if (getCookie("mail") !== "") {
                            clearTimeout();
                        }
                    }, 50);
                }
                user = decodeURIComponent(escape(getCookie("mail")));
                getAllBookmarks();
            },
            error: function(xhr, desc, err) {
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
        }); // end ajax call
        initGridster();
        m = new Marka('#icon');
        m.set('triangle').size(10);
        m.rotate('down');
        m.color('#fff');
    }
    var preloader = setInterval(function() {
        if (finishedLoadingBookmarks) {
            delay = 450;
            $('#status').delay(delay).fadeOut();
            $('#preloader').delay(delay).fadeOut('slow');
            $('#board').delay(delay).css({
                'visibility': 'visible'
            });
            $('nav').delay(delay).css({
                'visibility': 'visible'
            });
            clearInterval(preloader);
        }
    }, 50);
});

function initGridster() {
    widgetOptions = checkWidth();
    wBD = widgetOptions[0];
    wM = widgetOptions[1];
    if (wBD !== 0) {
        gridster = $("#bookmarks").gridster({
            widget_margins: [10, 10],
            widget_base_dimensions: [wBD, wBD],
            min_cols: 5,
            max_cols: 9,
            resize: {
                max_size: [2, 2],
                resize: function(e, ui, $widget) {
                    $widget.css("transition", "none");
                    height = $widget.height();
                    width = $widget.width();
                    if (height > 200 && width > 200) {
                        $widget.removeClass("small").removeClass("wide").removeClass("tall").addClass("big");
                        $widget.attr("size", "3");
                    } else if (width > 200) {
                        $widget.removeClass("small").removeClass("big").removeClass("tall").addClass("wide");
                        $widget.attr("size", "2");
                    } else if (height > 200) {
                        $widget.removeClass("small").removeClass("big").removeClass("wide").addClass("tall");
                        $widget.attr("size", "3");
                    } else {
                        $widget.removeClass("big").removeClass("wide").removeClass("tall").addClass("small");
                        $widget.attr("size", "1");
                    }
                },
                stop: function(e, ui, $widget) {
                    $widget.css("transition", "all .2s ease");
                    updateSize();
                }
            },
            draggable: {
                start: function() {
                    $("#bookmarks li").each(function() {
                        //  $(this).css("transition", "none");
                        $(this).find('a').css("z-index", "-1");
                    });
                },
                stop: function() {
                    updatePosition();
                    $("#bookmarks li").each(function() {
                        $(this).find('a').css("z-index", "1");
                        $(this).removeClass("player-revert");
                    });
                }
            }
        }).data('gridster');
    }
}

function checkWidth() {
    var wBD;
    var wM;
    var windowsize = $(window).width();
    if (windowsize <= 900) {
        return [0, 10];
    }
    if (windowsize <= 1250) {
        wBD = 80;
        wM = 5;
    } else if (windowsize <= 1680) {
        wBD = 110;
        wM = 5;
    } else {
        wBD = 150;
        wM = 10;
    }
    if (gridster !== undefined) {}
    return [wBD, wM];
}

function checkLoginStauts(user) {
    $.ajax({
        async: false,
        url: '../php/action.php',
        type: 'post',
        data: {
            'action': 'checkLoginStauts',
            'user': user,
            'from': "board"
        },
        success: function(data, status) {
            if (data !== "") {
                window.location = data;
            }
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    }); // end ajax call
}
