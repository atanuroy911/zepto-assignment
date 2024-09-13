<?php
include("cors.php");

// Set the directory where the uploaded files will be saved
$upload_dir = 'uploads/';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Check if the upload directory exists, if not, create it
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    // Check if a file was uploaded without errors
    if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
        $file = $_FILES['file'];
        $filename = basename($file['name']);
        $file_type = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        // Ensure the file is a .ttf font
        if ($file_type == 'ttf') {
            $destination = $upload_dir . $filename;

            // Move the uploaded file to the designated directory
            if (move_uploaded_file($file['tmp_name'], $destination)) {
                echo "File uploaded successfully!";
            } else {
                echo "Failed to move the uploaded file.";
            }
        } else {
            echo "Error: Only .ttf files are allowed.";
        }
    } else {
        echo "Error: No file uploaded or upload error.";
    }
} else {
    echo "Error: Invalid request.";
}
?>
