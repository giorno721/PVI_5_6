<?php
require 'config.php';
function addStudent($group, $firstName, $lastName, $gender, $birthday, $status,$conn) {
    $stmt = $conn->prepare("INSERT INTO students (groupId, firstName, lastName, genderId, birthdate, status) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issisi", $group, $firstName, $lastName, $gender, $birthday, $status);

    $stmt->execute();
}
function editStudent($id,$group, $firstName, $lastName, $gender, $birthday, $status,$conn) {
    $stmt = $conn->prepare("UPDATE students SET groupId=?, firstName=?, lastName=?, genderId=?, birthdate=?, status=? WHERE id=?");
    $stmt->bind_param("issisii", $group, $firstName, $lastName, $gender, $birthday, $status, $id);

    $stmt->execute();
}


header('Content-Type: application/json');

function validateName($name) {
    return mb_strlen($name, 'UTF-8') >= 2 && preg_match('/^[\p{L}\s]+$/u', $name);
}

function sendErrorResponse($response, $errorMessage, $fieldName, $errorCode)
{
    $error = ['message' => $errorMessage, 'type' => $fieldName];
    $response['error'] = $error;
    $response['error']['code'] = $errorCode;
    $response['status'] = false;
    echo json_encode($response);
    exit();
}

include "config.php";

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $response = array('status' => true);

    if (!isset($_POST['group']) || !array_key_exists($_POST['group'], $groups)) {
        sendErrorResponse($response, "Group does not exist!", 'groupSelect',101);
    }

    if (!isset($_POST['firstName']) || !validateName($_POST['firstName'])) {
        sendErrorResponse($response, "First name does not exist!", 'firstName',102);
    }

    if (!isset($_POST['lastName']) || !validateName($_POST['lastName'])) {
        sendErrorResponse($response, "Last name does not exist!", 'lastName',103);
    }

    if (!isset($_POST['gender']) || !array_key_exists($_POST['gender'], $genders)) {
        sendErrorResponse($response, "Gender does not exist!", 'genderSelect',104);
    }

    if (!isset($_POST['birthday']) || !strtotime($_POST['birthday'])) {
        sendErrorResponse($response, "Birthday does not exist!", 'birthdateInput',105);
    }

    if (!isset($_POST['id'])) {
        sendErrorResponse($response, "ID does not exist!", 'id',106);
    }

    $id = $_POST['id'];
    $group = $conn->real_escape_string($_POST['group']);
    $firstName = $conn->real_escape_string($_POST['firstName']);
    $lastName = $conn->real_escape_string($_POST['lastName']);
    $gender = $conn->real_escape_string($_POST['gender']);
    $birthday = $conn->real_escape_string($_POST['birthday']);
    $status = $conn->real_escape_string($_POST['status']);
    if (empty($id)) {
        addStudent($group,$firstName,$lastName,$gender,$birthday,$status, $conn);
        $_POST['id'] = mysqli_insert_id($conn);
    }else{
        editStudent($id,$group,$firstName,$lastName,$gender,$birthday,$status, $conn);
    }

    $response['student'] = $_POST;

    echo json_encode($response);
}