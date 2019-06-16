<?php
// lunch_connect.php
// 2-22-12 rlb
// datbase connection code for lunch tracker programs
require_once("lunch_include.php");

$dbName = ($_SERVER['HTTP_HOST'] == 'localhost') ? 'weighttracker' : 'db710160895';

// connect to database
if (!($mysqli = mysqlConnect($dbName,$errCode)))
{
	die("Could not connect to database.  Error Code: ".$errCode);
}
?>