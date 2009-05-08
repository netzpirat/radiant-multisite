/**
 * loupe.js 1.3 (27-Jul-2007)
 * (c) by Christian Effenberger 
 * All Rights Reserved
 * Source: loupe.netzgesta.de
 * Distributed under Netzgestade Software License Agreement
 * http://www.netzgesta.de/cvi/LICENSE.txt
 * License permits free of charge
 * use on non-commercial and 
 * private web sites only
**/

// the path to "loupe.png" must be set before loading "loupe.js" !

if(typeof loupePath=="undefined") var loupePath = "";

var imgreso = new Image;  

function roundTo(val,dig) {
	var num = val;
	if(val > 8191 && val < 10485) {
		val = val-5000;
		num = Math.round(val*Math.pow(10,dig))/Math.pow(10,dig);
		num = num+5000;
	}else {
		num = Math.round(val*Math.pow(10,dig))/Math.pow(10,dig);
	}
	return num;
}

function LoupeMouseDown(event) {
	if (!event) event = window.event;
	document.body.canvas = this;
	this.inDrag = true;
	if(event.pageX) {
		this.startX = event.pageX;
		this.startY = event.pageY;
	}else if (event.clientX) {
		this.startX = event.clientX;
		this.startY = event.clientY;
	}else {
		return;
	}
}

function LoupeMouseUp() {
	if(this.inDrag) {
		this.inDrag = false;
		document.body.canvas = null;
	}
}

function LoupePosition() {
	var ctx = this.getContext("2d");
	var image = document.getElementById(this.iName);
	var left = Math.max(this.xMin,Math.min(this.xMax,Math.round(this.xPos-this.width/2)));
	var top = Math.max(this.yMin,Math.min(this.yMax,Math.round(this.yPos-this.height/2)));
	var xSrc = Math.round(Math.min((left-this.xMin)*this.xMulti,this.cWidth-this.size));
	var ySrc = Math.round(Math.min((top-this.yMin)*this.yMulti,this.cHeight-this.size));
	this.style.left = left + "px"; this.style.top = top + "px";
	ctx.drawImage(image,xSrc,ySrc,this.size,this.size,this.xOff,this.yOff,this.size,this.size);
	if(this.crossHair) {
		ctx.strokeStyle = 'rgba(0,0,255,0.25)'; ctx.lineWidth = 1;
		ctx.beginPath(); ctx.moveTo(this.xOff+this.radius,this.yOff);
		ctx.lineTo(this.xOff+this.radius,this.yOff+this.size); ctx.closePath(); ctx.stroke();
		ctx.beginPath(); ctx.moveTo(this.xOff,this.yOff+this.radius);
		ctx.lineTo(this.xOff+this.size,this.yOff+this.radius); ctx.closePath(); ctx.stroke();
		ctx.strokeStyle = 'rgb(255,255,255)'; ctx.lineWidth = 2;
	}
	ctx.drawImage(imgreso,0,0,this.size,this.size,this.xOff,this.yOff,this.size,this.size);
	ctx.beginPath();
	ctx.moveTo(this.xOff+this.size,this.yOff+this.radius);
	ctx.arc(this.xOff+this.radius,this.yOff+this.radius,this.radius,0,Math.PI*2, false);
	ctx.closePath();
	ctx.stroke();
}

function LoupeDrag(event) {
	if(!event) event = window.event;
	var canvas = this.canvas; 
	if(canvas && canvas.inDrag) {
		var eventX; var eventY;
		if (event.pageX) {
			eventX = event.pageX;
			eventY = event.pageY;
		}else if (event.clientX) {
			eventX = event.clientX;
			eventY = event.clientY;
		}else {
			return;
		}
		canvas.xPos += eventX-canvas.startX;
		canvas.yPos += eventY-canvas.startY;
		canvas.startX = eventX;
		canvas.startY = eventY;
		canvas.position();
	}
}

function LoupeOpacity(ids, opacStart, opacEnd, millisec) {	var speed = Math.round(millisec / 100); var timer = 0;	if(opacStart > opacEnd) {		for(var i = opacStart; i >= opacEnd; i--) {			window.setTimeout("changeLoupeOpacity(" + i + ",'" + ids + "')",(timer * speed));			timer++;		}	}else if(opacStart < opacEnd) {		for(var i = opacStart; i <= opacEnd; i++) {			window.setTimeout("changeLoupeOpacity(" + i + ",'" + ids + "')",(timer * speed));			timer++;		}	}
}
function changeLoupeOpacity(opacity, ids) {	var obj = document.getElementById(ids); 
	obj.style.opacity = (opacity / 100);}
function shiftLoupeOpacity(ids, millisec) {	if(document.getElementById(ids).style.opacity != '') {		var currentOpac = document.getElementById(ids).style.opacity * 100;
	}else {
		var currentOpac = 0;
	}
	if(currentOpac == 0) {
		toggleLoupeVisibility(ids);
		LoupeOpacity(ids, currentOpac, 100, millisec);	}else if(currentOpac > 0) {
		LoupeOpacity(ids, currentOpac, 0, millisec);
		window.setTimeout("toggleLoupeVisibility('"+ids+"')",millisec);	}}

function toggleLoupeVisibility(ids) {
	var obj = document.getElementById(ids); 
	obj.style.visibility=(obj.style.visibility=='hidden'||obj.style.visibility==''?'visible':'hidden');
}
				
