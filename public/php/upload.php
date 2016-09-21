<?php
// A list of permitted file extensions
$allowed = array('png', 'jpg', 'jpeg');
if (isset($_FILES['upl']) && $_FILES['upl']['error'] == 0) {
    $user = $_COOKIE["mail"];
    $extension = pathinfo($_FILES['upl']['name'], PATHINFO_EXTENSION);
    if (!in_array(strtolower($extension), $allowed)) {
        echo '{"status":"error"}';
        exit;
    }
    $name = basename($_FILES['upl']['name'], '.'.$extension);
    $name .= '_';
    $name .= generateToken(10);
    $name .= '.';
    $name .= $extension;
    if (move_uploaded_file($_FILES['upl']['tmp_name'], '/home/bookejkp/public_html/uploads/'.$user.'/'.$name)) {
        $filename = '/home/bookejkp/public_html/uploads/'.$user.'/'.$name;
        $width = 500;
        $height = 500;

        list($width_orig, $height_orig) = getimagesize($filename);
        $ratio_orig = $width_orig / $height_orig;

        if ($width / $height <= $ratio_orig) {
            $width = $height * $ratio_orig;
        } else {
            $height = $width / $ratio_orig;
        }
        $image_p = imagecreatetruecolor($width, $height);
        if ($extension == 'png') {
            $image = imagecreatefrompng($filename);
            imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
            if(imagepng($image_p, '/home/bookejkp/public_html/uploads/'.$user.'/'.$name)){
              echo ('{"src":"../uploads/'.$user.'/'.$name.'"}');
            } else {
              echo (false);
            }
        } elseif ($extension == 'jpg') {
            $image = imagecreatefromjpeg($filename);
            imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
            if(imagejpeg($image_p, '/home/bookejkp/public_html/uploads/'.$user.'/'.$name)){
                echo ('{"src":"../uploads/'.$user.'/'.$name.'"}');
            } else {
              echo (false);
            }
        }
        imagedestroy($image);
        imagedestroy($image_p);
    }
}
function generateToken($length)
{
    return bin2hex(random_bytes($length));
}
