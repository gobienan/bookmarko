function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function checkform_register() {
    var mail = $(".register #mail").val();
    var password = $(".register #password").val();
    var repeat_password = $(".register #repeat_password").val();
    if (mail.length === 0) {
        $(".register .bubble#mailWarning").css("display", "block").html("Ups...Don't Forget Your Mail");
        return;
    } else {
        $(".register .bubble#mailWarning").css("display", "none");
    }
    if (!validateEmail(mail)) {
        $(".bubble#mailWarning").css("display", "block").html("Mhh...Odd Mail Address..?");
        return;
    } else {
        $(".bubble#mailWarning").css("display", "none");
    }
    if (password.length === 0) {
        $(".register .bubble#passwordWarning").css("display", "block").html("Well, You Need to enter a Password");
        return;
    } else {
        $(".register .bubble#passwordWarning").css("display", "none");
    }
    if (password.length < 6) {
        $(".register .bubble#passwordWarning").css("display", "block").html("A Password with at least 6 characters is recommended");
        return;
    } else {
        $(".register .bubble#passwordWarning").css("display", "none");
    }
    if (password.localeCompare(repeat_password) !== 0) {
        $(".register .bubble#passwordRepeatWarning").css("display", "block").html("Not the same passwords. Check again.");
        return;
    } else {
        $(".register .bubble#passwordRepeatWarning").css("display", "none");
    }
    return true;
}

$(function() {
    $("#submit_register").click(function() {
        register();
    });

    $("#form_register input").keyup(function(e) {
        if (e.keyCode == 13) {
            register();
        }
    });
});

function register() {
    if (checkform_register()) {
        var formData = {
            'password': $(".register #password").val(),
            'mail': $(".register #mail").val()
        };
        $.ajax({
            type: "POST",
            url: "../php/register.php",
            data: formData,
            success: function(data) {
                if (data == 1) {
                    $(".registerMessage").html(
                        "<div class='content' id='success'>" +
                        "<div class='headline'>" +
                        "<h1>Just one more step</h1>" +
                        "</div>" +
                        "<div class='subline'>" +
                        "<h3>You have registered and the activation mail is sent to your email account. Click the activation link to activate you account.</h3>" +
                        "</div>" +
                        "</div>"
                    ).fadeIn(500).delay(5000).fadeOut(500);
                    $(".register").fadeOut("slow");
                    $(".switch li.active").removeClass("active");
                    $("#signInSwitch").parent().addClass("active");
                } else {
                    $(".response").css("display", "block").html(data);
                }
            }
        });
    }
}
