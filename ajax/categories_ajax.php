<?php
// categories_ajax.php
// 7-13-12 rlb
// used by ajax call to return list of restaurant
// categories based on rest_id.  Cat_list contains 
// list of categories to check.  Used by calorie
// lookup mobile web app.
// called from lunch.js

if (!isset($_GET['restId']) || $_GET['restId'] == "") die("Invalid page");
require_once("../lunch_connect.php");

$rest_id = $_GET['restId'];
// cat_list is '*' delimited list of categories
if (!isset($_GET['catList']) || $_GET['catList'] == "") 
	$cat_list = array();
else
	$cat_list = explode("*", $_GET['catList']);
// retrieve list of categories from mysql
$query = 'select a.category_id, a.category_name, b.sub_cat_id, b.sub_cat_name from category a, sub_cat b where
		b.category_id = "'.$rest_id.'" and b.category_id = a.category_id order by b.sub_cat_name';
if (!$cat_result = $mysqli->query($query))
{
	$error_code = $mysqli->error;
	$html_code = "Error retrieving categories.<br>Error Code: ".$error_code;
}
else
{
	$html_code = '<div id="cats_instruct">';
	$html_code .= '<p>Select category(s). Press Load Foods-></p>';
	$html_code .= '<hr /></div>';
	$html_code .= '<div id="div_cats_list">';
	$html_code .= '<ul id="ul_cats">';
	$html_code .= '<li><div class="li_div" id="view_all" onClick="liCatsClick(0, this)" ';
	$html_code .= ' ontouchstart="liPressed(this)" ontouchend="liReleased(this)" ';
	$html_code .= ' onmousedown="liPressed(this)" onmouseup="liReleased(this)" >';
	$html_code .= '<div ';
	if (!count($cat_list) || in_array(0,$cat_list)) 
		$html_code .= ' class="li_checked chckbox" ';
	else
		$html_code .= ' class="li_unchecked chckbox" ';
	$html_code .= '></div><div class="li_text">View All (not recommended)</div></div></li>';;
	while ($cat_info = $cat_result->fetch_assoc())
	{			
		$html_code .= '<li><div class="li_div" onClick="liCatsClick('.$cat_info['sub_cat_id'].', this)" ';
		$html_code .= ' ontouchstart="liPressed(this)" ontouchend="liReleased(this)" ';
		$html_code .= ' onmousedown="liPressed(this)" onmouseup="liReleased(this)" >';
		$html_code .= '<div ';
		if (in_array($cat_info['sub_cat_id'], $cat_list))
			$html_code .= ' class="li_checked chckbox" ';
		else
			$html_code .= ' class="li_unchecked chckbox" ';
		
		$html_code .= '></div><div class="li_text">'.$cat_info['sub_cat_name'].'</div></div></li>';		
	}
	$html_code .= '</ul></div>';
	$html_code .= '<hr id="hr_cats" />';
	$html_code .= '<form name="form_cats">';
	$html_code .= '<input type="hidden" name="rest_id" value="'.$rest_id.'" />';
	$html_code .= '</form>';	
}
echo $html_code;



?>