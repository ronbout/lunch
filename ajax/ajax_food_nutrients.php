<?php
// ajax_food_nutrients.php
// 2-23-12 rlb
//
// calculates food nutrients from id, sent through GET
// Ajax module so return info in string
// return string is comma-separated list of nutrients

require_once("../lunch_include.php");
if (check_get("foodId"))  exit;

// get food nutrients
$id = $_GET['foodId'];
$err_code = "";
$nut_list = calcNutrients($mysqli, $id, $err_code);

if ($nut_list === false)
{
	echo -1;
}
else
{
	// build string from nut array
	$nut_string = $nut_list['calories'].",".$nut_list['fat'].",".$nut_list['carbs'].",".$nut_list['fiber'].",".$nut_list['protein'];

	echo $nut_string;
}
?>