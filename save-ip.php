<?php
$ip = $_GET['ip'];
$to = "jayakrishnayadav24@gmail.com"; // Your email address
$subject = "New Visitor IP";
$message = "New visitor IP: " . $ip;
$headers = "From: jayakrishnayadav24@gmail.com"; // Your website email address

// Send email
mail($to, $subject, $message, $headers);
?>