function createLoupe(imgname,display,xpos,ypos,ch) {
	var size = 205; var image = document.getElementById(imgname);
	if(image) image.style.cursor = 'default';
	if(image && image.width>=size && image.height>=size) {
		var width = 300; var height = 250; 
		var radius = size/2; var toggle;
		var xoff = 8; var yoff = 6; 
		var iconw = 40; var iconh = 32;
		var object = image.parentNode;
		object.style.position = 'relative';
		if(!document.getElementById(imgname + "_Switch")) {
			var toggle = document.createElement("canvas");
			toggle.id = imgname + "_Switch";
			toggle.height = iconh; toggle.width = iconw;
			toggle.left = 0; toggle.top = 0;
			toggle.title = "switch Loupe on/off";
			toggle.style.position = 'absolute';
			toggle.style.height = iconh+'px'; 
			toggle.style.width = iconw+'px';
			toggle.style.left = image.width-iconw + 'px';
			toggle.style.top = image.height-iconh + 'px';
			toggle.style.cursor = 'pointer';
			toggle.style.zindex = 9990;	
			toggle.setAttribute("onClick", "shiftLoupeOpacity('"+imgname+"_Loupe',250);");
			object.appendChild(toggle);
			var context = toggle.getContext("2d");
			context.clearRect(0,0,iconw,iconh);
			context.drawImage(imgreso,0,height-iconh,iconw,iconh,0,0,iconw,iconh);
		}
		if(!document.getElementById(imgname + "_Loupe")) {
			var canvas = document.createElement("canvas");
			canvas.id = imgname + "_Loupe";
			canvas.height = height;
			canvas.width = width;
			canvas.left = 0; canvas.top = 0;
			if(navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('Safari') < 1) {
				var xfac = roundTo(image.naturalWidth/image.width,4);
				var yfac = roundTo(image.naturalHeight/image.height,4);
				canvas.cWidth = image.naturalWidth; 
				canvas.cHeight = image.naturalHeight;
			}else {	
				var tmp = new Image; tmp.src = image.src;
				var xfac = roundTo(tmp.width/image.width,4);
				var yfac = roundTo(tmp.height/image.height,4);
				canvas.cWidth = tmp.width; 
				canvas.cHeight = tmp.height;
				delete tmp;
			}
			canvas.xMulti = xfac;
			canvas.yMulti = yfac;
			if(xpos!=null||ypos!=null) {
				var x = Math.round(xpos!=null?Math.max(1,Math.min(xpos,canvas.cWidth)):1); 
				var y = Math.round(ypos!=null?Math.max(1,Math.min(ypos,canvas.cHeight)):1); 
				canvas.xPos = ((width/2)-radius-xoff)+(x/xfac); 
				canvas.yPos = ((height/2)-radius-yoff)+(y/yfac);
			}else {
				canvas.xPos = width/2; 
				canvas.yPos = height/2;
			}
			canvas.crossHair = (ch!=1?false:true); 
			canvas.iName = imgname; 
			canvas.iWidth = image.width; 
			canvas.iHeight = image.height;
			canvas.size = size;
			canvas.radius = radius;
			canvas.xOff = xoff; 
			canvas.yOff = yoff;
			canvas.xMin = -(radius+xoff)+(radius/xfac); 
			canvas.yMin = -(radius+yoff)+(radius/yfac); 
			canvas.xMax = image.width-(radius+xoff)-(radius/xfac); 
			canvas.yMax = image.height-(radius+yoff)-(radius/yfac); 
			canvas.style.width = width+'px';
			canvas.style.height = height+'px';
			canvas.style.position = 'absolute';
			canvas.style.opacity = (display?1:0);
			canvas.style.visibility = (display?'visible':'hidden');
			canvas.style.left = 0+'px';
			canvas.style.top = 0+'px';
			canvas.style.cursor = 'move';
			canvas.style.zindex = 9999;
			canvas.onmousedown = LoupeMouseDown;
			canvas.onmouseup = LoupeMouseUp;
			document.body.onmousemove = LoupeDrag;
			canvas.position = LoupePosition;
			context = canvas.getContext("2d");
			object.appendChild(canvas);
			context.fillStyle = 'rgba(255,255,255,0)';
			context.strokeStyle = 'rgb(255,255,255)';
			context.lineWidth = 2;
			context.clearRect(0,0,canvas.width,canvas.height);
			context.drawImage(imgreso,size,0,width,height,0,0,width,height);
			globalCompositeOperation = "source-in";
			context.arc(xoff+radius,yoff+radius,radius,0,Math.PI*2, false);
			context.clip();
			context.fillRect(0,0,canvas.width,canvas.height);
			context.drawImage(imgreso,0,0,size,size,xoff,yoff,size,size);
			canvas.position();
		}
	}
}		
					
function initLoupe(id,display,xpos,ypos,ch) {
	var ctx = document.createElement("canvas");
	if(ctx.getContext) {
		if(imgreso.src.match(/loupe.png$/) && imgreso.width==505 && imgreso.height==250) {
				createLoupe(id,display,xpos,ypos,ch);
		}else {
			imgreso.onload = function() {
				if(imgreso.complete==true || (imgreso.width==505 && imgreso.height==250)) {
					createLoupe(id,display,xpos,ypos,ch);
				}
			}
			imgreso.src = loupePath + "loupe.png";
		}
	}
}