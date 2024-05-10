<?php
include "config.php";
function addStudent($student, $groups, $genders) {
    $newRow = '<tr data-id="' . $student['id'] . '">';

    $newRow .= '<td><input type="checkbox" class="table-input"></td>';
    $newRow .= '<td data-value="' . $student['groupId'] . '">' . $groups[$student['groupId']] . '</td>';
    $newRow .= '<td data-firstName="' . $student['firstName'] . '" data-lastName="' . $student['lastName'] . '">' . $student['firstName'] . ' ' . $student['lastName'] . '</td>';
    $newRow .= '<td data-value="' . $student['genderId'] . '">' . $genders[$student['genderId']] . '</td>';
    $newRow .= '<td>' . transformDateFormat($student['birthdate']) . '</td>';
    $newRow .= '<td>' . ($student['status'] ? '<i class="bi bi-circle-fill" id="icon-active"></i>' : '<i class="bi bi-circle-fill" id="icon"></i>') . '</td>';
    $newRow .= '<td>';
    $newRow .= '<button class="btn btn-xs addOrEdit" data-id="' . $student['id'] . '">';
    $newRow .= '<i class="bi bi-pencil-square Icon"></i>';
    $newRow .= '</button>';
    $newRow .= '<button class="btn btn-xs deleteRow" data-id="' . $student['id'] . '">';
    $newRow .= '<i class="bi bi-x-square Icon"></i>';
    $newRow .= '</button>';
    $newRow .= '</td>';

    $newRow .= '</tr>';

    echo $newRow;
}


function transformDateFormat($dateString) {
    $dateComponents = explode("-", $dateString);

    return $dateComponents[2] . "." . $dateComponents[1] . "." . $dateComponents[0];
}

$sql = "SELECT * FROM students";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $data = $result->fetch_all(MYSQLI_ASSOC);
    foreach ($data as $student) {
        addStudent($student,$groups,$genders);
    }
}

