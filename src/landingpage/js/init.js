var refreshIntervalPages = setInterval(slideThroughPages, 7000);
var refreshIntervalBrowsers;
var sectionWidth = 550;
$(function() {
    var width = $(window).width();
    if (width <= 1200) {
        sectionWidth = 450;
    }

    $(".navigation li").each(function() {
        $(this).click(function() {
            clearTimeout(refreshIntervalPages);
            $(".navigation li").each(function() {
                $(this).removeClass("active");
            });
            var pos = $(this).addClass("active").attr("pos");
            $('.sections li.page.active').removeClass("active");
            $('.sections li#pos_' + pos).addClass("active");
            if (pos === 0) {
                $("section#landingpage .headline").addClass("active");
            } else if (pos == 1) {
                $("section#customize .headline").addClass("active");
                $("#customize .squere").each(function(i) {
                    $(this).delay(i * 500).fadeIn(300).addClass("active");
                });
            } else if (pos == 2) {
                $("section#access .headline").addClass("active");
                refreshIntervalBrowsers = setInterval(slideThroughBrowsers, 1400);
            } else if (pos == 3) {
                $("section#share .headline").addClass("active");
                startShareAnimations();
            }
            $(".sections li.page").css({
                'transform': 'translateX(-' + sectionWidth * pos + 'px)'
            });
        });
    });

    $("#signUpSwitch").click(function() {
        $(".bubble").each(function() {
            $(this).css("display", "none");
        });
        $(".register").fadeIn("slow");
        $(".switch li.active").removeClass("active");
        $("#signUpSwitch").parent().addClass("active");
    });
    $("#signInSwitch").click(function() {
        $(".bubble").each(function() {
            $(this).css("display", "none");
        });
        $(".register").fadeOut("slow");
        $(".switch li.active").removeClass("active");
        $("#signInSwitch").parent().addClass("active");
    });
    $("#signUp").click(function() {
        $(".bubble").each(function() {
            $(this).css("display", "none");
        });
        $(".register").fadeIn("slow");
        $(".switch li.active").removeClass("active");
        $("#signUpSwitch").parent().addClass("active");
    });
    $("#signIn").click(function() {
        $(".bubble").each(function() {
            $(this).css("display", "none");
        });
        $(".register").fadeOut("slow");
        $(".switch li.active").removeClass("active");
        $("#signInSwitch").parent().addClass("active");
    });
});

function slideThroughPages() {
    var next = ($('.sections li.page.active').next().length > 0) ? $('.sections li.page.active').next() : $(".sections li").first();
    $('.sections li.page.active').removeClass("active");
    next.addClass("active");
    var nextNavigation = ($(".navigation li.active").next().length > 0) ? $('.navigation li.active').next() : $(".navigation li").first();
    $(".navigation li.active").removeClass("active");
    nextNavigation.addClass("active");
    var pos = next.attr("pos");
    $('.sections li#pos_' + pos).addClass("active");
    if (pos == 0) {
        clearTimeout(refreshIntervalPages);
    } else if (pos == 1) {
        $("section#customize .headline").addClass("active");
        $("#customize .squere").each(function(i) {
            $(this).delay(i * 500).fadeIn(300).addClass("active");
        });
    } else if (pos == 2) {
        $("section#access .headline").addClass("active");
        refreshIntervalBrowsers = setInterval(slideThroughBrowsers, 1400);
    } else if (pos == 3) {
        $("section#share .headline").addClass("active");
        startShareAnimations();
    }
    $(".sections li.page").css({
        'transform': 'translateX(-' + 550 * pos + 'px)'
    });
}

function slideThroughBrowsers() {
    var next = ($('.browsers li.active').next().length > 0) ? $('.browsers li.active').next() : $(".browsers li").first();
    $('.browsers li.active').removeClass("active");
    next.addClass("active");
}

function removeCookieAlert() {
    $(".cookieAlert").css("opacity", "0");
    setTimeout(function() {
        $(".cookieAlert").css("display", "none");
    }, 500);
}


$(window).resize(function() {
    var width = $(window).width();
    sectionWidth = 550;
    if (width <= 1200) {
        sectionWidth = 450;
    }
});


function startShareAnimations() {
    setTimeout(function() {
        $(".export").addClass("active");
        $("li#exportMessage").css("opacity", "1");
    }, 1500);
    setTimeout(function() {
        $(".import").addClass("active");
        $("li#importMessage").css("opacity", "1");
    }, 3000);
    setTimeout(function() {
        $("li#finalMessage").css("opacity", "1");
        $(".category").css("opacity", "1");
        $("#share .squere").each(function(i) {
            $(this).delay(i * 500).fadeIn(300).addClass("active");
        });
    }, 4500);
}

function preloader() {
    if (document.getElementById) {
        document.getElementById("preload-01").style.background = "url('../img/logos/normal/facebook.png') no-repeat -9999px -9999px";
        document.getElementById("preload-02").style.background = "url('../img/logos/normal/github.png') no-repeat -9999px -9999px";
        document.getElementById("preload-03").style.background = "url('../img/logos/normal/twitter.png') no-repeat -9999px -9999px";
        document.getElementById("preload-04").style.background = "url('../img/logos/normal/imgur.png') no-repeat -9999px -9999px";
        document.getElementById("preload-05").style.background = "url('../img/logos/normal/youtube.png') no-repeat -9999px -9999px";
        document.getElementById("preload-06").style.background = "url('../img/logos/normal/9gag.png') no-repeat -9999px -9999px";
        document.getElementById("preload-07").style.background = "url('../img/logos/normal/netflix.png') no-repeat -9999px -9999px";
        document.getElementById("preload-08").style.background = "url('../img/logos/wide/pinterest.png') no-repeat -9999px -9999px";
        document.getElementById("preload-09").style.background = "url('../img/logos/wide/whatsapp.png') no-repeat -9999px -9999px";
        document.getElementById("preload-10").style.background = "url('../img/logos/wide/amazon.png') no-repeat -9999px -9999px";
    }
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        };
    }
}
addLoadEvent(preloader);
