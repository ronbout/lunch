// lunch.js
// 2-29-12 rlb
// javascript for mobile Lunch Calorie Lookup

// debug object to test timing issues
var debugObj = {};

var pgs = ["rest_pg", "cats_pg", "food_pg"];
var sortFlds = [
  { display: "NAME", db: "name" },
  { display: "CALORIES", db: "calories" },
  { display: "FAT", db: "fat_grams" },
  { display: "CARBS", db: "carb_grams" },
  { display: "PROTEIN", db: "PROTEIN_GRAMS" },
];
var sortBy = 0;
var srchFlg = false; // keep track of whether search screen is displayed
var menuFlg = false; // keep track whether a popup is currently displayed to disable other elements
var curPage; // track current page for resizing on orientation change
var nutrients = [0, 0, 0, 0, 0]; // nutrient counters
var catsObj = {}; // create empty object to store selected categories across pages
var foodsObj = {}; // create empty object to store selected foods across pages
var myScroll = {}; // using iScroll 4 ... too many hassles w momentum scrolling
var restName = ""; // track restaurant name across pages
// set up device-based variables
var isTouchPad = /hp-tablet/gi.test(navigator.appVersion);
var hasTouch = "ontouchstart" in window && !isTouchPad;
var start_ev = hasTouch ? "ontouchstart" : "onmousedown";
var move_ev = hasTouch ? "ontouchmove" : "onmousemove";
var end_ev = hasTouch ? "ontouchend" : "onmouseup";
// find out type of device
var vendor = /webkit/i.test(navigator.appVersion)
  ? "webkit"
  : /firefox/i.test(navigator.userAgent)
  ? "Moz"
  : /trident/i.test(navigator.userAgent)
  ? "ms"
  : "opera" in window
  ? "O"
  : "";
var androidFlg = /android/i.test(navigator.userAgent) ? true : false;
// if menu or popup screen is open, disable all other interface
var iosFlg =
  navigator.platform.indexOf("iPhone") != -1 ||
  navigator.platform.indexOf("iPad") != -1 ||
  navigator.platform.indexOf("iPod") != -1
    ? true
    : false;

