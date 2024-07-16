// lunch_help.js
// 4-2-12 rlb
// javascript code to build Help text and bottom
// footer menu
// seemed like good idea to separate into own file

function getHelpText(pgNum, restId, catsList) {
  var helpText = "";
  switch (pgNum) {
    default:
    case 0:
      helpText =
        "<h3>Overview</h3> \
				<p>Calorie Lookup provides nutritional information about a variety of foods \
					for several popular fast food restaurants.</p> \
				<p>Whether you are tracking your caloric intake are just want to make an informed \
					choice about what to eat, this program allows you to view the nutritional \
					breakdown of your entire meal.</p> \
				<p>To use, simply select a restaurant from the main page.  Then, you are presented \
					a list of food categories.  You can either choose to View All (default) or \
					choose 1 or more categories by touching that item.</p> \
				<p>View All Categories is not recommended as the number of food items for some restaurants \
					can be very large.</p> \
				<p>After choosing your category(s), press Load Foods to bring up a list of the \
					available food items.</p> \
				<p>You can also Search for a food by choosing -Search Foods- from the slideup menu \
					on either the Category or Food Listing screens.  It will search the selected categories \
					for the phrase that is entered.</p> \
				<p>To sort the foods, use the Sort Foods option from the slideup menu.  You can sort by \
					by any of the nutritional values or by the food name (default).  All subsequent food listings \
					will reflect the new sort order.</p> \
				<p>Finally, choose the foods for your meal by touching the circle for that food.  \
					The calorie count for your total meal will displayed at the bottom of the screen. \
					To view the nutritional breakdown, including fat, carbs, fiber, and protein, press \
					the calculate button on the bottom right.</p> \
				<p>If you want to clear your selections on either the Category or Food Listing screen, use \
					the Uncheck All option from the slideup menu.</p> \
				<p>I hope you enjoy this program.  Feel free to visit my mobile website by pressing the \
					Home icon on this screen.</p><p>&nbsp;</p>";
      break;
    case 1:
      helpText =
        "<h3>Category Help</h3> \
				<p>This screen allows the user to limit the number of foods shown.  If you are only \
					interested in salads, there is no reason to scroll through a listing of burgers and fries.</p> \
				<p>View All Categories is not recommended as the number of food items for some restaurants \
					can be very large.</p> \
				<p>The default is to View All the foods.  Make a selection by touching the corresponding \
					line.  When the checkmark appears, the category has been selected.</p> \
				<p>To remove a category, simply touch the line again.</p> \
				<p>When finished, press the Load Foods button at the bottom of the screen.</p> \
				<p>To access the slideup Menu, press the button on the lower left of the screen.</p> \
				<p>Available options are to Sort the Food Listing, Search for a phrase in the food names/descriptions,\
					and Uncheck All, which will clear the Category listing.</p> \
				<p>Searching for a food will automatically bring up the Food Listing screen after searching \
					for the entered phrase among the chosen categories.</p>\
				<p>To return to the Restaurant listing, press the Back button in the upper left corner.</p><p>&nbsp;</p>";
      break;
    case 2:
      helpText =
        "<h3>Food List Help</h3> \
				<p>This screen lists all food items from the category(s) selected on the previous page.  Scroll down \
					to view the entire list.  </p> \
				<p>Select a food to put on your plate by touching the food item.  When a checkmark \
					appears, the food is added to your plate.  To remove it, simply touch again and the checkmark \
					will disappear.</p> \
				<p>As you add and remove items, the calorie count is automatically updated at the bottom of the screen. \
					To see a breakdown of the nutrients, press the calculator button in the bottom right corner.</p> \
				<p>To access the slideup Menu, press the button on the lower left of the screen.</p> \
				<p>Available options are to Sort the Food Listing, Search for a phrase in the food names/descriptions,\
					and Uncheck All, which will clear all selected food items.</p> \
				<p>Searching for a food will reload the screen after searching \
					for the entered phrase among the chosen categories.</p> \
				<p>Sort order can be by name or any of the nutritional values.  Once changed, all subsequent \
					food listings will reflect the new sort order.</p> \
				<p>To return to the Category listing, press the Back button in the upper left corner.</p><p> &nbsp;</p>";
  }
  return helpText;
}
function getFooterMenu(pgNum) {
  var footerMenu = "";
  switch (pgNum) {
    default:
    case 0:
      footerMenu =
        '\
				<div id="menu_rest">\
					<table id="menu_bar_rest" cellspacing="0">\
					<tr>\
						<td id="menu_help" onclick="menuClicked(this,0)" ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/question.png" />\
						</td>\
						<td id="menu_creator" onclick="menuClicked(this,0)" ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							created by<br /><a id="home-link"  href="http://34.125.252.186/">Ron Boutilier</a>\
						</td>\
						<td id="menu_home" onclick="menuClicked(this,0)" ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/home.png" />\
						</td>\
					</tr>\
					</table>\
				</div>\
				<div id="rest_help">\
					<div id="rest_help_container">\
						<div id="rest_help_scroller">\
						</div>\
					</div>\
					<div class="div_close">\
						<button class="close_but" onclick="hideHelp(\'rest_help\')">Close</button>\
					</div>\
				</div>';
      break;
    case 1:
      footerMenu =
        '\
				<div id="menu_cats">\
					<table id="menu_bar_cats" cellspacing="0">\
					<tr>\
						<td id="menu_more" onclick="menuClicked(this,1)" ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/more.png" />\
						</td>\
						<td id="menu_loadfoods" onclick="menuClicked(this)" ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							Load Foods\
						</td>\
						<td id="menu_home" onclick="menuClicked(this,0)" ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/home.png" />\
						</td>\
					</tr>\
					</table>\
				</div>\
				<div id="cats_help">\
					<div id="cats_help_container">\
						<div id="cats_help_scroller">\
						</div>\
					</div>\
					<div class="div_close">\
						<button class="close_but" onclick="hideHelp(\'cats_help\')">Close</button>\
					</div>\
				</div>';
      break;
    case 2:
      footerMenu =
        '\
				<div id="menu_food">\
					<table id="menu_bar_food" cellspacing="0">\
					<tr>\
						<td id="menu_more" onclick="menuClicked(this,2)" ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/more.png" />\
						</td>\
						<td id="menu_calories">\
							Total Calories: <span id="calories">0</span>\
						</td>\
						<td id="menu_nutrients" onclick="menuClicked(this)" ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/calc.png" />\
						</td>\
					</tr>\
					</table>\
				</div>\
				<div id="div_nutrients">\
					<ul id="nut_tabs">\
						<li id="li_left" class="nut_selected" onClick="clickNutLi(this);"	onTouchStart="nutPressed(this);"\
							onMouseDown="nutPressed(this);" onTouchEnd="nutReleased(this);" onMouseUp="nutReleased(this);"\
							>Totals\
						</li>\
						<li id="li_right" class="nut_unselected" onClick="clickNutLi(this);"	onTouchStart="nutPressed(this);"\
							onMouseDown="nutPressed(this);" onTouchEnd="nutReleased(this);" onMouseUp="nutReleased(this);"\
							>Graph\
						</li>\
					</ul>\
					<div id="div_nutrients_container">\
						<div id="nut_scroller">\
							<div id="totals">\
							<h3>Total Nutrients</h3>\
								<table id="table_nuts" cellspacing="5" style="width:70%">\
									<tr>\
										<td style="text-align:right">Calories:</td>\
										<td id="nut0">0</td>\
									</tr>\
										<td style="text-align:right">Fat Gms:</td>\
										<td id="nut1">0</td>\
									<tr>\
										<td style="text-align:right">Carb Gms:</td>\
										<td id="nut2">0</td>\
									</tr>\
									<tr>\
										<td style="text-align:right">Fiber Gms:</td>\
										<td id="nut3">0</td>\
									</tr>\
									<tr>\
										<td style="text-align:right">Protein Gms:</td>\
										<td id="nut4">0</td>\
									</tr>\
								</table><p>&nbsp; </p>\
							</div>\
							<div id="chart">\
								<h3>Calorie Chart</h3>\
								<canvas id="pie_chart"></canvas><p>&nbsp; </p>\
							</div>\
						</div>\
					</div>\
					<div class="div_close">\
						<button class="close_but" onclick="hideNutrients()">Close</button>\
					</div>\
				</div>\
				<div id="food_help">\
					<div id="food_help_container">\
						<div id="food_help_scroller">\
						</div>\
					</div>\
					<div class="div_close">\
						<button class="close_but" onclick="hideHelp(\'food_help\')">Close</button>\
					</div>\
				</div>';
  }
  return footerMenu;
}
function getSlideMenu(pgNum) {
  var slideMenu = "";
  switch (pgNum) {
    default:
    case 0:
      slideMenu =
        '\
				<div id="slide_menu_rest" class="slide_down">\
					<table class="slide_menu_table">\
					<tr>\
						<td id="menu_help_r" class="ul" onclick="menuClicked(this,0)" \
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/question.png" /><br />Help\
						</td>\
						<td id="menu_search_r" class="uc" onclick="menuClicked(this,0)"\
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/search.png" />\
						</td>\
						<td id="menu_ur_r" class="ur" onclick="menuClicked(this,0)" \
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/home.png" />\
						</td>\
					</tr>\
					<tr>\
						<td id="menu_close_r" class="ll" onclick="menuClicked(this,0)"\
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/close.png" /><br />Close\
						</td>\
						<td id="menu_lc_r" class="lc" onclick="menuClicked(this,0)"\
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/question.png" />\
						</td>\
						<td id="menu_lr_r" class="lr" onclick="menuClicked(this,0)"\
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/more.png" />\
						</td>\
					</tr>\
					</table>\
				</div><!-- end of slide_menu -->';
      break;
    case 1:
      slideMenu =
        '\
				<div id="slide_menu_cats" class="slide_down">\
					<table class="slide_menu_table">\
					<tr>\
						<td id="menu_help_c" class="ul" onclick="menuClicked(this,1)"\
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/question.png" /><br />Help\
						</td>\
						<td id="menu_search_c" class="uc" onclick="menuClicked(this,1)" \
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/search.png" /><br />Search Foods\
						</td>\
						<td id="menu_sort_c" class="ur" onclick="menuClicked(this,1)"\
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/sort.png" /><br />Sort Foods\
						</td>\
					</tr>\
					<tr>\
						<td id="menu_close_c" class="ll" onclick="menuClicked(this,1)" \
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/close.png" /><br />Close\
						</td>\
						<td id="menu_home_c" class="lc" onclick="menuClicked(this,1)" \
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/home.png" /><br />RBoutilier.com\
						</td>\
						<td id="menu_uncheck_c" class="lr" onclick="menuClicked(this,1)"\
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/uncheck.png" /><br />Uncheck All\
						</td>\
					</tr>\
					</table>\
				</div><!-- end of slide_menu -->';
      break;
    case 2:
      slideMenu =
        '\
				<div id="slide_menu_food" class="slide_down">\
					<table class="slide_menu_table">\
					<tr>\
						<td id="menu_help_f" class="ul" onclick="menuClicked(this,2)" \
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/question.png" /><br />Help\
						</td>\
						<td id="menu_search_f" class="uc" onclick="menuClicked(this,2)"\
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/search.png" /><br />Search Foods\
						</td>\
						<td id="menu_sort_f" class="ur" onclick="menuClicked(this,2)"\
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/sort.png" /><br />Sort Foods\
						</td>\
					</tr>\
					<tr>\
						<td id="menu_close_f" class="ll" onclick="menuClicked(this,2)"\
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/close.png" /><br />Close\
						</td>\
						<td id="menu_home_f" class="lc" onclick="menuClicked(this,2)" \
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/home.png" /><br />RBoutilier.com\
						</td>\
						<td id="menu_uncheck_f" class="lr" onclick="menuClicked(this,2)" \
							ontouchstart="menuPressed(this)" \
							ontouchend="menuReleased(this)" onmousedown="menuPressed(this)" onmouseup="menuReleased(this)">\
							<img src="./assets/images/uncheck.png" /><br />Uncheck All\
						</td>\
					</tr>\
					</table>\
				</div><!-- end of slide_menu -->';
  }
  return slideMenu;
}
