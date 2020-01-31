<?php
  if($_POST["message"]) {
    mail("masae1263@gmail.com", "Form to email message", $_POST["message"],"From:masae1263@gmail.com");
  }
?>
