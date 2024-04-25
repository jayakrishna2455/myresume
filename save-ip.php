<?php
$ip = $_GET['ip'];
$to = "your_email@example.com"; // Your email address
$subject = "New Visitor IP";
$message = "New visitor IP: " . $ip;
$headers = "From: your_website@example.com"; // Your website email address

// Send email
mail($to, $subject, $message, $headers);
?>
