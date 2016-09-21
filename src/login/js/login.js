function checkform_login() {
    var password = $(".login #password").val();
    var mail = $("#form_login #mail").val();
    if (mail.length === 0) {
        $(".login .bubble#mailWarning").css("display", "block").html("Ups...Don't Forget Your Mail");
        return;
    } else {
        $(".login .bubble#mailWarning").css("display", "none");
    }
    if (!validateEmail(mail)) {
        $(".login .bubble#mailWarning").css("display", "block").html("Mhh...Odd Mail Address..?");
        return;
    } else {
        $(".login .bubble#mailWarning").css("display", "none");
    }
    if (password.length === 0) {
        $(".login .bubble#passwordWarning").css("display", "block").html("Well, You Need to enter a Password");
        return;
    } else {
        $(".login .bubble#passwordWarning").css("display", "none");
    }
    if (mail.length === 0 || password.length === 0) {
        return false;
    }
    return true;
}
$(function() {
    $("#form_login input").keyup(function(e) {
        if (e.keyCode == 13) {
            login();
        }
    });

    $("#submit_login").click(function() {
        login();
    });
});

function login() {
    if (checkform_login()) {
        var formData = {
            'password': $('input[name=password]').val(),
            'mail': $('input[name=mail]').val()
        };
        $.ajax({
            type: "POST",
            url: "../php/login.php",
            data: formData,
            success: function(data) {
                if (data == 1) {
                    window.location = '../board/';
                } else if (data.length > 0) {
                    $(".response").css("display", "block").html(data);
                }
            }
        });
    }
}
