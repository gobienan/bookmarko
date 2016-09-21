<?php
  session_start();
  require 'connect.php';
  if (isset($_POST['mail']) && !empty($_POST['mail']) && isset($_POST['password']) && !empty($_POST['password'])) {
      $mail = mysqli_real_escape_string($conn, $_POST['mail']);
      $pw = mysqli_real_escape_string($conn, $_POST['password']);
      register($mail, $pw, $conn);
      sendMail($mail, $conn);
  }

  function register($mail, $password, $conn)
  {
      $hash = password_hash($password, PASSWORD_DEFAULT);
      //$hash = password_hash($password, PASSWORD_BCRYPT);
      $query = mysqli_query($conn, "SELECT * FROM users WHERE mail='".$mail."'");

      if (mysqli_num_rows($query) > 0) {
          die('Email already exists');
      } else {
          $token = generateToken(20);
          $query = "INSERT INTO users (id,mail,password, active,pro,subscription_date,token) VALUES (NULL,'$mail','$hash','0','1',NOW(),'$token');";
          $result = mysqli_query($conn, $query);
      }
  }

  function sendMail($mail, $conn)
  {
      $result = mysqli_query($conn, "SELECT token FROM users WHERE mail='".$mail."'");
      $row = mysqli_fetch_assoc($result);
      $actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]?token=".$row['token'];
      $toEmail = $mail;
      $subject = 'Welcome! Please activate your bookmarko account';
      $content = "<body style='width: 100%; height: 100%; font-family: \"Raleway\"; box-sizing: border-box; background: linear-gradient(to bottom, #3a4a5e 0%, #273240 100%); margin: 0; padding: 10px;'>
      <style type='text/css'>
      @font-face {
      font-family: 'Raleway'; font-style: normal; font-weight: 200; src: local('Raleway ExtraLight'), local('Raleway-ExtraLight'), url('https://fonts.gstatic.com/s/raleway/v11/8KhZd3VQBtXTAznvKjw-ky3USBnSvpkopQaUR-2r7iU.ttf') format('truetype');
      }
      @font-face {
      font-family: 'Raleway'; font-style: normal; font-weight: 400; src: local('Raleway'), local('Raleway-Regular'), url('https://fonts.gstatic.com/s/raleway/v11/bIcY3_3JNqUVRAQQRNVteQ.ttf') format('truetype');
      }
      @font-face {
      font-family: 'Raleway'; font-style: normal; font-weight: 700; src: local('Raleway Bold'), local('Raleway-Bold'), url('https://fonts.gstatic.com/s/raleway/v11/JbtMzqLaYbbbCL9X6EvaIy3USBnSvpkopQaUR-2r7iU.ttf') format('truetype');
      }
      </style>
      <div class='content' style='display: flex; flex-direction: column; justify-content: center; align-items: center; transition: all .3s ease; position: absolute; border-radius: 10px; text-align: center; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 0 0 30px;' align='center'>
      <div class='headline' style='width: 80%; text-align: center;' align='center'><h1 id='activation' style='margin-top: 40px; color: #363636; font-size: 25px; line-height: normal;'>Thanks for joining Bookmarko :)</h1></div>
      <div class='subline' style='width: 80%; padding: 0 0 20px;'><h3 style='color: #363636; font-weight: 300;'>You will need to activate your account before you can login. Please follow the link below to activate your account. </h3></div>
      <a href='".$actual_link."' style='text-decoration: none; display: block;'>
      <div class='button' style='width: 140px; height: 40px; display: flex; justify-content: center; align-items: center; font-weight: bold; transition: all .3s ease-in-out; position: relative; color: white; border-radius: 5px; background: #f65c71; margin: 0 auto; padding: 5px;'>activate now<input type='submit' id='submit_login' style='position: absolute; width: 100%; height: 100%; top: 0; left: 0; opacity: 0; cursor: pointer; z-index: 1;'>
      </div>
      </a>
      </div>
      <footer style='z-index: 999; position: absolute; bottom: 0; left: 0; width: 100%; height: 40px; clear: both; background: #f2f2f2;'><div class='footerContent' style='width: 100%; height: 40px; position: absolute; bottom: 0;'>
      <div class='copyright' style='float: left;'><p style='font-size: 12px; color: #363636; font-weight: 500; text-align: left; padding: 0 20px;' align='left'>copyright 2016 bookmarko.me | All Rights Reserved.</p></div>
      <div class='madeBy' style='float: right;'><p style='font-size: 12px; color: #363636; font-weight: 500; text-align: right; padding: 0 20px;' align='right'>Made by  <b>Gobie Nanthakumar</b></p></div>
      </div></footer></body>";
      $headers = 'MIME-Version: 1.0'."\r\n";
      $headers .= 'Content-type: text/html; charset=iso-8859-1'."\r\n";
      $headers .= "From: gobie@bookmarko.me\r\n";
      mail($toEmail, $subject, $content, $headers);
      $subject = $mail.' hat sich auf der seite registriert';
      $content = '';
      mail('gobie@bookmarko.me', $subject, $content, $headers);
      echo true;
      unset($_POST);
  }
  function generateToken($length)
  {
      return bin2hex(random_bytes($length));
  }
  if (!empty($_GET['token'])) {
      $token = mysqli_real_escape_string($conn, $_GET['token']);
      $query = "SELECT * FROM users
                WHERE token='".$token."'";
      $result = mysqli_query($conn, $query);
      if (mysqli_num_rows($result) == 0) {
          $message = 'Something went wrong with your account activation.';
      } else {
          $row = mysqli_fetch_assoc($result);
          $user =  $row["mail"];
          $query = "UPDATE users
                  SET active =1
                  WHERE token='".$token."'";
          $result = mysqli_query($conn, $query);
          if (!file_exists('../uploads/'.$user)) {
              mkdir('../uploads/'.$user, 0777, true);
          }
          $message = 'Your account is activated. ';
          $message .= "<a href='http://www.bookmarko.me/'><div class='button' style='height: 40px; display: flex; justify-content: center; align-items: center; font-weight: bold; transition: all .3s ease-in-out; position: relative; color: white; border-radius: 5px; background: #f65c71; margin: 20px auto 0; padding: 5px;'>Login<input type='submit' id='submit_login' style='position: absolute; width: 100%; height: 100%; top: 0; left: 0; opacity: 0; cursor: pointer; z-index: 1;'>
          </div></a>";
      }
      $content = "
          <div class='content'>
            <div class='headline'>
              <h1>Its done!</h1>
            </div>
            <div class='subline'>
              <h3>$message</h3>
            </div>
          </div>
        ";
      $html = "<!DOCTYPE html>
        <html>
          <head>
            <title>Bookmarko - Register</title>
            <meta charset='UTF-8'>
            <meta content='width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no' name='viewport'>
            <link rel='stylesheet' href='../css/style_register.css'>
            <link href='https://fonts.googleapis.com/css?family=Raleway:200,400,700' rel='stylesheet' type='text/css'>
            <link href='https://fonts.googleapis.com/css?family=Lato' rel='stylesheet'>
          </head>
          <body>
            <div class='wrapper'>$content</div>
            <footer style='z-index: 999; position: absolute; bottom: 0; left: 0; width: 100%; height: 40px; clear: both; background: #f2f2f2;'><div class='footerContent' style='width: 100%; height: 40px; position: absolute; bottom: 0;'>
            <div class='copyright' style='float: left;'><p style='font-size: 12px; color: #363636; font-weight: 500; text-align: left; padding: 0 20px;' align='left'>© 2016 bookmarko.me | All Rights Reserved.</p></div>
            <div class='madeBy' style='float: right;'><p style='font-size: 12px; color: #363636; font-weight: 500; text-align: right; padding: 0 20px;' align='right'>Made by  <b>Gobie Nanthakumar</b></p></div>
            </div></footer>
          </body>
          <script src='../js/register.js'></script>
        </html>";
      echo $html;
  }
