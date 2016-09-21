<?php
  session_start();
  require 'connect.php';
  if (isset($_POST['user']) && !empty($_POST['user']) && isset($_POST['action']) && !empty($_POST['action'])) {

      $user = mysqli_real_escape_string($conn, $_POST['user']);
      $action = htmlspecialchars(trim($_POST['action']));
      $query = '';
      $result_json = array();
      $user_id = mysqli_fetch_assoc(mysqli_query($conn, "SELECT id FROM users WHERE mail = '$user'"))['id'];
      if ($action == 'checkLoginStauts') {
        $selector = 'sel';
        $token = 'token';
        $from = htmlspecialchars(trim($_POST['from']));
        if (!isset($_COOKIE[$selector]) || !isset($_COOKIE[$token]) || empty($_COOKIE[$selector]) || empty($_COOKIE[$token])) {
          if($from=='landingpage'){
            die();
          }
          die('https://www.bookmarko.me/');
        }

        $sel    = $_COOKIE[$selector];
        $query  = "SELECT user_id, token FROM auth_tokens WHERE selector = '$sel'";
        $result = mysqli_query($conn, $query);

        if (mysqli_num_rows($result) == 0) {
          if($from=='landingpage'){
            die();
          }
          die('https://www.bookmarko.me/');
        }

        $row      = mysqli_fetch_assoc($result);
        $token_db = $row['token'];
        if (!password_verify($_COOKIE[$token], $token_db)) {
          if($from=='landingpage'){
            die();
          }
          die('https://www.bookmarko.me/');
        }
        $id     = $row['user_id'];
        $query  = "SELECT mail FROM users WHERE id = '$id'";
        $result = mysqli_query($conn, $query);
        $row    = mysqli_fetch_assoc($result);
        $user   = $row['mail'];
        setrawcookie('mail', "$user", 0, "/");
        if($from=='landingpage'){
          $url = 'https://www.bookmarko.me/board';
          die($url);
        }
        die();
      }
      // wenn action = bookmarks hinzufügen
      if ($action == 'removeBookmark') {
          if (isset($_POST['id']) && !empty($_POST['id'])) {
              $id = mysqli_real_escape_string($conn, $_POST['id']);
          // Entfernt Lesezeichen in der User-Lesezeichen Tabelle
          $query = "DELETE FROM user_bookmarks
                    WHERE bookmark_id = '$id'";
              mysqli_query($conn, $query);
          // Entfernt User-Lesezeichen-verbindung in der bookmarks Tabelle
          $query = "DELETE FROM bookmarks
                    WHERE id = '$id'";
              mysqli_query($conn, $query);
          }
      }
      // wenn action = bookmarks hinzufügen
      if ($action == 'updateBookmark') {
          if (isset($_POST['id']) && !empty($_POST['id'])
            && isset($_POST['titel']) && !empty($_POST['titel'])
            && isset($_POST['url'])   && !empty($_POST['url'])
            && isset($_POST['cat'])   && !empty($_POST['cat'])
            && isset($_POST['size'])  && !empty($_POST['size'])
            && isset($_POST['img'])) {
              $id = mysqli_real_escape_string($conn, $_POST['id']);
              $titel = mysqli_real_escape_string($conn, $_POST['titel']);
              $url = mysqli_real_escape_string($conn, $_POST['url']);
              $img = mysqli_real_escape_string($conn, $_POST['img']);
              $size = mysqli_real_escape_string($conn, $_POST['size']);
              $cat = mysqli_real_escape_string($conn, $_POST['cat']);
          // Trägt Lesezeichen in die bookmarks Tabelle
          $query = "UPDATE bookmarks
                    SET titel='$titel'
                        ,url='$url'
                        ,img='$img'
                        ,category='$cat'
                        ,size='$size'
                    WHERE id = '$id';";
              $result = mysqli_query($conn, $query);
              if (!$result) {
                  $message = "\n";
                  $message .= 'Ungültige Abfrage: '.mysql_error()."\n";
                  $message .= 'Gesamte Abfrage: '.$query;
                  die($message);
              }
              die("updated");
          }
      }
    // wenn action = bookmarks hinzufügen
    if ($action == 'addBookmark') {
        if (isset($_POST['titel']) && !empty($_POST['titel'])
          && isset($_POST['url'])   && !empty($_POST['url'])
          && isset($_POST['cat'])   && !empty($_POST['cat'])
          && isset($_POST['img'])   && !empty($_POST['img'])
          && isset($_POST['size'])  && !empty($_POST['size'])) {
            $titel = mysqli_real_escape_string($conn, $_POST['titel']);
            $url = mysqli_real_escape_string($conn, $_POST['url']);
            $img = mysqli_real_escape_string($conn, $_POST['img']);
            $size = mysqli_real_escape_string($conn, $_POST['size']);
            $cat = mysqli_real_escape_string($conn, $_POST['cat']);
        // Trägt Lesezeichen in die bookmarks Tabelle
        $query = "INSERT INTO bookmarks (id,titel,url,img,category, position_x,position_y,size) VALUES (NULL,'$titel','$url','$img','$cat','1','1','$size');";
            mysqli_query($conn, $query);
        //bekommt die id des zuletzt hinzugefügten Lesezeichen
        $bm_id = mysqli_insert_id($conn);
        // Trägt User-Lesezeichen-verbindung in die user_bookmark Tabelle
        $query = "INSERT INTO user_bookmarks (id,user_id,bookmark_id) VALUES (NULL ,'$user_id','$bm_id')";
            mysqli_query($conn, $query);
            echo $bm_id;
        }
    }
    // wenn action = bookmarks abfragen
    if ($action == 'getAllBookmarks') {
        // Abfrage
      $query = "SELECT bookmarks.id,titel,url,img,category, position_x,position_y,size FROM bookmarks
                INNER JOIN user_bookmarks ON user_bookmarks.bookmark_id = bookmarks.id
                INNER JOIN users ON user_bookmarks.user_id = users.id
                WHERE users.mail='$user'
                ORDER BY position_y
              ";
      // Führe Abfrage aus
      $result = mysqli_query($conn, $query);
      while ($row = mysqli_fetch_assoc($result)) {
          $result_json[] = $row;
      }
        //JSON mit allen Lesezeichen
        echo json_encode($result_json);
    }
    // wenn action = bookmark position aktualisieren
    if ($action == 'updatePosition') {
        if (isset($_POST['id']) && !empty($_POST['id'])
          && isset($_POST['position_x']) && !empty($_POST['position_x'])
          && isset($_POST['position_y'])   && !empty($_POST['position_y'])) {
            $id = mysqli_real_escape_string($conn, $_POST['id']);
            $position_x = mysqli_real_escape_string($conn, $_POST['position_x']);
            $position_y = mysqli_real_escape_string($conn, $_POST['position_y']);
        // Trägt Lesezeichen in die bookmarks Tabelle
        $query = "UPDATE bookmarks
                  SET position_x='$position_x'
                      ,position_y='$position_y'
                  WHERE id = '$id';";
            $result = mysqli_query($conn, $query);
            if (!$result) {
                $message = "\n";
                $message .= 'Ungültige Abfrage: '.mysql_error()."\n";
                $message .= 'Gesamte Abfrage: '.$query;
                die($message);
            }
        }
    }
    // wenn action = bookmark size aktualisieren
    if ($action == 'updateSize') {
        if (isset($_POST['id']) && !empty($_POST['id'])
        && isset($_POST['size']) && !empty($_POST['size'])
        && isset($_POST['position_x']) && !empty($_POST['position_x'])
        && isset($_POST['position_y']) && !empty($_POST['position_y'])) {
            $id = mysqli_real_escape_string($conn, $_POST['id']);
            $size = mysqli_real_escape_string($conn, $_POST['size']);
            $position_x = mysqli_real_escape_string($conn, $_POST['position_x']);
            $position_y = mysqli_real_escape_string($conn, $_POST['position_y']);
        // Trägt Lesezeichen in die bookmarks Tabelle
        $query = "UPDATE bookmarks
                  SET size='$size',
                      position_x='$position_x',
                      position_y='$position_y'
                  WHERE id = '$id';";
            $result = mysqli_query($conn, $query);
            if (!$result) {
                $message = "\n";
                $message .= 'Ungültige Abfrage: '.mysql_error()."\n";
                $message .= 'Gesamte Abfrage: '.$query;
                die($message);
            }
        }
    }
      if ($action == 'getThumbnailsForSelectImg') {
          $filesNormal = glob('../img/logos/normal/*.*');
          $filesWide = glob('../img/logos/wide/*.*');
          $filesUploads = glob('../uploads/'.$user.'/*.*');
          $files = array();
          $files[] = $filesNormal;
          $files[] = $filesWide;
          $files[] = $filesUploads;
          echo json_encode($files);
      }
  }