function Ajax() {
  // first get the request object
  try {
    // Opera 8.0+, Firefox, Safari
    this.ajaxRequest = new XMLHttpRequest();
  } catch (e) {
    // Internet Explorer Browsers
    try {
      this.ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        this.ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        // Something went wrong
        alert("problem with http request object");
        return false;
      }
    }
  }
}
Ajax.prototype.loadRequest = function (resp_fn) {
  var that = this;
  this.ajaxRequest.onreadystatechange = function () {
    if (that.ajaxRequest.readyState == 4)
      if (that.ajaxRequest.status == 200)
        resp_fn(that.ajaxRequest.responseText);
  };
};
Ajax.prototype.sendRequest = function (url) {
  this.ajaxRequest.open("GET", url, true);
  this.ajaxRequest.send(null);
};
function runAjax(url, fnDef) {
  //url = "/mobile/lunch/" + url;
  var request = new Ajax();
  request.loadRequest(fnDef);
  request.sendRequest(url);
}
function startUp() {
  firstFlg = true;
  window.onorientationchange = changeOrient;
  loadPage(0, 0, "");
  getSortCookie();
}
function loadPage(newPg, oldPg, args) {
  addLoading();
  // destroy any scrollbar that exists
  for (scrollObj in myScroll) {
    if (myScroll[scrollObj]) {
      myScroll[scrollObj].destroy();
      myScroll[scrollObj] = null;
    }
  }
  // need to adjust body height, moved scrollTo until end of setSizing
  if (androidFlg) {
    document.body.style.height = window.innerHeight + 52 + "px";
    window.scrollTo(0, 1);
  } else if (iosFlg) {
    if (window.navigator.standalone)
      document.body.style.height = window.innerHeight + "px";
    else {
      // need to check if landscape as screen.height does not change
      if (window.innerHeight < window.innerWidth)
        document.body.style.height = window.screen.width - 64 + "px";
      else document.body.style.height = window.screen.height - 64 + "px";
    }
  }
  if (
    androidFlg &&
    (window.orientation == "90" || window.orientation == "-90")
  ) {
    // for whatever reason, timing is slower when starting in landscape mode
    // scrollTo takes longer to update height variables
    setTimeout(function () {
      loadPageAjax(newPg, oldPg, args);
    }, 300);
  } else loadPageAjax(newPg, oldPg, args);
}
function loadPageAjax(newPg, oldPg, args) {
  // do not reload restaurants or categories from database if moving back
  switch (newPg) {
    case 0:
    default:
      if (oldPg == 1) preparePg(1, 0, false);
      else
        ajaxLoadHTML(
          "rest_pg",
          "ajax/restaurants_ajax.php",
          args,
          newPg,
          oldPg,
          ""
        );
      break;
    case 1:
      if (oldPg == 2) preparePg(2, 1, false);
      else
        ajaxLoadHTML(
          "cats_pg",
          "ajax/categories_ajax.php",
          args,
          newPg,
          oldPg,
          ""
        );
      break;
    case 2:
      // considered ios ajax call that doesn't split up food, but didn't work well
      // kept structure in place
      if (iosFlg)
        ajaxLoadHTML("food_pg", "ajax/foods_ajax.php", args, newPg, oldPg, "");
      else
        ajaxLoadHTML("food_pg", "ajax/foods_ajax.php", args, newPg, oldPg, "");
  }
}
function ajaxLoadHTML(destId, url, ajaxArgs, pgNum, oldPg, phpFn) {
  // pgNum values: 0=restaurants  1=categories  2=foods
  if (pgNum == undefined) PgNum = 0;
  if (oldPg == undefined) oldPg = 0;
  // if phpFn, then will pass function name to calling program
  // function will build HTML, rather than just pull from file
  // ajaxArgs will contain function args, if they exist
  var ajaxUrl = url + ajaxArgs;
  //alert(ajaxUrl);
  // most of the work is done in the following callback function
  function responseFn(responseText) {
    //alert(responseText);
    if (responseText == -1) {
      alert("Could not open file " + url);
      removeLoading();
    } else if (responseText == -2) {
      alert("Could not find id " + ajaxArgs);
      removeLoading();
    } else {
      var footerMenu = getFooterMenu(pgNum);
      var slideMenu = getSlideMenu(pgNum);
      e = document.getElementById(destId);
      // food lists can get very long and the page slide animation cannot handle it smoothly
      // so page will only include 1st 25 lines, with remainder at end of response text
      // add those lines in after page slide
      var moreFlg = false;
      var rtSplit = [];
      if (pgNum == 2) {
        if (~responseText.indexOf("~~~~")) {
          moreFlg = true;
          rtSplit = responseText.split("~~~~");
        }
      }
      e.innerHTML = "";
      if (moreFlg) e.innerHTML = rtSplit[0] + footerMenu + slideMenu;
      else e.innerHTML = responseText + footerMenu + slideMenu;
      // wait until page is rendered fully before next step
      var intervalId = setInterval(function () {
        var testDiv;
        switch (pgNum) {
          default:
          case 0:
            testDiv = "slide_menu_rest";
            break;
          case 1:
            testDiv = "slide_menu_cats";
            break;
          case 2:
            testDiv = "slide_menu_food";
        }
        if (document.getElementById(testDiv) != null) {
          clearInterval(intervalId);
          preparePg(oldPg, pgNum, moreFlg, rtSplit);
        }
      }, 10);
    }
  }
  runAjax(ajaxUrl, responseFn);
}
function preparePg(oldPg, pgNum, moreFlg, rtSplit) {
  loadLiLinks(e);
  //setSizeChckbox();
  switch (pgNum) {
    case 0:
      // reset category list to default - View All
      catsObj = { 0: 1 };
      foodsObj = {};
      setTimeout(function () {
        loadTitle("Calorie Lookup");
        removeBack();
        removeLoading();
        if (oldPg != 0) slideRight(oldPg, 0);
      }, 50);
      break;
    case 1:
      // change title line to show restaurant
      setTimeout(function () {
        if (iosFlg) {
          if (oldPg == 0) slideLeft(0, 1);
          if (oldPg == 2) {
            // when backing out of food page, remove innerHTML to free up resources
            slideRight(2, 1);
            /*var fscrll = document.getElementById("ul_food");
						var fp = document.getElementById("food_pg");
						var fsh = parseInt(window.getComputedStyle(fscrll,"").height);
						var fph = parseInt(window.getComputedStyle(fp,"").height);
						if ( fsh > fph && fsh > 1000)
						{
							setTimeout(function() {
								fp.innerHTML = "";
							},1200);
						}*/
          }
          setTimeout(function () {
            loadTitle(restName);
            removeBack();
            addBack(0, 1);
            removeLoading();
          }, 100);
        } else {
          loadTitle(restName);
          removeBack();
          addBack(0, 1);
          removeLoading();
          if (oldPg == 0) slideLeft(0, 1);
          if (oldPg == 2) {
            // when backing out of food page, remove innerHTML to free up resources
            slideRight(2, 1);
            var fscrll = document.getElementById("ul_food");
            var fp = document.getElementById("food_pg");
            var fsh = parseInt(window.getComputedStyle(fscrll, "").height);
            var fph = parseInt(window.getComputedStyle(fp, "").height);
            if (fsh > fph && fsh > 1000) {
              setTimeout(function () {
                fp.innerHTML = "";
              }, 800);
            }
          }
        }
      }, 80);
      break;
    case 2:
      setTimeout(function () {
        if (iosFlg) {
          if (oldPg != 2) slideLeft(oldPg, 2);
          if (moreFlg) {
            setTimeout(function () {
              var ul = document.getElementById("ul_food");
              ul.innerHTML = ul.innerHTML + rtSplit[1];
              setSizeChckbox();
              myScroll.food.refresh();
              // setup nutrients and foodsObj.
              // foods may have been removed if category was removed
              buildFoodInfo();
              removeLoading();
            }, 200);
          }
          setTimeout(function () {
            loadTitle(restName);
            removeBack();
            addBack(1, 2);
            if (!moreFlg) {
              buildFoodInfo();
              removeLoading();
            }
          }, 10);
        } else {
          loadTitle(restName);
          removeBack();
          addBack(1, 2);
          if (oldPg != 2) slideLeft(oldPg, 2);
          if (moreFlg) {
            setTimeout(function () {
              var ul = document.getElementById("ul_food");
              ul.innerHTML = ul.innerHTML + rtSplit[1];
              setSizeChckbox();
              myScroll.food.refresh();
              // setup nutrients and foodsObj.
              // foods may have been removed if category was removed
              buildFoodInfo();
              removeLoading();
            }, 500);
          } else {
            buildFoodInfo();
            removeLoading();
          }
        }
      }, 50);
  }
  curPage = pgNum;
  setSizing();
}
function loadTitle(titleName) {
  var hdr = document.getElementById("header");
  var hdrH1 = hdr.getElementsByTagName("h1")[0];
  if (titleName.length > 18) hdrH1.style.fontSize = "16px";
  else hdrH1.style.fontSize = "20px";
  hdrH1.innerHTML = titleName;
}
function loadLiLinks(e) {
  // loop through all li elements in element e, looking for li_link class
  // if there, set up onClick/ontouchstart handler for given href
  var lis = e.getElementsByTagName("li");
  for (var i = 0; i < lis.length; i++)
    if (lis[i].className.indexOf("li_link") > -1) {
      var hrf = lis[i].getAttribute("href");
      var aType = lis[i].getAttribute("type");
      if (aType == 1) {
        lis[i].setAttribute(
          "onclick",
          "loadRest('" + hrf + "','" + lis[i].innerHTML + "')"
        );
      } else lis[i].setAttribute("onclick", "window.open('" + hrf + "')");
    }
}
function changeOrient() {
  // may need to remove url bar again
  if (androidFlg) {
    document.body.style.height = window.innerHeight + 53 + "px";
    window.scrollTo(0, 1);
    setTimeout(function () {
      setSizing();
    }, 300);
  }
  if (iosFlg) {
    if (window.navigator.standalone)
      document.body.style.height = window.innerHeight + "px";
    else {
      // need to check if landscape as screen.height does not change
      if (window.innerHeight < window.innerWidth)
        document.body.style.height = window.screen.width - 64 + "px";
      else document.body.style.height = window.screen.height - 64 + "px";
    }
    setTimeout(function () {
      setSizing();
    }, 300);
  }
}
function setSizing() {
  var pgNum = curPage;
  var rp, cp, fp, r, c, f;
  setSizeChckbox();
  // restaurant page
  if (pgNum == 0) {
    r = document.getElementById("div_rest_list");
    rp = document.getElementById("rest_pg");
    if (r != undefined) {
      // reset to original "auto" otherwise js setting overrides orig css
      r.style.height = "auto";
      // need to set height for ios, first time the innerHeight does not include url space
      // if in standalone mode, no adjustments need to be made
      if (iosFlg) {
        if (!window.navigator.standalone) {
          // must always check orientation when working with screen.height
          // as it does NOT change with orientation
          if (window.innerHeight < window.innerWidth) {
            // landscape mode, must shorten all screens, or it will show below
            fp = document.getElementById("food_pg");
            cp = document.getElementById("cats_pg");
            c = document.getElementById("div_cats_list");
            f = document.getElementById("div_food_list");
            rp.style.height = window.screen.width - 90 + "px";
            setTimeout(function () {
              fp.style.height = window.screen.width - 120 + "px";
              cp.style.height = window.screen.width - 120 + "px";
              if (f != null) f.style.height = window.screen.width - 120 + "px";
              if (c != null) c.style.height = window.screen.width - 120 + "px";
            }, 800);
          } else rp.style.height = window.screen.height - 104 + "px";
        } else {
          rp.style.height = window.innerHeight - 40 + "px";
        }
      }
      // need to set up scroll
      var ru = document.getElementById("ul_rest");
      var rdh = parseInt(window.getComputedStyle(r, "").height);
      var ruh = parseInt(window.getComputedStyle(ru, "").height);
      //alert("div_rest_list: " + rdh+"\nul_rest: "+ruh);
      var h = rdh / ruh;
      if (h < 1) {
        if (myScroll.rest) myScroll.rest.refresh();
        else {
          // set up restaurant scroll if ul is taller than div
          setTimeout(function () {
            myScroll.rest = setUpScroll("div_rest_list");
          }, 300);
        }
      } else {
        if (myScroll.rest) {
          myScroll.rest.destroy();
          myScroll.rest = null;
        }
        r.style.height = ruh + "px";
      }
    }
  }
  // category page
  if (pgNum == 1) {
    c = document.getElementById("div_cats_list");
    cp = document.getElementById("cats_pg");
    if (c != undefined) {
      c.style.height = "auto";
      if (iosFlg) {
        if (!window.navigator.standalone) {
          if (window.innerHeight < window.innerWidth) {
            // landscape mode, must shorten all screens, or it will show below
            rp = document.getElementById("rest_pg");
            fp = document.getElementById("food_pg");
            r = document.getElementById("div_rest_list");
            f = document.getElementById("div_food_list");
            cp.style.height = window.screen.width - 90 + "px";
            setTimeout(function () {
              rp.style.height = window.screen.width - 120 + "px";
              fp.style.height = window.screen.width - 120 + "px";
              if (r != null) r.style.height = window.screen.width - 120 + "px";
              if (f != null) f.style.height = window.screen.width - 120 + "px";
            }, 800);
          } else cp.style.height = window.screen.height - 104 + "px";
        } else {
          cp.style.height = window.innerHeight - 40 + "px";
        }
      }
      var cu = document.getElementById("ul_cats");
      var cdh = parseInt(window.getComputedStyle(c, "").height);
      var cuh = parseInt(window.getComputedStyle(cu, "").height);
      var h = cdh / cuh;
      if (h < 1) {
        if (myScroll.cats) myScroll.cats.refresh();
        else {
          // set up restaurant scroll if ul is taller than div
          myScroll.cats = setUpScroll("div_cats_list");
        }
      } else {
        if (myScroll.cats) {
          myScroll.cats.destroy();
          myScroll.cats = null;
        }
        c.style.height = cuh + "px";
      }
    }
  }
  // food page
  if (pgNum == 2) {
    f = document.getElementById("div_food_list");
    fp = document.getElementById("food_pg");
    if (f != undefined) {
      f.style.height = "auto";
      if (iosFlg) {
        if (!window.navigator.standalone) {
          if (window.innerHeight < window.innerWidth) {
            // landscape mode, must shorten all screens, or it will show below
            rp = document.getElementById("rest_pg");
            cp = document.getElementById("cats_pg");
            r = document.getElementById("div_rest_list");
            c = document.getElementById("div_cats_list");
            fp.style.height = window.screen.width - 90 + "px";
            setTimeout(function () {
              rp.style.height = window.screen.width - 120 + "px";
              cp.style.height = window.screen.width - 120 + "px";
              if (r != null) r.style.height = window.screen.width - 120 + "px";
              if (c != null) c.style.height = window.screen.width - 120 + "px";
            }, 800);
          } else fp.style.height = window.screen.height - 104 + "px";
        } else {
          fp.style.height = window.innerHeight - 40 + "px";
        }
      }
      var fu = document.getElementById("ul_food");
      var fdh = parseInt(window.getComputedStyle(f, "").height);
      var fuh = parseInt(window.getComputedStyle(fu, "").height);
      var h = fdh / fuh;
      if (h < 1) {
        if (myScroll.food) {
          myScroll.food.refresh();
        } else {
          // set up restaurant scroll if ul is taller than div
          myScroll.food = setUpScroll("div_food_list");
        }
      } else {
        if (myScroll.food) {
          myScroll.food.destroy();
          myScroll.food = null;
        }
        f.style.height = fuh + "px";
      }
    }
  }
  // if nutrient box is visible, check for resizing
  var nutDiv = document.getElementById("div_nutrients");
  if (
    nutDiv != undefined &&
    window.getComputedStyle(nutDiv, "").display == "block"
  )
    checkPopupSize("div_nutrients_container", "nut_scroller");
  // if help box is visible, check for resizing
  var helpDiv = document.getElementById("rest_help");
  if (
    helpDiv != undefined &&
    window.getComputedStyle(helpDiv, "").display == "block"
  )
    checkPopupSize("rest_help_container", "rest_help_scroller");
  helpDiv = document.getElementById("cats_help");
  if (
    helpDiv != undefined &&
    window.getComputedStyle(helpDiv, "").display == "block"
  )
    checkPopupSize("cats_help_container", "cats_help_scroller");
  helpDiv = document.getElementById("food_help");
  if (
    helpDiv != undefined &&
    window.getComputedStyle(helpDiv, "").display == "block"
  )
    checkPopupSize("food_help_container", "food_help_scroller");
  // if sort box is visible, check for resizing
  var sortDiv = document.getElementById("sort_box_div");
  if (
    sortDiv != undefined &&
    window.getComputedStyle(sortDiv, "").display == "block"
  )
    checkPopupSize("sort_container", "sort_scroller");

  if (androidFlg) window.scrollTo(0, 1);
  if (iosFlg) window.scrollTo(0, 0);
}
function setSizeChckbox() {
  // set sizes of li images div's..must be same as container
  var lis = document.getElementsByClassName("chckbox");
  for (var i = 0; i < lis.length; i++) {
    var parNode = lis[i].parentNode;
    var txtLi = parNode.childNodes[1];
    if (txtLi.innerHTML.length > 35 && txtLi.innerHTML.length < 42)
      txtLi.style.fontSize = "13px";
    if (txtLi.innerHTML.length >= 42) txtLi.style.fontSize = "12px";
    lis[i].style.height = window.getComputedStyle(parNode, "").height;
  }
}
function loadRest(restId, rName) {
  if (menuFlg || srchFlg) return;
  restName = rName;
  // set up args and call loadPage for categories page
  loadPage(1, 0, "?restId=" + restId);
}
function loadFoods(srchText) {
  if (menuFlg || srchFlg) return;
  // build args
  var restId = document.form_cats.rest_id.value;
  var argList = "?restId=" + restId;
  // build category list
  var catsList = "";
  for (var catIds in catsObj) {
    if (catsList != "") catsList += "*" + catIds;
    else catsList = catIds;
  }
  if (catsList != "") argList += "&catList=" + catsList;
  // build food list
  var foodsList = "";
  for (var foodIds in foodsObj) {
    if (foodsList != "") foodsList += "*" + foodIds;
    else foodsList = foodIds;
  }
  if (foodsList != "") argList += "&foodList=" + foodsList;
  // check for search text
  if (srchText != undefined) {
    argList += "&searchName=" + srchText;
  }
  // get sort type
  argList += "&sortBy=" + sortFlds[sortBy].db;
  loadPage(2, curPage, argList);
}
function buildFoodInfo() {
  // when the food page is loaded, some foods may still be selected from previous
  // need to loop through li's, looking for checked foods, updating nutrients and foodsObj
  var foodLis;
  nutrients = [0, 0, 0, 0, 0];
  for (var nutI = 0; nutI < 5; nutI++)
    document.getElementById("nut" + nutI).innerHTML = "0";
  document.getElementById("calories").innerHTML = "0";
  // get food ul and loop through li's with checked class
  var foodUl = document.getElementById("ul_food");
  var checkLis = foodUl.getElementsByClassName("li_checked");
  for (var i = 0; i < checkLis.length; i++) {
    var foodId = checkLis[i].parentNode.getAttribute("foodId");
    getFoodNutrients(foodId, checkLis[i], false);
  }
}
function backPage(newPg, oldPg) {
  thisBut = document.getElementById("backButton");
  thisBut.style[vendor + "BorderImage"] =
    "url('../images/back_button.png') 0 8 0 8";
  if (menuFlg || srchFlg) return;
  // find out which screen we are going to, build args and call loadPage
  if (newPg == 1) {
    var restId = document.form_foods.rest_id.value;
    var argList;
    var catsList = "";
    for (var catIds in catsObj) {
      if (catsList != "") catsList += "*" + catIds;
      else catsList = catIds;
    }
    argList = "?restId=" + restId;
    if (catsList != "") argList += "&catList=" + catsList;
    loadPage(newPg, oldPg, argList);
  } else {
    loadPage(newPg, oldPg, "");
  }
}
function addLoading() {
  // if first page, use splash screen
  if (firstFlg) var divName = "loading";
  else var divName = "loading";
  // display loading div
  var l = document.getElementById(divName);
  l.style.visibility = "visible";
  menuFlg = true;
}
function removeLoading() {
  // check whether splash screen
  if (firstFlg) {
    var divName = "loading";
    firstFlg = false;
  } else var divName = "loading";
  var l = document.getElementById(divName);
  l.style.visibility = "hidden";
  menuFlg = false;
}
function addBack(newPg, oldPg) {
  // add back button
  var b = document.getElementById("backButton");
  b.setAttribute(start_ev, "buttonPress(this)");
  b.setAttribute(end_ev, "backPage(" + newPg + "," + oldPg + ")");
  b.style.visibility = "visible";
}
function removeBack() {
  b = document.getElementById("backButton");
  b.style.visibility = "hidden";
}
function slideLeft(curPg, newPg) {
  for (var i = 0; i < pgs.length; i++) {
    if (i != curPg && i != newPg) {
      e = document.getElementById(pgs[i]);
      if (e.className) {
        if (e.className.indexOf("div_hide") == -1) e.className += " div_hide ";
        e.className = e.className.replace("start", "");
        e.className = e.className.replace("slide_left_in", "");
        e.className = e.className.replace("slide_right_in", "");
        e.className = e.className.replace("slide_left_out", "");
        e.className = e.className.replace("slide_right_out", "");
      } else e.className = "div_hide";
    }
  }
  var c = document.getElementById(pgs[curPg]);
  var n = document.getElementById(pgs[newPg]);
  n.className = n.className.replace("div_hide", "");
  n.className = "slide_left_in";
  c.className = "slide_left_out";
}
function slideRight(curPg, newPg) {
  for (var i = 0; i < pgs.length; i++) {
    if (i != curPg && i != newPg) {
      e = document.getElementById(pgs[i]);
      if (e.className) {
        if (e.className.indexOf("div_hide") == -1) e.className += " div_hide ";
        e.className = e.className.replace("start", "");
        e.className = e.className.replace("slide_left_in", "");
        e.className = e.className.replace("slide_right_in", "");
        e.className = e.className.replace("slide_left_out", "");
        e.className = e.className.replace("slide_right_out", "");
      }
    }
  }
  var c = document.getElementById(pgs[curPg]);
  var n = document.getElementById(pgs[newPg]);
  n.className = n.className.replace("div_hide", "");
  n.className = "slide_right_in";
  c.className = "slide_right_out";
}
function liCatsClick(catId, thisLi) {
  var thisCheck = thisLi.childNodes[0];
  if (menuFlg || srchFlg) return;
  if (0 === catId) {
    if ("0" in catsObj) return;
    // turn off any selected cats as View All takes precedence
    var catListUl = document.querySelector("#ul_cats");
    var catList = catListUl.querySelectorAll(".li_checked");
    catList.forEach((e) => {
      e.className = e.className.replace("li_checked", "li_unchecked");
    });
    thisCheck.className = thisCheck.className.replace(
      "li_unchecked",
      "li_checked"
    );
    catsObj = { 0: 1 };
  } else {
    // update background image w class, then update catsObj
    if (~thisCheck.className.indexOf("li_checked")) {
      thisCheck.className = thisCheck.className.replace(
        "li_checked",
        "li_unchecked"
      );
      if (catId in catsObj) delete catsObj[catId];
      var catCnt = Object.keys(catsObj).length;
      // if no categories are chosen, then turn on the View All
      if (!catCnt) {
        var vParent = document.getElementById("view_all");
        var v = vParent.childNodes[0];
        v.className = v.className.replace("li_unchecked", "li_checked");
        catsObj = { 0: 1 };
      }
    } else {
      thisCheck.className = thisCheck.className.replace(
        "li_unchecked",
        "li_checked"
      );
      if (!(catId in catsObj)) catsObj[catId] = 1;
      // if not 'View All' (id=0), then uncheck View All if necessary
      if (catId != "0" && "0" in catsObj) {
        var vParent = document.getElementById("view_all");
        var v = vParent.childNodes[0];
        v.className = v.className.replace("li_checked", "li_unchecked");
        delete catsObj["0"];
      }
    }
  }
}
function getFoodNutrients(foodId, thisLi, toggleFlg) {
  // if toggleFlg is set, then update checkbox, otherwise, just retrieve nutrient info
  if (toggleFlg == undefined) toggleFlg = true;
  // do not run from category page if menu or search/sort boxes are displayed
  if ((menuFlg || srchFlg) && toggleFlg) return;
  var url = "ajax/ajax_food_nutrients.php?foodId=" + foodId;
  // determine whether box is being checked on or off
  var thisCheck = thisLi.childNodes[0];
  var checkStatus;
  if (toggleFlg) {
    if (~thisCheck.className.indexOf("li_checked")) {
      thisCheck.className = thisCheck.className.replace(
        "li_checked",
        "li_unchecked"
      );
      if (foodId in foodsObj) delete foodsObj[foodId];
      checkStatus = false;
    } else {
      thisCheck.className = thisCheck.className.replace(
        "li_unchecked",
        "li_checked"
      );
      if (!(foodId in foodsObj)) foodsObj[foodId] = 1;
      checkStatus = true;
    }
  } else {
    checkStatus = true;
    if (!(foodId in foodsObj)) foodsObj[foodId] = 1;
  }
  // most of the work is done in the following callback function
  function responseFn(responseText) {
    //alert(responseText);
    if (responseText == "-1") {
      alert("Error retrieving food!");
    } else {
      // responseText is comma-delimited string.  convert to array
      // numbers are coming in as pick oconv md1, i.e. must /10
      var nuts = responseText.split(",");
      var tdNuts;
      for (var i = 0; i < nuts.length; i++) {
        tdNuts = document.getElementById("nut" + i);
        if (checkStatus) {
          if (tdNuts != undefined)
            tdNuts.innerHTML = Number(tdNuts.innerHTML) + Number(nuts[i]) / 10;
          nutrients[i] += Number(nuts[i]) / 10;
        } else {
          if (tdNuts != undefined)
            tdNuts.innerHTML = Number(tdNuts.innerHTML) - Number(nuts[i]) / 10;
          nutrients[i] -= Number(nuts[i]) / 10;
        }
      }
      cals = document.getElementById("calories");
      if (checkStatus)
        cals.innerHTML = Number(cals.innerHTML) + Number(nuts[0]) / 10;
      else cals.innerHTML = Number(cals.innerHTML) - Number(nuts[0]) / 10;
    }
  }
  runAjax(url, responseFn);
}
function setUpScroll(divId) {
  var myNewScroll = new iScroll(divId, {
    hscroll: false,
    hScrollbar: false,
    hideScrollbar: false,
    scrollbarClass: "myScrollbar",
    vScrollbar: true,
  });
  return myNewScroll;
}
function menuClicked(thisMenu, pgNum) {
  var menuOpt = thisMenu.id;
  var menuName;
  switch (pgNum) {
    default:
    case 0:
      menuName = "slide_menu_rest";
      break;
    case 1:
      menuName = "slide_menu_cats";
      break;
    case 2:
      menuName = "slide_menu_food";
  }
  switch (menuOpt) {
    case "menu_more":
      if (menuFlg || srchFlg) return;
      //loadDebug("current upon menu press");
      //showDebug();
      showMenu(menuName);
      //showLocs();
      break;
    case "menu_close_r":
    case "menu_close_c":
    case "menu_close_f":
      hideMenu(menuName);
      break;
    case "menu_help":
      if (menuFlg || srchFlg) return;
      showHelp(pgNum);
      break;
    case "menu_help_r":
    case "menu_help_c":
    case "menu_help_f":
      hideMenu(menuName);
      showHelp(pgNum);
      break;
    case "menu_home":
    case "menu_home_c":
    case "menu_home_f":
      if ((menuFlg || srchFlg) && menuOpt == "menu_home") return;
      window.open("http://www.rboutilier.com", "_self");
      break;
    case "menu_loadfoods":
    case "menu_loadfoods_arrow":
      if (menuFlg || srchFlg) return;
      loadFoods();
      break;
    case "menu_nutrients":
      var nutDiv = document.getElementById("div_nutrients");
      if (window.getComputedStyle(nutDiv, "").display == "none") {
        if (menuFlg || srchFlg) return;
        showNutrients();
      } else hideNutrients();
      break;
    case "menu_uncheck_c":
      if (1 === catsObj[0]) {
        hideMenu(menuName);
        break;
      }
      uncheckAll("cats_pg");
      catsObj = { 0: 1 };
      var vParent = document.getElementById("view_all");
      var v = vParent.childNodes[0];
      if (~v.className.indexOf("li_unchecked")) {
        v.className = v.className.replace("li_unchecked", "li_checked");
      }
      hideMenu(menuName);
      break;
    case "menu_uncheck_f":
      uncheckAll("food_pg");
      foodsObj = {};
      buildFoodInfo();
      hideMenu(menuName);
      break;
    case "menu_search_c":
    case "menu_search_f":
      hideMenu(menuName);
      showSrch();
      break;
    case "menu_sort_c":
    case "menu_sort_f":
      hideMenu(menuName);
      showSort();
      break;
  }
}
function showMenu(menuName) {
  var sm = document.getElementById(menuName);
  sm.className = sm.className.replace("slide_down", "slide_up");
  menuFlg = true;
}
function hideMenu(menuName) {
  var sm = document.getElementById(menuName);
  sm.className = sm.className.replace("slide_up", "slide_down");
  menuFlg = false;
}
function showNutrients() {
  // if nutrients do not fit into div, add scroll (landscape orientation)
  document.getElementById("div_nutrients").style.display = "block";
  showPieChart();
  checkPopupSize("div_nutrients_container", "nut_scroller");
  menuFlg = true;
}
function hideNutrients() {
  document.getElementById("div_nutrients").style.display = "none";
  menuFlg = false;
}
function showPieChart() {
  // calculate percentages of fat, carbs, and protein
  var pctObj = calcPcts();
  if (pctObj.fPct == 0 && pctObj.cPct == 0 && pctObj.pPct == 0) {
    // just set up as 1/3, 1/3, 1/3 if no nutrients
    pctObj.fPct = 0.33;
    pctObj.cPct = 0.33;
    pctObj.pPct = 0.33;
  }
  drawPieChart(200, 150, 44, 40, pctObj.fPct, pctObj.cPct, pctObj.pPct);
}
function calcPcts() {
  // calc pct of total calories using the following calorie amts for each type
  // cannot use total calories of food as it may not include insoluble carbs
  // fat = 9 cals, carbs = 4, protein = 4
  var pctObj = {};
  var calcCals = nutrients[1] * 9 + nutrients[2] * 4 + nutrients[4] * 4;
  pctObj.fPct = nutrients[1] ? (nutrients[1] * 9) / calcCals : 0;
  pctObj.cPct = nutrients[2] ? (nutrients[2] * 4) / calcCals : 0;
  pctObj.pPct = nutrients[4] ? (nutrients[4] * 4) / calcCals : 0;
  return pctObj;
}
function clickNutLi(thisLi) {
  if (thisLi.className == "nut_selected") return;
  thisLi.className = "nut_selected";
  if (thisLi.id == "li_left") {
    document.getElementById("chart").style.display = "none";
    document.getElementById("totals").style.display = "block";
    document.getElementById("li_right").className = "nut_unselected";
  } else {
    document.getElementById("totals").style.display = "none";
    document.getElementById("chart").style.display = "block";
    document.getElementById("li_left").className = "nut_unselected";
  }
}
function nutPressed(thisLi) {
  if (thisLi.className == "nut_selected") return;
  thisLi.className = "nut_pressed";
}
function nutReleased(thisLi) {
  if (thisLi.className == "nut_selected") return;
  thisLi.className = "nut_unselected";
}
function showHelp(pgNum) {
  // set up variables to determine Help text
  var catsList = "";
  for (var catIds in catsObj) {
    if (catsList != "") catsList += "*" + catIds;
    else catsList = catIds;
  }
  var containDiv, scrollDiv;
  switch (pgNum) {
    default:
    case 0:
      popupDiv = "rest_help";
      containerDiv = "rest_help_container";
      scrollDiv = "rest_help_scroller";
      restId = "";
      // nothing to add to helpArgs
      break;
    case 1:
      popupDiv = "cats_help";
      containerDiv = "cats_help_container";
      scrollDiv = "cats_help_scroller";
      restId = document.form_cats.rest_id.value;
      break;
    case 2:
      popupDiv = "food_help";
      containerDiv = "food_help_container";
      scrollDiv = "food_help_scroller";
      restId = document.form_foods.rest_id.value;
  }
  var helpDiv = document.getElementById(popupDiv);
  if (window.getComputedStyle(helpDiv, "").display == "block") {
    hideHelp(popupDiv);
    return;
  }
  if (menuFlg || srchFlg) return;
  // get Help text
  helpText = getHelpText(pgNum, restId, catsList);
  document.getElementById(scrollDiv).innerHTML = helpText;
  document.getElementById(popupDiv).style.display = "block";
  checkPopupSize(containerDiv, scrollDiv);
  menuFlg = true;
}
function hideHelp(divId) {
  var nutDiv = document.getElementById(divId);
  if (myScroll[divId]) {
    myScroll[divId].destroy();
    myScroll[divId] = null;
  }
  nutDiv.style.display = "none";
  menuFlg = false;
}
function showSrch() {
  var sd = document.getElementById("search_div");
  sd.className = sd.className.replace("slide_srch_up", "slide_srch_down");
  var txt = document.getElementById("search_text");
  txt.focus();
  srchFlg = true;
}
function hideSrch() {
  var sd = document.getElementById("search_div");
  sd.className = sd.className.replace("slide_srch_down", "slide_srch_up");
  srchFlg = false;
  setTimeout(function () {
    document.body.style.height = window.innerHeight + 1 + "px";
    if (iosFlg) window.scrollTo(0, 0);
    else window.scrollTo(0, 1);
  }, 600);
}
function runSrch() {
  // get value of text
  var srchTxt = document.getElementById("search_text").value;
  hideSrch();
  loadFoods(srchTxt);
  document.activeElement.blur();
  return false;
}
function showSort() {
  var sortBox = getSortBox();
  var sbd = document.getElementById("sort_box_div");
  sbd.innerHTML = sortBox;
  if (iosFlg) {
    sbd.style.height = "90%";
    sbd.style.top = "5%";
  }
  sbd.style.display = "block";
  checkPopupSize("sort_container", "sort_scroller");
  // steal srchFlg for generic popup flg
  srchFlg = true;
}
function hideSort(oldSortBy) {
  var sbd = document.getElementById("sort_box_div");
  sbd.style.display = "none";
  srchFlg = false;
  if (curPage == 2 && oldSortBy != sortBy) runSort();
}
function runSort() {
  // we are on the foods page and need to sort foods
  var srchTxt = document.form_foods.search_text.value;
  if (srchTxt) loadFoods(srchTxt);
  else loadFoods();
}
function getSortBox() {
  var sortBox = "<h3>Sort By</h3>";
  sortBox += '<div id="sort_container"><div id="sort_scroller">';
  sortBox += '<ul name="sort_ul">';
  for (var i = 0; i < sortFlds.length; i++) {
    sortBox += '<li id="radio_' + i + '" onClick="clickRadio(' + i + ')" ';
    if (sortBy == i) sortBox += ' class="radio_on" ';
    else sortBox += ' class="radio_off" ';
    sortBox +=
      'ontouchstart="radioPressed(this,' +
      i +
      ')" ontouchend="radioReleased(this,' +
      i +
      ')" ';
    sortBox +=
      ' onmousedown="radioPressed(this,' +
      i +
      ')" onmouseup="radioReleased(this,' +
      i +
      ')" ';
    sortBox += ">" + sortFlds[i].display + "</li>";
  }
  sortBox +=
    '</ul></div></div>\
		<div class="div_close">\
			<button class="close_but" onclick="hideSort(' +
    sortBy +
    ');">Close</button>\
		</div>';
  return sortBox;
}
function clickRadio(sortI) {
  if (sortI != sortBy) {
    document.getElementById("radio_" + sortI).className = "radio_on";
    document.getElementById("radio_" + sortBy).className = "radio_off";
    sortBy = sortI;
    setSortCookie();
  }
}
function checkPopupSize(containerDiv, scrollDiv) {
  var nutDiv = document.getElementById(containerDiv);
  var nutScroll = document.getElementById(scrollDiv);
  if (myScroll[containerDiv]) {
    myScroll[containerDiv].destroy();
    myScroll[containerDiv] = null;
  }
  var ndh = parseInt(window.getComputedStyle(nutDiv, "").height);
  var nsh = parseInt(window.getComputedStyle(nutScroll, "").height);
  if (nsh > ndh) {
    myScroll[containerDiv] = setUpScroll(containerDiv);
  }
}
function uncheckAll(pgName) {
  var pg = document.getElementById(pgName);
  var lis = pg.getElementsByClassName("li_checked");
  var liCnt = lis.length;
  // live nodelist so just always use index[0] and it will remove it every iteration
  for (var i = 0; i < liCnt; i++) {
    lis[0].className = lis[0].className.replace("li_checked", "li_unchecked");
  }
}
function buttonPress(thisBut) {
  if (menuFlg || srchFlg) return;
  thisBut.style[vendor + "BorderImage"] =
    "url('../images/back_button_clicked.png') 0 8 0 8";
}
function buttonRelease(thisBut) {
  if (menuFlg || srchFlg) return;
  thisBut.style[vendor + "BorderImage"] =
    "url('../images/back_button.png') 0 8 0 8";
}
function liPressed(thisLi) {
  if (menuFlg || srchFlg) return;
  let gradientCode;
  // get gradient css code for correct vendor
  // if (vendor == "webkit")
  // 	gradientCode = "linear-gradient(linear, left top, left bottom, from(#ccc), to(#aaa))";
  // else
  // 	gradientCode = "-"+vendor.toLowerCase()+"-linear-gradient(top, #ccc, #aaa)";

  gradientCode = "linear-gradient(#ccc, #aaa)";

  var chkDiv = thisLi.childNodes[0]; // checkbox
  var txtDiv = thisLi.childNodes[1]; // food description
  if (chkDiv.className.indexOf("li_unchecked") > -1)
    chkDiv.className = chkDiv.className.replace(
      "li_unchecked",
      "li_uncheck_pressed"
    );
  else
    chkDiv.className = chkDiv.className.replace(
      "li_checked",
      "li_check_pressed"
    );

  txtDiv.style.background = gradientCode;
}
function liReleased(thisLi) {
  if (menuFlg || srchFlg) return;
  let gradientCode;
  // get gradient css code for correct vendor
  // if (vendor == "webkit")
  // 	gradientCode = "-webkit-gradient(linear, left top, left bottom, from(#eee), to(#ddd))";
  // else
  // 	gradientCode = "-"+vendor.toLowerCase()+"-linear-gradient(top, #eee, #ddd)";

  gradientCode = "linear-gradient(#eee, #ddd)";

  var chkDiv = thisLi.childNodes[0]; // checkbox
  var txtDiv = thisLi.childNodes[1]; // food description
  if (chkDiv.className.indexOf("li_uncheck_pressed") > -1)
    chkDiv.className = chkDiv.className.replace(
      "li_uncheck_pressed",
      "li_unchecked"
    );
  else
    chkDiv.className = chkDiv.className.replace(
      "li_check_pressed",
      "li_checked"
    );

  txtDiv.style.background = gradientCode;
}
function restPressed(thisLi) {
  if (menuFlg || srchFlg) return;
  thisLi.className = " li_link_pressed ";
}
function restReleased(thisLi) {
  if (menuFlg || srchFlg) return;
  thisLi.className = " li_link ";
}
function radioPressed(thisLi, sortI) {
  if (sortI == sortBy) thisLi.className = " radio_on_pressed ";
  else thisLi.className = " radio_off_pressed ";
}
function radioReleased(thisLi, sortI) {
  if (sortI == sortBy) thisLi.className = " radio_on ";
  else thisLi.className = " radio_off ";
}
function menuPressed(thisMenu) {
  thisMenu.style.backgroundColor = "gray";
  if (thisMenu.id == "menu_loadfoods")
    document.getElementById("menu_loadfoods_arrow").style.backgroundColor =
      "gray";
  if (thisMenu.id == "menu_loadfoods_arrow")
    document.getElementById("menu_loadfoods").style.backgroundColor = "gray";
}
function menuReleased(thisMenu) {
  thisMenu.style.backgroundColor = "black";
  if (thisMenu.id == "menu_loadfoods")
    document.getElementById("menu_loadfoods_arrow").style.backgroundColor =
      "black";
  if (thisMenu.id == "menu_loadfoods_arrow")
    document.getElementById("menu_loadfoods").style.backgroundColor = "black";
}
function getSortCookie() {
  // if sortBy cookie exists, set sortBy
  var cookies = document.cookie;
  var pos = cookies.indexOf("sortBy=");
  if (pos != -1) {
    sortBy = cookies.substring(pos + 7, pos + 8);
  }
}
function setSortCookie() {
  document.cookie = "sortBy=" + sortBy + "; max-age=" + 60 * 60 * 24 * 365;
}
function showZ() {
  for (var i = 0; i < pgs.length; i++) {
    el = document.getElementById(pgs[i]);
    alert(pgs[i] + " : " + window.getComputedStyle(el, "").zIndex);
  }
}
function showClass() {
  for (var i = 0; i < pgs.length; i++) {
    el = document.getElementById(pgs[i]);
    alert(pgs[i] + " : " + el.className);
  }
}
function showLocs() {
  var rp = document.getElementById("ul_rest");
  var drl = document.getElementById("div_rest_list");
  //alert("innerHeight: " + window.innerHeight);
  alert(
    "rp height: " +
      window.getComputedStyle(rp, "").height +
      "\nrp vis: " +
      window.getComputedStyle(rp, "").visibility
  );
  alert(
    "drl height: " +
      window.getComputedStyle(drl, "").height +
      "\ndrl top: " +
      window.getComputedStyle(drl, "").top
  );
}
function loadDebug(descText) {
  var tm = Date.now();
  dObj = {};
  dObj.codeDesc = descText;
  dObj.scrollY = window.scrollY;
  dObj.screenY = window.screenY;
  dObj.innerWidth = window.innerWidth;
  dObj.clientHeight = document.documentElement.clientHeight;
  dObj.innerHeight = window.innerHeight;
  dObj.outerHeight = window.outerHeight;
  dObj.screenHeight = window.screen.height;
  debugObj[tm] = dObj;
}
function showDebug() {
  for (tm in debugObj) {
    var outStr = tm + "\nCode: " + debugObj[tm].codeDesc;
    outStr += "\nscrollY: " + debugObj[tm].scrollY;
    outStr += "\nscreenY: " + debugObj[tm].screenY;
    outStr += "\nclientHeight: " + debugObj[tm].clientHeight;
    outStr +=
      "\ninnerHeight: " +
      debugObj[tm].innerHeight +
      "\nouterHeight: " +
      debugObj[tm].outerHeight;
    outStr += "\nscreen.height: " + debugObj[tm].screenHeight;
    outStr += "\ninnerWidth: " + debugObj[tm].innerWidth;
    alert(outStr);
  }
}
