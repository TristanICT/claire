<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli("localhost", "root", "", "brightlands");

if ($conn->connect_error) {
    die("Connectie fout: " . $conn->connect_error);
}

echo "Database werkt!";
?>