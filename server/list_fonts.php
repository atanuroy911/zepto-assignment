<?php
include("cors.php");

// Directory where fonts are uploaded
$upload_dir = 'uploads/';

// Array to hold font data
$fonts = [];

if (is_dir($upload_dir)) {
    // Open the directory
    if ($dh = opendir($upload_dir)) {
        // Read files in the directory
        while (($file = readdir($dh)) !== false) {
            // Only process .ttf files
            if (pathinfo($file, PATHINFO_EXTENSION) === 'ttf') {
                $fonts[] = $file;
            }
        }
        closedir($dh);
    }
}

// Return the font files as a JSON response
header('Content-Type: application/json');
echo json_encode($fonts);
?>
