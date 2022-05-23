<?php 
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json; charset=utf-8');
$conProyecto = new mysqli('localhost', 'root', '', 'findgas');
$error = $conProyecto->connect_errno;
session_start();
if ($error != null) {
    echo '<script>alert(Error $error conectando a la base de datos: $conProyecto->connect_error)</script>';
    die();
} else {
	echo '<script>alert("Conexion a la base de datos correcta")</script>';
}



?>
