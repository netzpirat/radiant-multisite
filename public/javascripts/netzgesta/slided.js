/**
 * slided.js 1.32 (21-Mar-2009)
 * (c) by Christian Effenberger 
 * All Rights Reserved
 * Source: slided.netzgesta.de
 * Distributed under Netzgestade Software License Agreement
 * http://www.netzgesta.de/cvi/LICENSE.txt
 * License permits free of charge
 * use on non-commercial and 
 * private web sites only 
**/

var tmp = navigator.appName == 'Microsoft Internet Explorer' && navigator.userAgent.indexOf('Opera') < 1 ? 1 : 0;
if(tmp) var isIE = document.namespaces ? 1 : 0;

if(isIE) {
	if(document.namespaces['v']==null) {
		var e=["shape","shapetype","group","background","path","formulas","handles","fill","stroke","shadow","textbox","textpath","imagedata","line","polyline","curve","roundrect","oval","rect","arc","image"],s=document.createStyleSheet(); 
		for(var i=0; i<e.length; i++) {s.addRule("v\\:"+e[i],"behavior: url(#default#VML);");} document.namespaces.add("v","urn:schemas-microsoft-com:vml");
	}
}

function getImages(className){
	var children = document.getElementsByTagName('img'); 
	var elements = new Array(); var i = 0;
	var child; var classNames; var j = 0;
	for (i=0;i<children.length;i++) {
		child = children[i];
		classNames = child.className.split(' ');
		for (var j = 0; j < classNames.length; j++) {
			if (classNames[j] == className) {
				elements.push(child);
				break;
			}
		}
	}
	return elements;
}

function getClasses(classes,string){
	var temp = '';
	for (var j=0;j<classes.length;j++) {
		if (classes[j] != string) {
			if (temp) {
				temp += ' '
			}
			temp += classes[j];
		}
	}
	return temp;
}

function getClassValue(classes,string){
	var temp = 0; var pos = string.length;
	for (var j=0;j<classes.length;j++) {
		if (classes[j].indexOf(string) == 0) {
			temp = Math.min(classes[j].substring(pos),100);
			break;
		}
	}
	return Math.max(0,temp);
}

function getClassColor(classes,string){
	var temp = 0; var str = ''; var pos = string.length;
	for (var j=0;j<classes.length;j++) {
		if (classes[j].indexOf(string) == 0) {
			temp = classes[j].substring(pos);
			str = '#' + temp.toLowerCase();
			break;
		}
	}
	if(str.match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i)) {
		return str;
	}else {
		return 0;
	}
}

function getClassAttribute(classes,string){
	var temp = 0; var pos = string.length;
	for (var j=0;j<classes.length;j++) {
		if (classes[j].indexOf(string) == 0) {
			temp = 1; break;
		}
	}
	return temp;
}

function roundedRect(ctx,x,y,width,height,radius,nopath){
	if (!nopath) ctx.beginPath();
	ctx.moveTo(x,y+radius);
	ctx.lineTo(x,y+height-radius);
	ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
	ctx.lineTo(x+width-radius,y+height);
	ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
	ctx.lineTo(x+width,y+radius);
	ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
	ctx.lineTo(x+radius,y);
	ctx.quadraticCurveTo(x,y,x,y+radius);
	if (!nopath) ctx.closePath();
}

function addRadialStyle(ctx,x1,y1,r1,x2,y2,r2,opacity) {
	var tmp = ctx.createRadialGradient(x1,y1,r1,x2,y2,r2);
	var opt = Math.min(parseFloat(opacity+0.1),1.0);
	tmp.addColorStop(0,'rgba(0,0,0,'+opt+')');
	tmp.addColorStop(0.25,'rgba(0,0,0,'+opacity+')');
	tmp.addColorStop(1,'rgba(0,0,0,0)');
	return tmp;
}

function addLinearStyle(ctx,x,y,w,h,opacity) {
	var tmp = ctx.createLinearGradient(x,y,w,h);
	var opt = Math.min(parseFloat(opacity+0.1),1.0);
	tmp.addColorStop(0,'rgba(0,0,0,'+opt+')');
	tmp.addColorStop(0.25,'rgba(0,0,0,'+opacity+')');
	tmp.addColorStop(1,'rgba(0,0,0,0)');
	return tmp;
}

