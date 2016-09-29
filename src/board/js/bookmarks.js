function getAllBookmarks() {
    $.ajax({
        url: '../php/action.php',
        type: 'post',
        data: {
            'action': 'getAllBookmarks',
            'user': user
        },
        success: function(data, status) {
            addBookmarksToDom(data);
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    }); // end ajax call
}

function updateBookmark() {
    console.log("updateBookmark");
    var values = getBookmarkInputValues();
    $.ajax({
        url: '../php/action.php',
        type: 'post',
        data: {
            'action': 'updateBookmark',
            'user': user,
            'id': values.id,
            'titel': values.titel,
            'url': values.url,
            'cat': values.cat,
            'size': values.size,
            'img': values.img
        },
        success: function(data, status) {
            updateDomBookmark(values);
            updatePosition();
            closeEditlinkWindow();
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    });
}

function addBookmark() {
    console.log("addBookmark");
    var values = getBookmarkInputValues();
    $.ajax({
        url: '../php/action.php',
        type: 'post',
        data: {
            'action': 'addBookmark',
            'user': user,
            'titel': values.titel,
            'url': values.url,
            'cat': values.cat,
            'size': values.size,
            'img': values.img
        },
        success: function(data, status) {
            values.id = (data);
            widget = getWidgetSize(values.size);
            gridster.add_widget(addBookmarkToDom(values), widget.x, widget.y);
            updatePosition();
            closeEditlinkWindow();
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    }); // end ajax call
}

function deleteBookmark(removeButton) {
    var bmid = $(removeButton).parent().parent().attr("id");
    $("#bookmarks li#" + bmid).toggleClass("remove").css("display","none");
    var restoreTimer = setTimeout(function() {
        if (!restoreBookmarkboolean) {
            $.ajax({
                url: '../php/action.php',
                type: 'post',
                data: {
                    'action': 'removeBookmark',
                    'user': user,
                    'id': bmid
                },
                success: function(status) {
                    //removeBookmarkFromDom(bmid);
                    console.log("removedBookmark");
                    $("#bookmarks li#" + bmid).addClass("remove");
                    restoreBookmarkboolean = false;
                },
                error: function(xhr, desc, err) {
                    console.log(xhr);
                    console.log("Details: " + desc + "\nError:" + err);
                }
            });
        } else {
            var li = $("#bookmarks li#" + bmid);
            var size = $(li).attr("size");
            var position_x = $(li).attr("data-col");
            var position_y = $(li).attr("data-row");
            //gridster.add_widget( $(li).html(), size, size, position_x, position_y );
            $("#bookmarks li#" + bmid).toggleClass("remove").css("display","flex");
            console.log("restoredBookmark");
            restoreBookmarkboolean = false;
        } // end ajax call
    }, 5000);
}

/**
 * Update Position
 */
function updatePosition() {
    $("#bookmarks li").each(function() {
        var id = $(this).attr("id");
        var x_pos = $(this).attr("data-col");
        var y_pos = $(this).attr("data-row");
        $.ajax({
            url: '../php/action.php',
            type: 'post',
            data: {
                'action': 'updatePosition',
                'user': user,
                'id': id,
                'position_x': x_pos,
                'position_y': y_pos
            },
            success: function(data, status) {},
            error: function(xhr, desc, err) {
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
        });
    });
}

/**
 * Update Size
 */
function updateSize() {
    $("#bookmarks li").each(function() {
        var size;
        var id = $(this).attr("id");
        var width = $(this).attr("data-sizex");
        var height = $(this).attr("data-sizey");
        var x_pos = $(this).attr("data-col");
        var y_pos = $(this).attr("data-row");
        if (width == 1 && height == 1) {
            size = 1;
        } else if (width == 2 && height == 1) {
            size = 2;
        } else if (width == 2 && height == 2) {
            size = 3;
        }
        $.ajax({
            url: '../php/action.php',
            type: 'post',
            data: {
                'action': 'updateSize',
                'user': user,
                'id': id,
                'size': size,
                'position_x': x_pos,
                'position_y': y_pos
            },
            success: function(data, status) {},
            error: function(xhr, desc, err) {
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
        });
    });
}
/**
 * Entfernt Thumbnail
 */
function deleteThumbnail(removeButton) {
    // input -> delete -> li
    var src = $(removeButton).parent().parent().css("background-image");
    src = src.replace("url(\"", "").replace("\")", "");
    src = src.substring(src.lastIndexOf("/"), src.length);
    $.ajax({
        url: '../php/action.php',
        type: 'post',
        data: {
            'action': 'deleteThumbnail',
            'user': user,
            'src': src
        },
        success: function(e, data) {
            if (JSON.parse(e).status == "error") {
                warning("Sorry buddy..you are not allowed to delete this one");
            } else {
                $(removeButton).parent().parent().css("display", "none");
            }
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    }); // end ajax call
}
/**
 * Ändert das Thumbnail im Add/Edit Window nach dem auswählen aus dem search_img Window
 */
function getThumbnailsForSearchImg() {
    $("#thumbnails").html("");
    $.ajax({
        url: '../php/action.php',
        type: 'post',
        data: {
            'action': 'getThumbnailsForSelectImg',
            'user': user
        },
        success: function(data, status) {
            addBookmarkThumbnailsToDom(data);
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    }); // end ajax call
}

/**
 * bekomme die input Felder als Array
 */
function getBookmarkInputValues() {
    var data = Array();
    var message = "Please fill in all of the required fields: ";
    var errors = "";
    var comma = "";
    data.id = $("#bookmarkInputValues").attr("bmid");
    data.titel = $("#bookmarkInputValues #titel").val();
    data.url = parseUrl($("#bookmarkInputValues #url").val());
    data.cat = $("#bookmarkInputValues #category").val();
    data.size = $("#bookmarkInputValues #thumbnail_size li.active").attr("size");
    data.img = $("#bookmarkInputValues #bookmark_thumbail .thumbnail").css("background-image");
    data.img = data.img.replace("url(\"", "").replace("\")", "");
    for (var property in data) {
        if (data.hasOwnProperty(property)) {
            if ((data[property]) === "" && property != "id" && property != "img") {
                errors += comma;
                errors += property;
                comma = ", ";
            }
        }
    }
    if (errors.length > 0) {
        warning(message + errors);
        return;
    } else if (data.url === false || data.url === undefined) {
        message = "URL seems wrong";
        warning(message);
        return;
    } else {
        return data;
    }
}
/**
 * Setze beim Aufrufen von addLink die felder auf default
 */
function resetInputValues() {
    $("#bookmarkInputValues #titel").val("");
    $("#bookmarkInputValues #url").val("");
    $("#bookmarkInputValues #category").val("All");
    $("#bookmarkInputValues .items li.selectable_item").each(function() {
        $(this).removeClass("active");
        if ($(this).html() == "All") {
            $(this).addClass("active");
        }
    });
    $("#bookmarkInputValues #tags_list").html("<div class='add_tag_button'><input type='button' onclick='openAddTagWindow()'></div>");
    $("#bookmarkInputValues #thumbnail_size li.active").removeClass("active");
    $("#bookmarkInputValues #thumbnail_size li").each(function(i) {
        $(this).removeClass("active");
        if (i === 0) {
            $(this).addClass("active");
        }
    });
    $("#bookmarkInputValues #bookmark_thumbail .thumbnail").css("background-image", "");
    $("#bookmarkInputValues #bookmark_thumbail .thumbnail").removeClass().addClass("thumbnail small");
}

/**
 * Setze beim Aufrufen von editLink die Felder
 */
function fillInputFields(id) {
    var selectedBookmark = "#bookmarks li#" + id;
    var titel = $(selectedBookmark).attr("titel");
    var url = $(selectedBookmark + " a").attr("href");
    var cat = $(selectedBookmark).attr("category");
    var size = $(selectedBookmark).attr("size");
    var imgUrl = $(selectedBookmark + " .thumbnail").css("background-image");
    $("#bookmarkInputValues").attr("bmid", id);
    $("#bookmarkInputValues #titel").val(titel);
    $("#bookmarkInputValues #url").val(url);
    $("#bookmarkInputValues #category").val(cat);
    $("#bookmarkInputValues .items li.selectable_item").each(function() {
        $(this).removeClass("active");
        if ($(this).html() == cat) {
            $(this).addClass("active");
        }
    });
    if (imgUrl === undefined || imgUrl == " " || imgUrl === "" || imgUrl == "none") {
        $("#bookmarkInputValues #bookmark_thumbail .thumbnail").css("background-image", "");
    } else {
        $("#bookmarkInputValues #bookmark_thumbail .thumbnail").css("background-image", imgUrl);
    }
    $("#bookmarkInputValues #bookmark_thumbail .thumbnail").removeClass().addClass("thumbnail " + getCorrespondingSizeToInt(size));
    $('.underline').css("width", $('#titel').val().length * 25 + "px");
    $("#bookmarkInputValues #thumbnail_size li.active").toggleClass("active");
    $("#bookmarkInputValues #thumbnail_size li").each(function(i) {
        $(this).removeClass("active");
        if ($(this).attr("size") == size) {
            $(this).addClass("active");
        }
    });
}

/**
 * Aktuallisiere die Werte des DomLesezeichen
 */
function updateDomBookmark(values) {
    var selectedBookmark = "#bookmarks li#" + values.id;
    $(selectedBookmark).attr("titel", values.titel);
    $(selectedBookmark + " a").attr("href", values.url);
    $(selectedBookmark).attr("category", values.cat);
    $(selectedBookmark).attr("size", values.size);
    if (values.img != " " && values.img !== "" && values.img !== undefined && values.img !== "none") {
        $(selectedBookmark + " .details").removeClass("active");
        $(selectedBookmark + " .details p").html("");
        $(selectedBookmark + " .thumbnail").css("background-image", "url('" + values.img + "')");
    } else {
        $(selectedBookmark + " .details p").html(values.titel);
        $(selectedBookmark + " .details").addClass("active");
        $(selectedBookmark + " .thumbnail").css("background-image", "");
    }
    if (values.img === "") {

    } else {}
    $(selectedBookmark).removeClass("small").removeClass("wide").removeClass("big");
    $(selectedBookmark).addClass(getCorrespondingSizeToInt(values.size));
    widget = getWidgetSize(values.size);
    gridster.resize_widget($(selectedBookmark), widget.x, widget.y);
}

/**
 * Entfernt das lesezeichen aus der Dom
 */
function removeBookmarkFromDom(bmid) {
    $("#bookmarks li#" + bmid).remove();
}

/**
 * Parst die Daten aus dem Backend und ruft addBookmarkToDom für jedes lesezeichen auf
 */
function addBookmarksToDom(data) {
    var values = Array();
    jQuery.each($.parseJSON(data), function(i, val) {
        values.id = val.id;
        values.titel = val.titel;
        values.url = val.url;
        values.size = val.size;
        values.cat = val.category;
        if (val.img === undefined) {
            values.img = " ";
        } else {
            values.img = val.img;
        }
        widget_size = getWidgetSize(val.size);
        if (gridster !== undefined) {
            if (val.position_x !== undefined && val.position_y !== undefined) {
                values.pos_x = val.position_x;
                values.pos_y = val.position_y;
                gridster.add_widget(addBookmarkToDom(values), widget_size.x, widget_size.y, values.pos_x, values.pos_y);
            } else {
                gridster.add_widget(addBookmarkToDom(values), widget_size.x, widget_size.y);
            }
        } else {
            $("#bookmarks").append(addBookmarkToDom(values));
        }
    });
    finishedLoadingBookmarks = true;
    $("#bookmarks li").each(function() {
        $(this).on('hover', function() {
            $(this).animate({
                width: "200px"
            }, 300);
        });
    });

}

/**
 * Fügt das Lesezeichen zum Dom
 */
function addBookmarkToDom(values) {
    var sizeClass = getCorrespondingSizeToInt(values.size);
    var href = "<a href='" + values.url + "' target='_blank'></a>";
    var editButton = "<div class='edit'><input type='button' onclick='openEditlinkWindow(this)'></div>";
    var deleteButton = "<div class='delete'><input type='button' onclick='deleteBookmark(this)'></div>";
    var thumbnail;
    var details;
    if (values.img == " " || values.img === "" || values.img === undefined || values.img === "none") {
        details = "<div class='details active'><p>" + values.titel + "</p></div>";
        thumbnail = "<div class='thumbnail'><img></div>";
    } else {
        details = "<div class='details'><p></p></div>";
        imageurl = "background-image:url('" + values.img + "')";
        thumbnail = "<div class='thumbnail' style=" + imageurl + "><img src=''></div>";
    }
    var li = "<li  id='" + values.id + "'titel='" + values.titel + "'tag='' size='" + values.size + "' class='" + sizeClass + "' category='" + values.cat + "'>" + href + editButton + deleteButton + thumbnail + details + "</li>";
    return li;
}

/**
 * Add/Edit benutzen das selbe Panel, und hierrüber wird entschieden was von beiden ausgeführt wird
 */
function selectAddOrUpdateBookmark() {
    var action = $("#bookmarkInputValues").attr("action");
    if (action == "addBookmark") {
        addBookmark();
    } else if (action == "updateBookmark") {
        updateBookmark();
    }
}

/**
 * Matcht integer mit Strings
 * bsp: 2 == wide
 */
function getCorrespondingSizeToInt(int) {
    sizeClass = "";
    if (int == 1) {
        sizeClass = "small";
    } else if (int == 2) {
        sizeClass = "wide";
    } else if (int == 3) {
        sizeClass = "big";
    }
    return sizeClass;
}

function getWidgetSize(size) {
    widget = [];
    widget_size_x = 1;
    widget_size_y = 1;
    if (size == 3) {
        widget_size_x = 2;
        widget_size_y = 2;
    } else if (size == 2) {
        widget_size_x = 2;
        widget_size_y = 1;
    }
    widget.x = widget_size_x;
    widget.y = widget_size_y;
    return widget;
}
/**
 * Ändert das Thumbnail im Add/Edit Window nach dem auswählen aus dem search_img Window
 */
function changeBookmarkThumbnail(elem) {
    closeSearchImgWindow();
    var li = $(elem).parent().parent();
    var imgUrl = $(li).css("background-image");
    if (imgUrl === undefined || imgUrl == " " || imgUrl === "" || imgUrl == "none") {
        $("#bookmarkInputValues #bookmark_thumbail img").css("display", "none").attr("src", "");
    } else {
        $("#bookmarkInputValues #bookmark_thumbail .thumbnail").css("background-image", imgUrl);
    }
}

/**
 * Fügt das Lesezeichen zum Dom
 */
function addBookmarkThumbnailsToDom(values) {
    jQuery.each($.parseJSON(values), function(i, val) {
        //var sizeClass = getCorrespondingSizeToInt(values['size']);
        var addClass;
        val.forEach(function(entry) {
            if (i === 0) {
                addClass = "small";
            }
            if (i == 1) {
                addClass = "wide";
            }
            var selectButton = "<input type='button' onclick='changeBookmarkThumbnail(this)'>";
            var deleteButton = "<div class='delete'><input type='button' onclick='deleteThumbnail(this)'></div>";
            var accept = "<div class='accept'>" + selectButton + "<div class='icon'><i aria-hidden='true' class='fa fa-check'></i></div>";
            var thumbnail = "<img src=''>";
            imageurl = "background-image:url('" + entry + "')";
            var titel = entry.split('/');
            $("#thumbnails").append("<li titel='" + titel + "' class='" + addClass + "' style=" + imageurl + ">" + thumbnail + deleteButton + accept + "</li>");
        });
    });
}

function removeBookmarkThumbnail(elem) {
    //delete_logo->span->thumbnail
    $(elem).parent().parent().parent().css("background-image", "");
}

function parseUrl(url) {
    if (url !== "") {
        if (url.indexOf("http") == -1) {
            url = "http://" + url;
        }
        return (url);
    } else {
        return false;
    }
}

function isThere(theUrl) {
    jQuery.ajax({
        url: theUrl,
        success: function(result) {
            if (result.isOk === false) {
                alert(url);
            } else {
                alert(false);
            }
        },
        async: false
    });
}

function exportBookmarks(cat) {
    category = cat;
    $.ajax({
        url: '../php/action.php',
        type: 'post',
        data: {
            'action': 'encryptForExport',
            'user': user,
            'category': category
        },
        success: function(data, status) {
            var values = JSON.parse(data);
            copyToClipboard(values[0] + "&" + values[1]);
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    }); // end ajax call

}
$("#importBookmarksLink").keyup(function(e) {
    var val = this.value;
    if (e.keyCode == 13) {
        importBookmarks(val);
    }
});

function importBookmarks(val) {
    if (val !== "") {
        $.ajax({
            url: '../php/action.php',
            type: 'post',
            data: {
                'user': user,
                'action': 'importBookmarks',
                'string': val
            },
            success: function(data, status) {
                addBookmarksToDom(data);
                $("#importBookmarksLink").val("");
                updatePosition();
            },
            error: function(xhr, desc, err) {
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
        }); // end ajax call
    }
}

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function restoreBookmark() {
    restoreBookmarkboolean = true;
    clearTimeout(restoreTimer);
}
