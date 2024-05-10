<?php
header('Content-Type: application/json');
function deleteStudent($id, $conn) {
    $stmt = $conn->prepare("DELETE FROM students WHERE id=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        return true;
    } else {
        return false;
    }
}
require 'config.php';



if($_SERVER['REQUEST_METHOD'] == "POST"){
    $response = array('status' =>true);
    if(isset($_POST['id'])){
        $id = $_POST['id'];
        if (!empty($id)) {
            $result = deleteStudent($id, $conn);
            if($result){
                $response = array('success' => true);
            }else{
                formError($response,"Error while delete","database",108);
            }
        } else {
            formError($response,"Empty id","id",109);
        }

        echo json_encode($response);
    }else{
        formError($response,"Empty id",'id',110);
    }

}

