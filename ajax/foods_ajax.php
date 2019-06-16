<?php
// foods_ajax.php
// 7-13-12 rlb
// used by ajax call to return list of restaurant
// foods based on rest_id, cat_list,and search_name.
// Food_list contains  list of foods to check.  
// sort_by can contain sort order.
// Used by calorie lookup mobile web app.
// called from lunch.js

if (!isset($_GET['restId']) || $_GET['restId'] == "") die("Invalid page");
$rest_id = $_GET['restId'];
require_once("../lunch_connect.php");

// cat_list is '*' delimited list of categories
if (!isset($_GET['catList']) || $_GET['catList'] == "") 
{
	$cat_list = array(0);
	$cat_db_list = "";
	$orig_cat_list = "";
}
else
{
	$cat_db_list = str_replace('*',',',$_GET['catList']);
	$orig_cat_list = $_GET['catList'];
	$cat_list = explode("*", $_GET['catList']);
}
	
// food list contains list of foods to check
if (!isset($_GET['foodList']) || $_GET['foodList'] == "") 
{
	$food_list = array();
	$orig_food_list = "";
}
else
{
	$food_list = explode("*", $_GET['foodList']);
	$orig_food_list = $_GET['foodList'];
}

// search name to use against FULLTEXT index
if (!isset($_GET['searchName']) || $_GET['searchName'] == "") 
	$search_name = "";
else
{
	$search_name = $_GET['searchName'];
	$db_search_name = $mysqli->real_escape_string($search_name);
}
	
// sort by 
if (!isset($_GET['sortBy']) || $_GET['sortBy'] == "") 
	$sort_by = "name";
else
	$sort_by = strtolower($_GET['sortBy']);
// have to add the table name prefix to the sort by
if ($sort_by == "name")
	$sort_by = "food.name";
else
	$sort_by = "food_detail.".$sort_by . ' desc';

// have all GET parameters, so build query
if (in_array(0,$cat_list))
{
	// retrieve list selecting all foods from category
	$query = 'select distinct food.id, food.name from food, food_category, food_detail where
				food.id = food_category.food_id and food_category.category_id = '.$rest_id;
	if ($search_name) 
	{
		$query .= ' and (LOCATE("'.$db_search_name.'", food.name) or LOCATE("'.$db_search_name.'", food.description)) ';
	}
	$query .=	' and food.id = food_detail.id order by '.$sort_by;
}
else
{
	// retrieve list selecting against sub-categories
	$query = 'select distinct food.id, food.name from food, food_sub_cat, food_detail where food.id = food_sub_cat.food_id
				and food_sub_cat.sub_cat_id in ('.$cat_db_list.') and food.id = food_detail.id ';
	if ($search_name) 
	{
		$query .= ' and (LOCATE("'.$db_search_name.'", food.name) or LOCATE("'.$db_search_name.'", food.description)) ';
	}
	$query	.=	' order by '.$sort_by;
}
$html_code2 = "";  // this will be inserted at the end of list or 25 records
$html_code2 .= '</ul></div>';
$html_code2 .= '</div>';  // end of scroller div, not needed if not using pullup refresh
$html_code3 = '<hr id="hr_food" />';
$html_code3 .= '<form name="form_foods">';
$html_code3 .= '<input type="hidden" name="rest_id" value="'.$rest_id.'" />';
$html_code3 .= '<input type="hidden" name="cat_list" value="'.$orig_cat_list.'" />';
$html_code3 .= '<input type="hidden" name="food_list" value="'.$orig_food_list.'" />';
$html_code3 .= '<input type="hidden" name="search_text" value="'.$search_name.'" />';
$html_code3 .= '</form>';

$html_code = '<div id="food_instruct">';
$html_code .= '<p>Select foods.</p>';
$html_code .= '<hr /></div>';
$html_code .= '<div id="div_food_list">';
$html_code .= '<div id="scroller">';  // used for pullup code (2 div's inside scroll), remove if not using pullup refresh
$html_code .= '<ul id="ul_food">';
// retrieve list of foods from mysql
if (!$food_result = $mysqli->query($query))
{
	$error_code = $mysqli->error;
	$html_code .= $html_code2;
	$html_code .= "<h3>Error retrieving foods.<br>Error Code: '.$error_code.'</h3>";
	$html_code .= $html_code3;
}
else
{
	if (!$food_result->num_rows)
	{	
		$html_code .= $html_code2;
		$html_code .= "<h2>No Matching Foods Found</h2>";
		$html_code .= $html_code3;
	}
	else
	{

		// separate first 25 records as they get loaded first, then rest after timeout...makes page scroll more smoothly
		$li_cnt = 0;
		while ($food_info = $food_result->fetch_assoc())
		{
			$html_code .= '<li><div class="li_div" onClick="getFoodNutrients('.$food_info["id"].', this)" ';
			$html_code .= ' ontouchstart="liPressed(this)" ontouchend="liReleased(this)" ';
			$html_code .= ' onmousedown="liPressed(this)" onmouseup="liReleased(this)" ';
			$html_code .= ' foodId="'.$food_info["id"].'" >';
			$html_code .= '<div ';
			if (in_array($food_info['id'],$food_list))
				$html_code .= ' class="li_checked chckbox" ';
			else
				$html_code .= ' class="li_unchecked chckbox" ';
			$html_code .= '></div><div class="li_text">'.$food_info["name"].'</div></div></li>';
			// only include 1st 25 records in <ul>, then at end, add in the rest
			// allows calling program to split up initial page display
			$li_cnt += 1;
			if ($li_cnt == 25)
			{
				$html_code .= $html_code2.$html_code3;
				$html_code .= "~~~~";  //  use ~~~~ as delimiter to separate remaining records
			}		
		}
		if ($li_cnt < 25)
		{
			$html_code .= $html_code2;
			if ($li_cnt == 0)
				$html_code .= "<h2>No Matching Foods Found</h2>";
			$html_code .= $html_code3;
		}
	}
}
echo $html_code;
?>