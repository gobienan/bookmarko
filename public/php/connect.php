<?php
  $servername = 'localhost';
  $username = 'bookejkp_gob';
  $password = 'r*?IUv)de1H5';
  $dbname = 'bookejkp_DB';

  // Create connection
  $conn = mysqli_connect($servername, $username, $password, $dbname);

  // Check connection
  if (!$conn) {
      die('Connect Error (' . mysqli_connect_errno() . ') '
              . mysqli_connect_error());
  }
