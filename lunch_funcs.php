<?php
// lunch_funcs.php
// 2-22-12 rlb
// contains functions for mobile lunch tracker

function check_get($get_var1, $get_var2="", $get_var3="")
{
	// check that the lunch_cat screen has the needed GET vars
	if ((!isset($_GET[$get_var1]) && $get_var1) || (!isset($_GET[$get_var2]) && $get_var2)
			|| (!isset($_GET[$get_var3]) && $get_var3) ) return true;
	if (($get_var1 && $_GET[$get_var1] == "") || ($get_var2 && $_GET[$get_var2] == "")
			|| ($get_var3 && $_GET[$get_var3] == "")) return true;
	return false;
}

function calcNutrients($mysqli, $food, &$errorCode)
{
	// returns array of food nutrient items
	// calories, points, fat, carbs, protein, fiber
	// recursive design to drill down through ingredient lists
	$nutrients = array();
	$nutrients['calories'] = 0;
	$nutrients['points'] = 0;
	$nutrients['fat'] = 0;
	$nutrients['carbs'] = 0;
	$nutrients['protein'] = 0;
	$nutrients['fiber'] = 0;
	$query = "select * from food_detail where id = ".$food;
	if (!$foodResult = $mysqli->query($query))
	{
		$errorCode = $mysqli->error;
		return false;
	}
	while ($foodInfo = $foodResult->fetch_assoc())
	{
		// to make this compatible w/ Pick version,
		// multiply x 10 as Pick stores w extra decimal place
		if ($foodInfo['calories'])
		{
			$nutrients['calories']	+= $foodInfo['calories'] * 10;
			$nutrients['points']	+= $foodInfo['points'] * 10;
			$nutrients['fat']		+= $foodInfo['fat_grams'] * 10;
			$nutrients['carbs']		+= $foodInfo['carb_grams'] * 10;
			$nutrients['protein']	+= $foodInfo['protein_grams'] * 10;
			$nutrients['fiber']		+= $foodInfo['fiber_grams'] * 10;
		}
		else
		{
			$errorCode = "";
			if (!$nuts = calcNutrients($mysqli, $foodInfo['ingredient_id'], $errorCode)) 
				return false;
			$nutrients['calories']	+= $nuts['calories'] * $foodInfo['servings'];
			$nutrients['points']	+= $nuts['points'] * $foodInfo['servings'];
			$nutrients['fat']		+= $nuts['fat'] * $foodInfo['servings'];
			$nutrients['carbs']		+= $nuts['carbs'] * $foodInfo['servings'];
			$nutrients['protein']	+= $nuts['protein'] * $foodInfo['servings'];
			$nutrients['fiber']		+= $nuts['fiber'] * $foodInfo['servings'];
		}
	}
	return $nutrients;
}
?>