function addShadowing(ctx,x,y,width,height,radius,opacity){
	var style; var os = radius/2;
	ctx.beginPath();
  	ctx.rect(x+radius,y,width-(radius*2),os);
	ctx.closePath();
	style = addLinearStyle(ctx,x+radius,y+os,x+radius,y,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath();
	ctx.rect(x,y,radius,radius);
	ctx.closePath();
	style = addRadialStyle(ctx,x+radius,y+radius,radius-os,x+radius,y+radius,radius,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath();
	ctx.rect(x,y+radius,os,height-(radius*2));
	ctx.closePath();
	style = addLinearStyle(ctx,x+os,y+radius,x,y+radius,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath();
	ctx.rect(x,y+height-radius,radius,radius);
	ctx.closePath();
	style = addRadialStyle(ctx,x+radius,y+height-radius,radius-os,x+radius,y+height-radius,radius,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath();
	ctx.rect(x+radius,y+height-os,width-x-(radius*2),os);
	ctx.closePath();
	style = addLinearStyle(ctx,x+radius,y+height-os,x+radius,y+height,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath(); 
	ctx.rect(width-radius,height-radius,x+radius,y+radius);
	ctx.closePath();
	style = addRadialStyle(ctx,width-radius,height-radius,radius-os+x,width-radius,height-radius,y+radius,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath();
	ctx.rect(x+width-os,y+radius,os,height-y-(radius*2));
	ctx.closePath();
	style = addLinearStyle(ctx,x+width-os,y+radius,x+width,y+radius,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath();
	ctx.rect(x+width-radius,y,radius,radius);
	ctx.closePath();
	style = addRadialStyle(ctx,x+width-radius,y+radius,radius-os,x+width-radius,y+radius,radius,opacity);
	ctx.fillStyle = style;
	ctx.fill();
}

function addLinearShine(ctx,x,y,w,h,opacity) {
	var tmp = ctx.createLinearGradient(x,y,w,h);
	var opt = Math.min(parseFloat(opacity+0.1),1.0);
	tmp.addColorStop(0,'rgba(254,254,254,0)');
	tmp.addColorStop(0.75,'rgba(254,254,254,'+opt+')');
	tmp.addColorStop(1,'rgba(254,254,254,'+opacity+')');
	return tmp;
}

function addRadialShine(ctx,x1,y1,r1,x2,y2,r2,opacity) {
	var tmp = ctx.createRadialGradient(x1,y1,r1,x2,y2,r2);
	var opt = Math.min(parseFloat(opacity+0.1),1.0);
	tmp.addColorStop(0,'rgba(254,254,254,0)');
	tmp.addColorStop(0.75,'rgba(254,254,254,'+opt+')');
	tmp.addColorStop(1,'rgba(254,254,254,'+opacity+')');
	return tmp;
}

function addLinearShade(ctx,x,y,w,h,opacity) {
	var tmp = ctx.createLinearGradient(x,y,w,h);
	var opac = Math.max(parseFloat(opacity/1.6),0.1);
	var opt = Math.max(parseFloat(opac-0.1),0.05);
	tmp.addColorStop(0,'rgba(0,0,0,0)');
	tmp.addColorStop(0.75,'rgba(0,0,0,'+opt+')');
	tmp.addColorStop(1,'rgba(0,0,0,'+opac+')');
	return tmp;
}

function addRadialShade(ctx,x1,y1,r1,x2,y2,r2,opacity) {
	var tmp = ctx.createRadialGradient(x1,y1,r1,x2,y2,r2);
	var opac = Math.max(parseFloat(opacity/1.6),0.1);
	var opt = Math.max(parseFloat(opac-0.1),0.05);
	tmp.addColorStop(0,'rgba(0,0,0,0)');
	tmp.addColorStop(0.75,'rgba(0,0,0,'+opt+')');
	tmp.addColorStop(1,'rgba(0,0,0,'+opac+')');
	return tmp;
}

function addShadeing(ctx,x,y,width,height,radius,opacity){
	var style; var os = radius/2;
	ctx.beginPath();
	ctx.rect(x+radius,y,width-radius,y+os);
	ctx.closePath();
	style = addLinearShine(ctx,x+radius,y+os,x+radius,y,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath();
	ctx.rect(x,y,radius,radius);
	ctx.closePath();
	style = addRadialShine(ctx,x+radius,y+radius,radius-os,x+radius,y+radius,radius,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath();
	ctx.rect(x,y+radius,os,height-radius);
	ctx.closePath();
	style = addLinearShine(ctx,x+os,y+radius,x,y+radius,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath();
	ctx.rect(x,y+height-os,width-radius,os);
	ctx.closePath();
	style = addLinearShade(ctx,x+radius,y+height-os,x+radius,y+height,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath(); 
	ctx.rect(x+width-radius,y+height-radius,radius,radius);
	ctx.closePath();
	style = addRadialShade(ctx,x+width-radius,y+height-radius,radius-os,x+width-radius,y+height-radius,radius,opacity);
	ctx.fillStyle = style;
	ctx.fill();
	ctx.beginPath();
	ctx.rect(x+width-os,y,os,height-radius);
	ctx.closePath();
	style = addLinearShade(ctx,x+width-os,y+radius,x+width,y+radius,opacity);
	ctx.fillStyle = style;
	ctx.fill();
}

function addTextFrame(ctx,x,y,width,height,opacity,vertical) {
	var style, radius, opac = Math.max(parseFloat(opacity/2),0.1);
	ctx.lineWidth = 1; 
	if(vertical) {
		radius = width/2;
		ctx.beginPath(); 
		ctx.moveTo(x,y+height-radius);
		ctx.lineTo(x,y+radius);
		ctx.quadraticCurveTo(x,y,x+radius,y);
		ctx.quadraticCurveTo(x+width,y,x+width,y+radius);
		style = ctx.createLinearGradient(x,y,x+width,y);
		style.addColorStop(0,'rgba(0,0,0,'+opac+')');
		style.addColorStop(0.8,'rgba(0,0,0,'+opac+')');
		style.addColorStop(1,'rgba(254,254,254,'+opac+')');
		ctx.strokeStyle = style;
		ctx.stroke();
		ctx.beginPath(); 
		ctx.moveTo(x+width,y+radius);
		ctx.lineTo(x+width,y+height-radius);
		ctx.quadraticCurveTo(x+width,y+height,x+radius,y+height);
		ctx.quadraticCurveTo(x,y+height,x,y+height-radius);
		style = ctx.createLinearGradient(x,y,x+width,y);
		style.addColorStop(0,'rgba(0,0,0,'+opac+')');
		style.addColorStop(0.2,'rgba(254,254,254,'+opac+')');
		style.addColorStop(1,'rgba(254,254,254,'+opac+')');
		ctx.strokeStyle = style;
		ctx.stroke();
	}else {
		radius = height/2;
		ctx.beginPath(); 
		ctx.moveTo(x+width-radius,y);
		ctx.lineTo(x+radius,y);
		ctx.quadraticCurveTo(x,y,x,y+radius);
		ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
		style = ctx.createLinearGradient(x,y,x,y+height);
		style.addColorStop(0,'rgba(0,0,0,'+opac+')');
		style.addColorStop(0.8,'rgba(0,0,0,'+opac+')');
		style.addColorStop(1,'rgba(254,254,254,'+opac+')');
		ctx.strokeStyle = style;
		ctx.stroke();
		ctx.beginPath(); 
		ctx.moveTo(x+radius,y+height);
		ctx.lineTo(x+width-radius,y+height);
		ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
		ctx.lineTo(x+width,y+radius);
		ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
		style = ctx.createLinearGradient(x,y,x,y+height);
		style.addColorStop(0,'rgba(0,0,0,'+opac+')');
		style.addColorStop(0.2,'rgba(254,254,254,'+opac+')');
		style.addColorStop(1,'rgba(254,254,254,'+opac+')');
		ctx.strokeStyle = style;
		ctx.stroke();
	}
}

function addFraming(ctx,x,y,width,height,wide,opacity) {
	var style; wide = Math.max(wide,2);
	var opac = Math.max(parseFloat(opacity/1.6),0.1);
	style = ctx.createLinearGradient(x,y,x,y-wide);
	style.addColorStop(0,'rgba(0,0,0,'+opac+')');
	style.addColorStop(1,'rgba(0,0,0,0)');
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.lineTo(x-wide,y-wide);
	ctx.lineTo(x+width+wide,y-wide);
	ctx.lineTo(x+width,y);
	ctx.closePath();
	ctx.fillStyle = style;
	ctx.fill();
	style = ctx.createLinearGradient(x,y,x-wide,y);
	style.addColorStop(0,'rgba(0,0,0,'+opac+')');
	style.addColorStop(1,'rgba(0,0,0,0)');
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.lineTo(x-wide,y-wide);
	ctx.lineTo(x-wide,y+height+wide);
	ctx.lineTo(x,y+height);
	ctx.closePath();
	ctx.fillStyle = style;
	ctx.fill();
	style = ctx.createLinearGradient(x,y+height,x,y+height+wide);
	style.addColorStop(0,'rgba(254,254,254,'+opacity+')');
	style.addColorStop(1,'rgba(254,254,254,0)');
	ctx.beginPath();
	ctx.moveTo(x,y+height);
	ctx.lineTo(x-wide,y+height+wide);
	ctx.lineTo(x+width+wide,y+height+wide);
	ctx.lineTo(x+width,y+height);
	ctx.closePath();
	ctx.fillStyle = style;
	ctx.fill();
	style = ctx.createLinearGradient(x+width,y,x+width+wide,y);
	style.addColorStop(0,'rgba(254,254,254,'+opacity+')');
	style.addColorStop(1,'rgba(254,254,254,0.0)');
	ctx.beginPath();
	ctx.moveTo(x+width,y+height);
	ctx.lineTo(x+width+wide,y+height+wide);
	ctx.lineTo(x+width+wide,y-wide);
	ctx.lineTo(x+width,y);
	ctx.closePath();
	ctx.fillStyle = style;
	ctx.fill();
}

function addCircles(ctx,x,y,width,height,radius,opacity) {
	var style = '';	var opac = Math.max(parseFloat(opacity/1.6),0.1);
	ctx.lineWidth = Math.max(radius/8,1); 
	ctx.beginPath();
	ctx.arc(x+radius,y+radius,radius/4,0,Math.PI*2,true);
	style = ctx.createLinearGradient(x+(radius*0.75),y+(radius*0.75),x+(radius*1.2),y+(radius*1.2));
	style.addColorStop(0,'rgba(0,0,0,'+opac+')');
	style.addColorStop(1,'rgba(254,254,254,'+opacity+')');
	ctx.strokeStyle = style;
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(x+width-radius,y+radius,radius/4,0,Math.PI*2,true);
	style = ctx.createLinearGradient(x+width-(radius*1.25),y+(radius*0.75),x+width-(radius*0.725),y+(radius*1.2));
	style.addColorStop(0,'rgba(0,0,0,'+opac+')');
	style.addColorStop(1,'rgba(254,254,254,'+opacity+')');
	ctx.strokeStyle = style;
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(x+radius,y+height-radius,radius/4,0,Math.PI*2,true);
	style = ctx.createLinearGradient(x+(radius*0.75),y+height-(radius*1.25),x+(radius*1.2),y+height-(radius*0.725));
	style.addColorStop(0,'rgba(0,0,0,'+opac+')');
	style.addColorStop(1,'rgba(254,254,254,'+opacity+')');
	ctx.strokeStyle = style;
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(x+width-radius,y+height-radius,radius/4,0,Math.PI*2,true);
	style = ctx.createLinearGradient(x+width-(radius*1.25),y+height-(radius*1.25),x+width-(radius*0.725),y+height-(radius*0.725));
	style.addColorStop(0,'rgba(0,0,0,'+opac+')');
	style.addColorStop(1,'rgba(254,254,254,'+opacity+')');
	ctx.strokeStyle = style;
	ctx.stroke();
}

function addIESlides() {
	var theimages = getImages('slided');
	var image; var object; var vml; var context; var i;
	var iradius = 10; var sradius = null; var noshadow = 0;
	var ibgcolor = null; var igradient = null; var horizontal = 0;
	var ishade = null; var ishadow = null; var vertical = 0; 
	var itxttitle; var itxtalt; var itxtcol; var text=""; 
	var size = 0; var width = 0; var height = 0; var wide = 1;
	var inset = 0; var offset = 0; var nocircles = 0; deep = 0;
	var style = ''; var classes = ''; var newClasses = ''; 
	var xoff = 0; var yoff = 0; var pos = 0; var whf = 1;
	var iw = 0; var ih = 0; var iy = 0; var ix = 0; var ff = 1;
	var display = null; var xradius = null; var angle; var flt;
	var head; var foot; var fill; var shade; var tmp; var rus;
	var tcolor,txt,th,tw,io;
	for(i=0;i<theimages.length;i++) {	
		image = theimages[i]; object = image.parentNode; 
		itxtalt = 0; itxttitle = 0; text=""; tcolor = '#000000';
		head = ''; foot = ''; fill = ''; shade = ''; shadow = ''; txt = ''; tmp = '';
		if(image.width>=80 || image.height>=80) {
			classes = image.className.split(' '); 
			horizontal = 0; vertical = 0; igradient = 0; ibgcolor = 0;
			nocircles = 0; noshadow = 0; ishadow = 0.4; ishade = 0.5; 
			size = Math.max(image.width,image.height);
			ishade = getClassValue(classes,"ishade");
			ishadow = getClassValue(classes,"ishadow");
			ibgcolor = getClassColor(classes,"ibgcolor");
			igradient = getClassColor(classes,"igradient");
			itxtcol = getClassColor(classes,"itxtcol");
			if(itxtcol!=0) tcolor = itxtcol;
			itxttitle = getClassAttribute(classes,"itxttitle");
			itxtalt = getClassAttribute(classes,"itxtalt");
			noshadow = getClassAttribute(classes,"noshadow");
			nocircles = getClassAttribute(classes,"nocircles");
			vertical = getClassAttribute(classes,"vertical");
			horizontal = getClassAttribute(classes,"horizontal");
			newClasses = getClasses(classes,"slided");
			ishade = ishade==0?50:ishade;
			ishadow = ishadow==0?40:ishadow;
			if(noshadow<1) {
				sradius = iradius*0.75; radius = sradius; sradius = radius*0.75;
				offset = Math.round((size/iradius)/4); inset = offset; pos = offset*3; 
				wide = offset; deep = Math.round(pos/2.5); rus = Math.round(pos/4);
				shadow = '<v:roundrect arcsize="' + iradius + '%" strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="filter:Alpha(opacity=' + ishadow + '), progid:dxImageTransform.Microsoft.Blur(PixelRadius=' + inset + ', MakeShadow=false); zoom:1;margin:-1px 0 0 -1px;padding: 0;display:block;position:absolute;top:' + inset + 'px;left:' + inset + 'px;width:' + (size-(2*inset)) + 'px;height:' + (size-(2*inset)) + 'px;"><v:fill color="#000000" opacity="1" /></v:roundrect>';
				tmp = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="zoom:1;margin:-1px 0 0 -1px;padding: 0;display:block;position:absolute;top:0px;left:0px;width:' + size + 'px;height:' + size + 'px;"><v:fill color="#ffffff" opacity="0.0" /></v:rect>';
			}else {
				radius = iradius; sradius = iradius*0.75; inset = 0; 
				offset = Math.round((size/iradius)/4); pos = offset*4; 
				wide = offset; deep = Math.round(pos/2.5); rus = offset;
			}
			if(isNaN(ibgcolor)) {
				fill = '<v:roundrect arcsize="' + radius + '%" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="zoom:1;margin:-1px 0 0 -1px;padding: 0;display:block;position:absolute;top:0px;left:0px;width:' + (size-(inset*2)) + 'px;height:' + (size-(inset*2)) + 'px;">';
				if(isNaN(igradient)) {
					if(horizontal>0) {angle = 90; }else if(vertical>0) {angle = 0; }else { angle = 45; }
					fill = fill + '<v:fill method="sigma" type="gradient" angle="' + angle + '" color="' + igradient + '" color2="' + ibgcolor + '" /></v:roundrect>';
				}else {
					fill = fill + '<v:fill color="' + ibgcolor + '" /></v:roundrect>';
				}
			}
			text = image.alt!=''&&itxtalt!=0?image.alt:image.title!=''&&itxttitle!=0?image.title:'';
			shade = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="' + (size-(inset*2)) + ',' + deep + '" path="m '+pos+','+deep+' l '+(size-rus-(inset*2))+','+deep+' qy '+(size-pos-(inset*2))+',0 l '+pos+',0 qx '+rus+','+deep+' x e" style="position:absolute; margin: -1px 0 0 -1px; top: 0px; left: 0px; width:' + (size-(inset*2)) + 'px; height:' + deep + 'px;"><v:fill method="linear" type="gradient" angle="0" color="#ffffff" opacity="0%" color2="#ffffff" o:opacity2="' + ishade + '%" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="' + deep + ',' + (size-(inset*2)) + '" path="m 0,'+pos+' l 0,'+(size-pos-(inset*2))+' qy '+deep+','+(size-rus-(inset*2))+' l '+deep+','+rus+' qx 0,'+pos+' x e" style="position:absolute; margin: -1px 0 0 -1px; top: 0px; left: 0px; width:' + deep + 'px; height:' + (size-(inset*2)) + 'px;"><v:fill method="linear" type="gradient" angle="90" color="#ffffff" opacity="0%" color2="#ffffff" o:opacity2="' + ishade + '%" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="' + (size-(inset*2)) + ',' + deep + '" path="m '+pos+','+deep+' l '+(size-rus-(inset*2))+','+deep+' qy '+(size-pos-(inset*2))+',0 l '+pos+',0 qx '+rus+','+deep+' x e" style="position:absolute; margin: -1px 0 0 -1px; top:' + (size-deep-(inset*2)) +'px; left: 0px; width:' + (size-(inset*2)) + 'px; height:' + deep + 'px; flip: y;"><v:fill method="linear" type="gradient" angle="180" color="#000000" opacity="0%" color2="#000000" o:opacity2="' + ishade + '%" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="' + deep + ',' + (size-(inset*2)) + '" path="m 0,'+pos+' l 0,'+(size-pos-(inset*2))+' qy '+deep+','+(size-rus-(inset*2))+' l '+deep+','+rus+' qx 0,'+pos+' x e" style="position:absolute; margin: -1px 0 0 -1px; top: 0px; left:' + (size-deep-(inset*2)) +'px; width:' + deep + 'px; height:' + (size-(inset*2)) + 'px; flip: x;"><v:fill method="linear" type="gradient" angle="270" color="#000000" opacity="0%" color2="#000000" o:opacity2="' + ishade + '%" /></v:shape>';
			if(nocircles<1) shade = shade + '<v:oval size="'+deep+','+deep+'" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute; margin: -1px 0 0 -1px; top:'+(pos/2)+'px; left:'+(pos/2)+'px; width:'+deep+'px; height:'+deep+'px;"><v:fill method="linear" focus="1" focusposition="50%,50%" focussize="50%,50%" type="gradientradial" color="#ffffff" opacity="' + (ishade/2) + '%" color2="#000000" o:opacity2="' + ishade + '%" /></v:oval><v:oval size="'+deep+','+deep+'" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute; margin: -1px 0 0 -1px; top:'+(pos/2)+'px; left:'+(size-(inset*2)-pos)+'px; width:'+deep+'px; height:'+deep+'px;"><v:fill method="linear" focus="1" focusposition="50%,50%" focussize="50%,50%" type="gradientradial" color="#ffffff" opacity="' + (ishade/2) + '%" color2="#000000" o:opacity2="' + ishade + '%" /></v:oval><v:oval size="'+deep+','+deep+'" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute; margin: -1px 0 0 -1px; top:'+(size-(inset*2)-pos)+'px; left:'+(size-(inset*2)-pos)+'px; width:'+deep+'px; height:'+deep+'px;"><v:fill method="linear" focus="1" focusposition="50%,50%" focussize="50%,50%" type="gradientradial" color="#ffffff" opacity="' + (ishade/2) + '%" color2="#000000" o:opacity2="' + ishade + '%" /></v:oval><v:oval size="'+deep+','+deep+'" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute; margin: -1px 0 0 -1px; top:'+(size-(inset*2)-pos)+'px; left:'+(pos/2)+'px; width:'+deep+'px; height:'+deep+'px;"><v:fill method="linear" focus="1" focusposition="50%,50%" focussize="50%,50%" type="gradientradial" color="#ffffff" opacity="' + (ishade/2) + '%" color2="#000000" o:opacity2="' + ishade + '%" /></v:oval>';
			if(image.width>=image.height) {
				width = Math.round(size-(pos*2)-(inset*4));
				height = Math.round(width*0.66666667);  
				yoff = Math.round(pos+inset+((width-height)*0.5));
				xoff = Math.round(pos+inset); io = 0;
				ff = image.height/image.width;
				if(ff>=0.66666667) {
					whf = height/image.height;
					ih = height; iy = yoff; 
					iw = Math.round(image.width*whf);
					ix = xoff+((width-iw)*0.5);
				}else {
					whf = width/image.width;
					iw = width; ix = xoff;
					ih = Math.round(image.height*whf);
					iy = yoff+((height-ih)*0.5); 
				}
			}else {
				height = Math.round(size-(pos*2)-(inset*4));
				width = Math.round(height*0.66666667); 
				xoff = Math.round(pos+inset+((height-width)*0.5));
				yoff = Math.round(pos+inset); io = 1;
				ff = image.width/image.height;
				if(ff>=0.66666667) {
					whf = width/image.width;
					iw = width; ix = xoff;
					ih = Math.round(image.height*whf);
					iy = yoff+((height-ih)*0.5); 
				}else {
					whf = height/image.height;
					ih = height; iy = yoff; 
					iw = Math.round(image.width*whf);
					ix = xoff+((width-iw)*0.5);
				}
			}
			shade = shade + '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="' + (width+wide+wide) + ',' + wide + '" path="m 0,0 l '+(width+wide+wide)+',0,'+(width+wide)+','+wide+','+wide+','+wide+' x e" style="position:absolute; margin: -1px 0 0 -1px; top:' + (yoff-wide) + 'px; left:' + (xoff-wide) + 'px; width:' + (width+wide+wide) + 'px; height:' + wide + 'px;"><v:fill method="linear" type="gradient" angle="180" color="#000000" opacity="0%" color2="#000000" o:opacity2="' + ishade + '%" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="' + wide + ',' + (height+wide+wide) + '" path="m 0,0 l 0,'+(height+wide+wide)+','+wide+','+(height+wide)+','+wide+','+wide+' x e" style="position:absolute; margin: -1px 0 0 -1px; top: ' + (yoff-wide) + 'px; left:' + (xoff-wide) + 'px; width:' + wide + 'px; height:' + (height+wide+wide) + 'px;"><v:fill method="linear" type="gradient" angle="270" color="#000000" opacity="0%" color2="#000000" o:opacity2="' + ishade + '%" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="' + (width+wide+wide) + ',' + wide + '" path="m 0,'+wide+' l '+(width+wide+wide)+','+wide+','+(width+wide)+',0,'+wide+',0 x e" style="position:absolute; margin: 0; top:' + (yoff+height) + 'px; left:' + (xoff-wide) + 'px; width:' + (width+wide+wide) + 'px; height:' + wide + 'px;"><v:fill method="linear" type="gradient" angle="0" color="#ffffff" opacity="0%" color2="#ffffff" o:opacity2="' + ishade + '%" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="' + wide + ',' + (height+wide+wide) + '" path="m '+wide+',0 l '+wide+','+(height+wide+wide)+',0,'+(height+wide)+',0,'+wide+' x e" style="position:absolute; margin: 0; top:' + (yoff-wide) + 'px; left:' + (xoff+width) + 'px; width:' + wide + 'px; height:' + (height+wide+wide) + 'px;"><v:fill method="linear" type="gradient" angle="90" color="#ffffff" opacity="0%" color2="#ffffff" o:opacity2="' + ishade + '%" /></v:shape>';
			if(typeof check_strokeTextCapability=='function' && check_strokeTextCapability() && text!='') {
				if(io==1) {
					th = parseInt((size-(inset*2)-width)/4);
					text = get_widthText(text,height-offset-offset,th/2,100,100); 
					tw = get_textWidth(text,th/2,100,100);
					txt = '<v:group style="zoom:1; rotation: -90; display:' + display + '; margin:0; padding:0; position:relative; width:' + size + 'px;height:' + size + 'px;" coordsize="' + size + ',' + size + '"><v:shape filled="f" stroked="t" coordorigin="0,0" coordsize="'+height+','+th+'" path="m 0,'+parseInt(th*0.25)+' l 0,'+parseInt(th*0.5)+' c 0,'+th+',0,'+th+','+parseInt(th*0.5)+','+th+' l '+parseInt(height-(th*0.25))+','+th+' e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+(size-(inset*2)-(th*1.6))+'px;left:'+(yoff+inset+inset)+'px;width:'+height+'px;height:'+th+'px;"><v:stroke color="#ffffff" opacity="'+parseInt(ishade*0.5)+'%" weight="1" miterlimit="0" endcap="round" joinstyle="round" /></v:shape><v:shape filled="f" stroked="t" coordorigin="0,0" coordsize="'+height+','+th+'" path="m '+parseInt(th*0.25)+',0 l '+parseInt(height-(th*0.5))+',0 c '+height+',0,'+height+',0,'+height+','+parseInt(th*0.5)+' l '+height+','+parseInt(th*0.75)+' e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+(size-(inset*2)-(th*1.6))+'px;left:'+(yoff+inset+inset)+'px;width:'+height+'px;height:'+th+'px;"><v:stroke color="#000000" opacity="'+parseInt(ishade*0.5)+'%" weight="1" miterlimit="0" endcap="round" joinstyle="round" /></v:shape>'+get_strokeText(text,xoff+inset+inset+((width-tw)/2),size-(inset*2)-(th*1.4),th/2,100,100,100,"sans-serif",tcolor,1,0)+'</v:group>';
				}else {
					th = parseInt((size-(inset*2)-height)/4);
					text = get_widthText(text,width-offset-offset,th/2,100,100); 
					tw = get_textWidth(text,th/2,100,100); 
					txt = '<v:shape filled="f" stroked="t" coordorigin="0,0" coordsize="'+width+','+th+'" path="m '+width+','+parseInt(th*0.25)+' l '+width+','+parseInt(th*0.5)+' c '+width+','+th+','+width+','+th+','+parseInt(width-(th*0.5))+','+th+' l '+parseInt(th*0.25)+','+th+' e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+(size-(inset*2)-(th*1.6))+'px;left:'+xoff+'px;width:'+width+'px;height:'+th+'px;"><v:stroke color="#ffffff" opacity="'+parseInt(ishade*0.5)+'%" weight="1" miterlimit="0" endcap="round" joinstyle="round" /></v:shape><v:shape filled="f" stroked="t" coordorigin="0,0" coordsize="'+width+','+th+'" path="m 0,'+parseInt(th*0.75)+' l 0,'+parseInt(th*0.5)+' c 0,0,0,0,'+parseInt(th*0.5)+',0 l '+parseInt(width-(th*0.25))+',0 e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+(size-(inset*2)-(th*1.6))+'px;left:'+xoff+'px;width:'+width+'px;height:'+th+'px;"><v:stroke color="#000000" opacity="'+parseInt(ishade*0.5)+'%" weight="1" miterlimit="0" endcap="round" joinstyle="round" /></v:shape>'+get_strokeText(text,xoff+((width-tw)/2),size-(inset*2)-(th*1.4),th/2,100,100,100,"sans-serif",tcolor,1,0);
				}
			}
			display = (image.currentStyle.display.toLowerCase()=='block')?'block':'inline-block';        
			vml = document.createElement(['<var style="zoom:1;overflow:hidden;display:' + display + ';width:' + size + 'px;height:' + size + 'px;padding:0;">'].join(''));
			flt = image.currentStyle.styleFloat.toLowerCase();
			display = (flt=='left'||flt=='right')?'inline':display;
			head = '<v:group style="zoom:1; display:' + display + '; margin:-1px 0 0 -1px; padding:0; position:relative; width:' + size + 'px;height:' + size + 'px;" coordsize="' + size + ',' + size + '">' + tmp;
			foot = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="zoom:1;margin:-1px 0 0 -1px;padding: 0;display:block;position:absolute;top:' + yoff + 'px;left:' + xoff + 'px;width:' + width + 'px;height:' + height + 'px;"><v:fill color="#000000" opacity="1" /></v:rect><v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="zoom:1;margin:-1px 0 0 -1px;padding: 0;display:block;position:absolute;top:' + iy + 'px;left:' + ix + 'px;width:' + iw + 'px;height:' + ih + 'px;"><v:fill src="' + image.src + '" type="frame" /></v:rect></v:group>';
			vml.innerHTML = head + shadow + fill + shade + txt + foot;
			vml.className = newClasses;
			vml.style.cssText = image.style.cssText;
			vml.style.visibility = 'visible';
			vml.src = image.src; vml.alt = image.alt;
			vml.width = size; vml.height = size;
			if(image.id!='') vml.id = image.id;
			if(image.title!='') vml.title = image.title;
			if(image.getAttribute('onclick')!='') vml.setAttribute('onclick',image.getAttribute('onclick'));
			object.replaceChild(vml,image);
		}
	}
}

function addSlides() {
	var theimages = getImages('slided');
	var image; var object; var canvas; var context; var i;
	var iradius = null; var sradius = null; var noshadow = 0;
	var ibgcolor = null; var igradient = null; var horizontal = 0;
	var ishade = null; var ishadow = null; var vertical = 0;
	var itxttitle; var itxtalt; var itxtcol; var text=""; var tcolor,th,tw,io;
	var size = 0; var factor = 0.2; var width = 0; var height = 0;
	var inset = 0; var offset = 0; var nocircles = 0; var ratio = 0.66666667;
	var style = ''; var classes = ''; var newClasses = ''; 
	var xoff = 0; var yoff = 0; var pos = 0; var whf = 1; var radius;
	var iw = 0; var ih = 0; var ix = 0; var iy = 0; var ff = 1;
	for(i=0;i<theimages.length;i++) {	
		image = theimages[i]; object = image.parentNode; 
		canvas = document.createElement('canvas');
		if(canvas.getContext && (image.width>=80 || image.height>=80)) {
			classes = image.className.split(' '); text = '';
			horizontal = 0; vertical = 0; igradient = 0; ibgcolor = 0;
			nocircles = 0; noshadow = 0; ishadow = 0.4; ishade = 0.5; 
			itxtalt = 0; itxttitle = 0; text=""; tcolor = '#000000';
			size = Math.max(image.width,image.height);
			ishade = getClassValue(classes,"ishade");
			ishadow = getClassValue(classes,"ishadow");
			ibgcolor = getClassColor(classes,"ibgcolor");
			igradient = getClassColor(classes,"igradient");
			itxtcol = getClassColor(classes,"itxtcol");
			if(itxtcol!=0) tcolor = itxtcol;
			itxttitle = getClassAttribute(classes,"itxttitle");
			itxtalt = getClassAttribute(classes,"itxtalt");
			noshadow = getClassAttribute(classes,"noshadow");
			nocircles = getClassAttribute(classes,"nocircles");
			vertical = getClassAttribute(classes,"vertical");
			horizontal = getClassAttribute(classes,"horizontal");
			newClasses = getClasses(classes,"slided");
			canvas.className = newClasses;
			canvas.style.cssText = image.style.cssText;
			canvas.style.height = size+'px';
			canvas.style.width = size+'px';
			canvas.height = size; canvas.width = size;
			canvas.src = image.src; canvas.alt = image.alt;
			if(image.id!='') canvas.id = image.id;
			if(image.title!='') canvas.title = image.title;
			if(image.getAttribute('onclick')!='') canvas.setAttribute('onclick',image.getAttribute('onclick'));
			text = canvas.alt!=''&&itxtalt!=0?canvas.alt:canvas.title!=''&&itxttitle!=0?canvas.title:'';
			iradius = Math.max(Math.round((size/2)*factor),4);
			ishade = ishade==0?0.5:ishade/100;
			ishadow = ishadow==0?0.4:ishadow/100;
			if(noshadow<1) {
				iradius = Math.round(iradius/4)*4;
				offset = iradius/4; sradius = iradius*0.75;
				inset = offset; radius = sradius; 
				sradius = radius*0.75; pos = sradius;
			}else {
				radius = iradius; inset = 0; pos = iradius;
				offset = iradius/4; sradius = iradius*0.75;
			}
			if(image.width>=image.height) {
				width = canvas.width-(pos*2)-(inset*4);
				height = Math.round(width*ratio);  
				yoff = pos+inset+((width-height)*0.5);
				xoff = pos+inset; io = 0;
				ff = image.height/image.width;
				if(ff>=ratio) {
					whf = height/image.height;
					ih = height; iy = yoff; 
					iw = Math.round(image.width*whf);
					ix = xoff+((width-iw)*0.5);
				}else {
					whf = width/image.width;
					iw = width; ix = xoff;
					ih = Math.round(image.height*whf);
					iy = yoff+((height-ih)*0.5); 
				}
			}else {
				height = canvas.height-(pos*2)-(inset*4);
				width = Math.round(height*ratio); 
				xoff = pos+inset+((height-width)*0.5);
				yoff = pos+inset; io = 1;
				ff = image.width/image.height;
				if(ff>=ratio) {
					whf = width/image.width;
					iw = width; ix = xoff;
					ih = Math.round(image.height*whf);
					iy = yoff+((height-ih)*0.5); 
				}else {
					whf = height/image.height;
					ih = height; iy = yoff; 
					iw = Math.round(image.width*whf);
					ix = xoff+((width-iw)*0.5);
				}
			}
			context = canvas.getContext("2d");
			object.replaceChild(canvas,image);
			context.clearRect(0,0,canvas.width,canvas.height);
			if(noshadow<1) addShadowing(context,inset,inset,canvas.width-inset,canvas.height-inset,iradius,ishadow);
			context.save();
			if(!isNaN(ibgcolor)&&window.opera) {
				context.globalCompositeOperation = "destination-out";
				context.save();
				roundedRect(context,0,0,canvas.width-(inset*2),canvas.height-(inset*2),radius);
				context.fillStyle='rgba(0,0,0,1)'; context.fill(); context.clip(); 
				context.clearRect(0,0,canvas.width,canvas.height);
				context.restore();
				roundedRect(context,0,0,canvas.width-(inset*2),canvas.height-(inset*2),radius);
				context.clip(); context.globalCompositeOperation = "source-over";
			}else {
				roundedRect(context,0,0,canvas.width-(inset*2),canvas.height-(inset*2),radius);
				context.clip();
			}
			if(isNaN(ibgcolor)) {
				if(isNaN(igradient)) {
					if(horizontal>0) {
						style = context.createLinearGradient(0,0,canvas.width,0);
					}else if(vertical>0) {
						style = context.createLinearGradient(0,0,0,canvas.height-(inset*2));
					}else {
						style = context.createLinearGradient(0,0,canvas.width-(inset*2),canvas.height-(inset*2));
					}
					style.addColorStop(0,ibgcolor); 
					style.addColorStop(1,igradient);
					context.beginPath();
					context.rect(0,0,canvas.width,canvas.height-(inset*2));
					context.closePath();
					context.fillStyle = style;
					context.fill();
				}else {
					context.fillStyle = ibgcolor;
					context.fillRect(0,0,canvas.width,canvas.height-(inset*2));
				}
			}else {
				if(!window.opera) {context.clearRect(0,0,canvas.width,canvas.height);}
			}
			addShadeing(context,0,0,canvas.width-(inset*2),canvas.height-(inset*2),sradius,ishade);
			context.fillStyle = '#000000';
			context.fillRect(xoff,yoff,width,height);
			context.drawImage(image,ix,iy,iw,ih);
			addFraming(context,xoff,yoff,width,height,sradius/2,ishade);
			if(nocircles<1) addCircles(context,0,0,canvas.width-(inset*2),canvas.height-(inset*2),sradius,ishade);
			if(typeof set_textRenderContext=='function' && text!='') {				set_textRenderContext(context);
				if(check_textRenderContext(context)) {
					if(io==1) {
						th=parseInt((canvas.width-(inset*2)-width)/4);
						addTextFrame(context,canvas.width-(inset*2)-(th*1.6),yoff,th,height,ishade,io);
					}else {
						th=parseInt((canvas.height-(inset*2)-height)/4);
						addTextFrame(context,xoff,canvas.height-(inset*2)-(th*1.6),width,th,ishade,io);
					} 
					context.strokeStyle = tcolor;
					if(io==1) {
						text=get_widthText(text,height-offset-offset,th/2,100,100); tw=get_textWidth(text,th/2,100,100);
						context.save();
						context.rotate(-(Math.PI*90/180)); context.translate(-(canvas.width),0);
						context.strokeText(text,yoff+offset+offset+((height-tw)/2),canvas.height-(inset*2)-(th*1.4),th/2,100,100,100);
						context.restore();
					}else {
						text=get_widthText(text,width-offset-offset,th/2,100,100); tw=get_textWidth(text,th/2,100,100);
						context.strokeText(text,xoff+((width-tw)/2),canvas.height-(inset*2)-(th*1.4),th/2,100,100,100);
					}
				}
			}
			context.restore();
			canvas.style.visibility = 'visible';
		}
	}
}

var slidesOnload = window.onload;
window.onload = function () { if(slidesOnload) slidesOnload(); if(isIE){addIESlides(); }else {addSlides();}}	
