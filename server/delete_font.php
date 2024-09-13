<?php
include("cors.php");

// Directory where fonts are uploaded
$upload_dir = 'uploads/';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the font file name from the request
    $font_file = $_POST['file'];

    // Build the full path to the font file
    $file_path = $upload_dir . basename($font_file);

    // Check if the file exists and delete it
    if (file_exists($file_path)) {
        if (unlink($file_path)) {
            echo json_encode(["status" => "success", "message" => "File deleted"]);
        } else {
            echo json_encode(["status" => "error", "message" => "File could not be deleted"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "File not found"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>
