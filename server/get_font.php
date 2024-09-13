<?php
// Your existing code for serving the font file
include("cors.php");
$file = $_GET['font']; // Get the font file name from the query parameter
$path = "uploads/" . $file;

if (file_exists($path)) {
    header("Content-Type: font/ttf");
    header("Content-Disposition: inline; filename=\"$file\"");
    readfile($path);
} else {
    http_response_code(404);
    echo "File not found.";
}
?>