<?php
  session_start();
  require 'connect.php';

  if (isset($_POST['mail']) && !empty($_POST['mail']) && isset($_POST['password']) && !empty($_POST['password'])) {
      $mail = mysqli_real_escape_string($conn, $_POST['mail']);
      $pw = mysqli_real_escape_string($conn, $_POST['password']);
      login($mail, $pw, $conn);
  }
  function generateToken($length)
  {
      return bin2hex(random_bytes($length));
  }
  function login($mail, $password, $conn)
  {
      $query = "SELECT id, mail, password, active FROM users
                WHERE mail='$mail'
                ";
      $result = mysqli_query($conn, $query);
      $row = mysqli_fetch_assoc($result);
      $user =$row['mail'];
      if (mysqli_num_rows($result) == 0) {
          die("The user don't exist");
      }
      if ($row['active'] == 1) {
          $hash = $row['password'];
          if (password_verify($password, $hash)) {
              $url = 'https://www.bookmarko.me/board';
              $token = generateToken(20);
              $selector = generateToken(10);
              $hash = password_hash($token, PASSWORD_BCRYPT);
              $id = $row['id'];
              //date today
              $date = date('Y-m-d H:i:s');
              //put into string
              $current_date = strtotime($date);
              //add 30 days
              $new_date = date('Y-m-d H:i:s', $current_date += 2592000);
              $query = "SELECT * FROM auth_tokens
                        WHERE user_id='$id'";
              $result = mysqli_query($conn, $query);
              if (mysqli_num_rows($result) == 0) {
                  $query = "INSERT INTO auth_tokens (id,token,selector,user_id,expires) VALUES (NULL,'$hash','$selector','$id','$new_date');";
              } else {
                  $query = "UPDATE auth_tokens
                          SET selector='$selector'
                              ,token='$hash'
                          WHERE user_id = '$id';";
              }
              mysqli_query($conn, $query);
              setrawcookie('mail', "$user", 0, "/");
              setrawcookie('token', utf8_decode($token), time() + (86400 * 30), '/');
              setrawcookie('sel', utf8_decode($selector), time() + (86400 * 30), '/');
              unset($_POST);
              die(true);
          } else {
              die('The password you entered is incorrect.');
          }
      } else {
          die('The user is not activated');
      }
  }
