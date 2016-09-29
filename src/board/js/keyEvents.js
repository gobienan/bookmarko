$("body").keyup(function(e) {
    if (e.keyCode == 13) {
        if (activeWindow == 1) {
            addBookmark();
        }
    }
    if (e.keyCode == 27) {
        if (activeWindow == 1) {
            closeEditlinkWindow();
        }
        if (activeWindow == 2) {
            closeSearchImgWindow();
        }
        if (activeWindow == 3) {
            closeUploadWindow();
        }
    }
});
