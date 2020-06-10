<?php
session_start();

echo 'Login checking';
$id = $_POST["inputID"];

// Test code
$_SESSION['id'] = $id;
$_SESSION['is_logged'] = true;
header("Location: HTMLPage.html");
exit();

//// MySql connect
//$connect = mysqli_connect('localhost:3307', 'root', '0000');
//if(!$connect) {
//    die('Could not connect to mySql'.mysqli_connect_error());
//}
//echo 'Connected successfully';
//echo '<br/>';
//
//// SQL Query
//mysqli_select_db('login');
//
//// 쿼리문 생성 후 실행
//$query = "select * from member where id='$id'";
//$result = mysqli_query($query, $connect);
//
//// 쿼리문 결과
//$data = mysqli_fetch_array($result, MYSQLI_NUM);
//
//// 쿼리 결과 체크
//if($data[0] == $id) {
//    echo 'Login Success';
//    $_SESSION['id'] = $id;
//    $_SESSION['is_logged'] = true;
//
//    header("Location:Page_Reservation.php");
//} else {
//     echo 'Login Failed';
//    $_SESSION['is_logged'] = false;
//}
//
//// SQL 연결 해제
//mysqli_close($connect);
?>