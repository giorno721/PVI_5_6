<?php
$groups = [
    1 => "PZ-21",
    2 => "PZ-25"
];

$genders = [
    1 => "M",
    2 => "F"
];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
