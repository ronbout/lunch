<?php

// useful routines that should always he available to any php program

// function test_include() {
// 	echo 'It works!!';
// }

function mysqlConnect($dbName,&$errCode) {
	// 4Ove6I2a	

	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

	$mysqli = new mysqli('localhost', 'wt', '4Ove6I2a', $dbName);

	return $mysqli;

}

