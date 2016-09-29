$(function() {
    var ul = $('#upload ul');
    ul.html("<li class='hidden'> <div class='titel'>File Name</div> " +
        "<div class='size'>Size</div>" +
        "<div class='progress'>Progress</div>" +
        "</li>");
    // Initialize the jQuery File Upload plugin
    $('#upload').fileupload({
        // This element will accept file drag/drop uploading
        dropZone: $('#drop'),
        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function(e, data) {
            $("li.hidden").removeClass("hidden");
            var tpl = $('<li class="working"><div class="titel "></div><div class="size "></div><div class=" progressbar "></div></li>');
            // Append the file name and file size
            tpl.find('.titel').html(data.files[0].name);
            tpl.find('.size').html(formatFileSize(data.files[0].size));
            // Add the HTML to the UL element
            data.context = tpl.appendTo(ul);
            // Initialize the knob plugin
            //tpl.find('input').knob();
            // Listen for clicks on the cancel icon
            tpl.find('span').click(function() {
                if (tpl.hasClass('working')) {
                    jqXHR.abort();
                }
                tpl.fadeOut(function() {
                    tpl.remove();
                });
            });
            // Automatically upload the file once it is added to the queue
            data.submit();
        },

        progress: function(e, data) {
            // Calculate the completion percentage of the upload
            var progress = parseInt(data.loaded / data.total * 100, 10);
            data.context.find(".progressbar").css("width", 0.4 * progress + "%");
            // Update the hidden input field and trigger a change
            // so that the jQuery knob plugin knows to update the dial
            data.context.find('input').val(progress).change();
            if (progress == 100) {
                data.context.removeClass('working');
            }
        },
        done: function(e, data) {
            if (JSON.parse(data.result).status == "error") {
                data.context.find(".progressbar").addClass("error");
            } else {
                data.context.find(".progressbar").addClass("done");
                img_url = JSON.parse(data.result).src;
                $("#bookmarkInputValues #bookmark_thumbail img").attr("src", img_url);
                $("#bookmarkInputValues #bookmark_thumbail img").css("display", "block");
            }
        },
        fail: function(e, data) {
            // Something has gone wrong!
            alert("error");
            data.context.addClass('error');
        }
    });

    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function(e) {
        e.preventDefault();
        var dropZone = $('#drop');
        $(document).bind('dragover', function(e) {
            var found = false,
                node = e.target;
            do {
                if (node === dropZone[0]) {
                    found = true;
                    break;
                }
                node = node.parentNode;
            } while (node !== null);
            if (found) {
                dropZone.addClass('hover');
            } else {
                dropZone.removeClass('hover');
            }
        });
        dropZone.removeClass('hover');
    });
    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }
        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }
        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }
        return (bytes / 1000).toFixed(2) + ' KB';
    }
});
