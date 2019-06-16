<?php
// restaurants_ajax.php
// 7-13-12 rlb
// used by ajax call to return list of restaurants for
// calorie lookup mobile web app
// called from lunch.js

require_once("../lunch_connect.php");

// retrieve list of categories from mysql
$query = "select category_id, category_name from category 
			order by category_name";
if (!$cat_result = $mysqli->query($query))
{
	$error_code = $mysqli->error;
	$html_code = "Error retrieving categories.<br>Error Code: ".$error_code;
}
else
{
	$html_code = "<div id=\"rest_instruct\">";
	$html_code .= "<p>Choose restaurant:</p>";
	$html_code .= "<hr /></div>";
	$html_code .= "<div id=\"div_rest_list\"><ul id=\"ul_rest\">";
	while ($cat_info = $cat_result->fetch_assoc())
	{
		$html_code .= '<li class="li_link" type="1" href="'.$cat_info['category_id'].'"';
		$html_code .= ' ontouchstart="restPressed(this)" ontouchend="restReleased(this)" ';
		$html_code .= ' onmousedown="restPressed(this)" onmouseup="restReleased(this)" ';
		$html_code .= '>'.$cat_info['category_name'].'</li>';
	}	
	$html_code .= '</ul></div>';
	$html_code .= '<hr id="hr_rest" />';
}
$html_code .= '</ul></div>';
$html_code .= '<hr id="hr_rest" />';
echo $html_code;

?>