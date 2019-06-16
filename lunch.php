<?php
// lunch.php
// 2-22-12 rlb
// mobile lunch calorie tracker main screen
// after selecting by category (restaurant)
// and subcategory (hamburgers, salads, etc.)
// user can select various foods and total calories
// and nutrients will be displayed below
// designed for Android/WebKit mobile browsers
// this page will display list of categories and allow
// user to select

require_once("lunch_include.php");

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Calorie Lookup</title>
	<link rel="stylesheet" type="text/css" href="lunch.css">
	<link rel="stylesheet" type="text/css" href="scrollbar.css">
	<link rel="apple-touch-icon-precomposed" href="../images/cl_logo.png" />
	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta names="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<script type="application/javascript" src="iscroll.js"></script>
	<script type="text/javascript" src="piechart.js"></script>
	<script type="text/javascript" src="lunch_help.js"></script>
	<script type="text/javascript" src="lunch.js"></script>
</head>
<body onload="startUp()">
	<div id="loading">Loading...</div>
	<div id="search_div" class="slide_srch_up">
		<form id="search_form" onSubmit="runSrch(); return false;">
			<input id="search_text" type="text" placeholder="Enter search word" required
				autocapitalize="off" autocorrect="off" autocomplete="off" /><br /><br />
			<!--<p id="srch_msg" class="srch_msg_hide">Search word is required!</p>-->
			<button id="search_submit" type="button" onclick="runSrch();">Search</button>
			<button id="search_cancel" type="button" onclick="hideSrch();" >Cancel</button>
		</form>
	</div>
	<div id="sort_box_div"></div>
	<?php require("lunch_header.php"); ?>
	<div id="rest_pg" class="start">
	</div>
	<div id="cats_pg">
	</div>
	<div id="food_pg">
	</div>
</body>
</html>