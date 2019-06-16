// piechart.js
// code to create a pie chart 
// 5-13-12  rlb

function drawPieChart(w,h, origY, radius, fPct, cPct, pPct)
{
	var origX = Math.round(w/2);
	var c=document.getElementById("pie_chart");
	c.setAttribute("width",w);
	c.setAttribute("height",h);
	var ctx=c.getContext("2d");
	ctx.strokeStyle = "#ddd";
	var pt1=2*fPct*Math.PI;
	var pt2=2*(fPct+cPct)*Math.PI;
	// draw fat pct
	ctx.fillStyle = "#77E";
	if (fPct) drawWedge(ctx, origX, origY, radius, 0, pt1);
	drawLegend(ctx, origX, origY, radius, 1, fPct, "Fat");
	// draw carb pct
	ctx.fillStyle = "#E44";
	if (cPct) drawWedge(ctx, origX, origY, radius, pt1, pt2);
	drawLegend(ctx, origX, origY, radius, 2, cPct, "Carbs");
	// draw protein pct
	ctx.fillStyle = "#4D4";
	if (pPct) drawWedge(ctx, origX, origY, radius, pt2, 0);
	drawLegend(ctx, origX, origY, radius, 3, pPct, "Protein");
}
function drawWedge(ctx, origX, origY, radius, startWedge, endWedge)
{
	ctx.beginPath();
	ctx.moveTo(origX, origY);
	ctx.arc(origX,origY,radius,startWedge,endWedge);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}
function drawLegend(ctx, origX, origY, radius, legNum, legPct, legDesc)
{
	var startY, startX;
	ctx.font = "lighter 13px Verdana";
	ctx.textBaseline = "bottom";
	var legWidth = ctx.measureText("Protein").width;
	var descWidth = ctx.measureText(legDesc).width;
	var legHeight = 12;
	switch(legNum)
	{
		case 1:
			startX = origX - radius - legWidth - 10;
			break;
		case 2:
			startX = origX - Math.round(descWidth/2);
			break;
		case 3:
			startX = origX + radius + 10;
	}
	startY = origY + radius + 15;
	// create legend rectangle
	ctx.beginPath();
	ctx.rect(startX,startY,legWidth,legHeight);
	ctx.closePath();
	ctx.fill();
	// create legend description
	ctx.strokeText(legDesc,startX,startY+legHeight+5+12);
	ctx.strokeText((legPct * 100).toFixed(1)+"%",startX,startY+legHeight+20+12);
}