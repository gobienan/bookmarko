var activeWindow = 0;

function setPosition(element) {
    dsoctop = $(document).scrollTop();
    element.css("top", dsoctop + "px");
}

function openAddlinkWindow() {
    activeWindow = "1";
    resetInputValues();
    $("#bookmarkInputValues").attr("action", "addBookmark");
    $(".window.editlink").removeClass("hidden");
    removeBodyScroll();
}

function openEditlinkWindow(editObject) {
    activeWindow = "1";
    fillInputFields($(editObject).parent().parent().attr("id"));
    $("#bookmarkInputValues").attr("action", "updateBookmark");
    $(".window.editlink").removeClass("hidden");
    removeBodyScroll();

}

function closeEditlinkWindow() {
    activeWindow = "0";
    addBodyScroll();
    $(".window.editlink").addClass("hidden");
}

function openAddTagWindow() {
    $(".window.add_tag").removeClass("hidden");
    $(".window.add_tag .content").addClass("active");
}

function closeAddTagWindow() {
    $(".window.add_tag").addClass("hidden");
    $(".window.add_tag .content").removeClass("active");
}

function openSearchImgWindow() {
    activeWindow = "2";
    getThumbnailsForSearchImg();
    $(".window.search_img").removeClass("hidden");
    $(".window.search_img .content").addClass("active");
    removeBodyScroll();
}

function closeSearchImgWindow() {
    activeWindow = "1";
    $(".window.search_img").addClass("hidden");
    $("#search_img").val("");
    $(".window.search_img .content").removeClass("active");
}

function openUploadWindow() {
    activeWindow = "3";
    $(".window.upload").removeClass("hidden");
    $(".window.upload .content").addClass("active");
    removeBodyScroll();
}

function closeUploadWindow() {
    activeWindow = "2";
    $(".window.upload").addClass("hidden");
    $(".window.upload .content").removeClass("active");
    $(".window.upload").find("ul").html("");
    getThumbnailsForSearchImg();
}

function removeBodyScroll() {
    $("body").addClass("noscroll");
}

function addBodyScroll() {
    $("body").removeClass("noscroll");
}

$(document).click(function(e) {
    var target = e.target;
    if ($(target).is('#hamburger')) {
        $("#board").addClass("push");
        $("nav").addClass("active");
    } else if (!$(target).is('nav') && !$(target).parents().is('nav')) {
        $("#board").removeClass("push");
        $("nav").removeClass("active");
    }
});

$("#logout").on('click', function() {
    eraseCookieFromAllPaths("sel");
    eraseCookieFromAllPaths("token");
    eraseCookieFromAllPaths("mail");
    window.location.href = 'https://www.bookmarko.me/';
});

$(".category").on('click', function() {
    $(".dropdown_menu").toggleClass("open");
    if ($(".dropdown_menu").hasClass("open")) {
        m.set('times').size(15);
        m.color('#fff');
    } else {
        m.set('triangle').size(10);
        m.color('#fff');
    }
});
$(".selectable_item").on('click', function() {
    $(".selectable_item").each(function() {
        $(this).removeClass("active");
    });
    $(this).toggleClass("active");
    $("#category").val($(this).html());
});
$(".add_tag_button").on('click', function() {
    openAddTagWindow();
});

$(".size li").each(function() {
    $(this).on('click', function() {
        if ($(this).html() == "wide") {
            $("#bookmarkInputValues #bookmark_thumbail .thumbnail").removeClass().addClass("thumbnail wide");
        } else if ($(this).html() == "small") {
            $("#bookmarkInputValues #bookmark_thumbail .thumbnail").removeClass().addClass("thumbnail small");
        } else if ($(this).html() == "big") {
            $("#bookmarkInputValues #bookmark_thumbail .thumbnail").removeClass().addClass("thumbnail big");
        }
        $(".size li").each(function() {
            $(this).removeClass("active");
        });
        $(this).toggleClass("active");
    });
});
$("#tags").keyup(function(e) {
    if (e.keyCode == 13) {
        addTags();
    }
});
$("body").keyup(function(e) {
    if (e.keyCode == 27) {
        closeAddTagWindow();
    }
});


function warning(message) {
    $("body").append("<div class='alert'><div class='alert_content warning'><div class = 'message'><h1>" + message + "</h1></div></div></div>");
    setTimeout(function() {
        $(".alert_content").addClass("show");
    }, 300);
    setTimeout(function() {
        $(".alert_content").removeClass("show");
    }, 4300);
    setTimeout(function() {
        $(".alert").remove();
    }, 4600);
}

function addTags() {
    values = $("#tags").val();
    values = values.split(",");
    $(".add_tag_window").toggleClass("hidden");
    add_tag_button = $("#tags_list .add_tag_button");
    $("#tags_list").remove("#tags_list .add_tag_button");
    $.each(values, function(index, value) {
        value = value.trim();
        if (value.length === 0) {
            warning("Your tag is empty!");
        } else {
            $("#tags_list").append("<li class ='tag'>" + value + "<div class='delete_icon'>  <svg style='width:24px;height:24px' viewBox='0 0 24 24'> <path fill='#fff' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'></svg></div></li>");
            $("li.tag").on('click', function() {
                $(this).remove();
            });
        }
    });
    $(".tags li").each(function(i) {
        $(this).addClass("active").delay(1000);
        $(this).css("opacity", "1").delay(1000);
    });
    $("#tags_list").append(add_tag_button);
    $("#tags").val("");
}
$('.underline').css("width", $('#titel').val().length * 25 + "px");
$('#titel').keyup(function() {
    val = $(this).val().length * 25;
    $('.underline').css("width", +val + "px");
});

$("li.category").on('click', function() {
    $("li.category").each(function() {
        $(this).removeClass("active");
    });
    $(this).addClass("active");
    value = $(this).find('a').html();
    var list = "ul#bookmarks li";
    filter(value,list);
});

$("li.tag").on('click', function() {
    $(this).remove();
});
