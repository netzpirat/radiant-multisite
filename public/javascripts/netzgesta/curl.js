/**
 * curl.js 1.21 (21-Mar-2009)
 * (c) by Christian Effenberger 
 * All Rights Reserved
 * Source: curl.netzgesta.de
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
			if (temp) { temp += ' '; }
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
	if(str.match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i)) {return str; }else {return 0;}
}

function getClassAttribute(classes,string){
	var temp = 0; var pos = string.length;
	for (var j=0;j<classes.length;j++) {
		if (classes[j].indexOf(string) == 0) {
			temp = 1; 
			break;
		}
	}
	return temp;
}

function clipCurl(ctx,x,y,w,h,r,i) {
	ctx.beginPath();
	ctx.moveTo(x,h); ctx.quadraticCurveTo(x+r,h,x+r,h-r); ctx.quadraticCurveTo(x+r,y+(2*r),x,y); ctx.quadraticCurveTo(x+(2*r),y+r,w-r,y+r); ctx.quadraticCurveTo(w,y+r,w,y); ctx.quadraticCurveTo(w,y+(r/2),w-(r-i),y+i); ctx.lineTo(x+i,h-(r-i)); ctx.quadraticCurveTo(x+(r/2),h,x,h);
	ctx.closePath();
}

function clipReversCurl(ctx,x,y,w,h,r,i) {
	ctx.beginPath();
	ctx.moveTo(0,0); ctx.lineTo(0,h); ctx.lineTo(x,h); ctx.quadraticCurveTo(x+r,h,x+r,h-r); ctx.quadraticCurveTo(x+r,y+(2*r),x,y); ctx.quadraticCurveTo(x+(2*r),y+r,w-r,y+r); ctx.quadraticCurveTo(w,y+r,w,y); ctx.lineTo(w,0); 
	ctx.closePath();
}

function clipInversCurl(ctx,x,y,w,h,r,i) {
	ctx.beginPath();
	ctx.moveTo(w,y); ctx.quadraticCurveTo(w,y+(r/2),w-(r-i),y+i); ctx.lineTo(x+i,h-(r-i)); ctx.quadraticCurveTo(x+(r/2),h,x,h); ctx.lineTo(w,h); 
	ctx.closePath();
}

function clipCurlShadow(ctx,x,y,w,h,r,i) {
	ctx.beginPath();
	ctx.moveTo(w,y); ctx.quadraticCurveTo(w,y+(r/2),w-(r-i),y+i); ctx.lineTo(x+i,h-(r-i)); ctx.quadraticCurveTo(x+(r/2),h,x,h); ctx.lineTo(w,h);
	ctx.closePath();
}

function curlShadow(ctx,s,r,i,o) {
	var style; var f = 1.27;
	style = ctx.createRadialGradient(i,r,0,i,r,i); style.addColorStop(0,'rgba(0,0,0,'+o+')'); style.addColorStop(1,'rgba(0,0,0,0)');
	ctx.fillStyle = style; ctx.beginPath(); ctx.rect(0,i,r,i); ctx.closePath(); ctx.fill();	
	style = ctx.createLinearGradient(0,0,r,0); style.addColorStop(0,'rgba(0,0,0,0)'); style.addColorStop(0.5,'rgba(0,0,0,'+o+')'); style.addColorStop(1,'rgba(0,0,0,0)');
	ctx.fillStyle = style; ctx.beginPath(); ctx.rect(0,i+i,r,(s*f)-i-i); ctx.closePath(); ctx.fill();
	style = ctx.createRadialGradient(i,(s*f),0,i,(s*f),i); style.addColorStop(0,'rgba(0,0,0,'+o+')'); style.addColorStop(1,'rgba(0,0,0,0)');
	ctx.fillStyle = style; ctx.beginPath(); ctx.rect(0,(s*f),r,i); ctx.closePath(); ctx.fill();
}

function addIECurl() {
	var theimages = getImages('curl');
	var image, object, vml, display, flt, classes, newClasses;  
	var i, f, t, l, ih, iw, cs, or, hs, vs, ss, hr, ir, vr, qr, xr, yr, st;  
	var isize, ishadow, icolor, invert, head, foot; 
	var shadow='', shade='', shine='', back='', fill='', strok='';
	var children = document.getElementsByTagName('img');
	for(i=0;i<theimages.length;i++) {	
		image = theimages[i]; object = image.parentNode;
		if(image.width>=64 && image.height>=64) {
			classes = image.className.split(' ');
			isize = 0; ishadow = 0; icolor = 0; invert = 0;
			isize = getClassValue(classes,"isize");
			ishadow = getClassValue(classes,"ishadow");
			icolor = getClassColor(classes,"icolor");
			invert = getClassAttribute(classes,"invert");			
			isize = isize==0?0.33:isize/100;
			ishadow = ishadow==0?0.66:ishadow/100;
			ih = image.height; iw = image.width; cs = Math.floor(Math.min(iw,ih)*isize);
			or = Math.floor(cs*0.15); hs = Math.floor(cs*0.5); vs = Math.floor(cs*0.25); 
			ss = Math.floor(or*0.3); hr = Math.floor(or*0.5); ir = Math.floor(or*0.8); 
			vr = Math.floor(or*0.25); qr = Math.round(vr*0.25); xr = Math.floor(or*0.75); yr = Math.floor(or*0.4);
			display = (image.currentStyle.display.toLowerCase()=='block')?'block':'inline-block';
			vml = document.createElement(['<var style="overflow:hidden;display:'+display+';clip:rect(0px '+iw+'px '+ih+'px 0px);width:'+iw+'px;height:'+ih+'px;padding:0;margin:0;">'].join(''));
			flt = image.currentStyle.styleFloat.toLowerCase();
			display = (flt=='left'||flt=='right')?'inline':display;
			head = '<v:group style="zoom:1;display:'+display+';margin:0;padding:0;position:relative;width:'+iw+'px;height:'+ih+'px;" coordsize="'+iw+','+ih+'"><v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="zoom:1;padding:0;position:absolute;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"><v:fill color="#ffffff" opacity="0.0" /></v:rect>';
			if(invert>0) {
				shadow = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#808080" coordorigin="0,0" coordsize="'+iw+','+ih+'" path="m 0,'+ih+' l '+(iw-cs+yr)+','+ih+' c '+(iw-cs+yr)+','+ih+','+(iw-cs+yr)+','+ih+','+(iw-cs+xr)+','+(ih-vr)+' l '+(iw-vr)+','+(ih-cs+xr)+' c '+iw+','+(ih-cs+yr)+','+iw+','+(ih-cs+yr)+','+iw+','+(ih-cs)+' l '+iw+',0,'+iw+','+ih+' x e" style="position:absolute;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"><v:fill src="'+image.src+'" type="frame" /></v:shape>'; 
				back = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+cs+','+cs+'" path="m '+hr+','+(cs-hr)+' l '+hr+','+(cs-hr-hr)+','+(cs-hr-hr)+','+hr+','+(cs-hr)+','+hr+' x e" style="position:absolute;top:'+(ih-cs+qr)+'px;left:'+(iw-cs+qr)+'px;width:'+cs+'px;height:'+cs+'px;filter:Alpha(opacity='+(ishadow*136)+'), progid:dxImageTransform.Microsoft.Blur(PixelRadius='+ss+',MakeShadow=false);"><v:fill color="#000000" /></v:shape>'; 
			}else {
				back = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#808080" coordorigin="0,0" coordsize="'+iw+','+ih+'" path="m 0,0 l 0,'+ih+' c '+(iw-cs+yr)+','+ih+','+(iw-cs+yr)+','+ih+','+(iw-cs+xr)+','+(ih-vr)+' l '+(iw-vr)+','+(ih-cs+xr)+' c '+iw+','+(ih-cs+yr)+','+iw+','+(ih-cs+yr)+','+iw+',0 x e" style="position:absolute;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"><v:fill src="'+image.src+'" type="frame" /></v:shape>'; 
				shadow = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+cs+','+cs+'" path="m '+hr+','+(cs-hr)+' l '+hr+','+hr+','+(cs-hr)+','+hr+' x e" style="position:absolute;top:'+(ih-cs+qr)+'px;left:'+(iw-cs+qr)+'px;width:'+cs+'px;height:'+cs+'px;filter:Alpha(opacity='+(ishadow*136)+'), progid:dxImageTransform.Microsoft.Blur(PixelRadius='+ss+',MakeShadow=false);"><v:fill color="#000000" /></v:shape>'; 
			}
			if(isNaN(icolor)||invert>0) {
				icolor = (!isNaN(icolor)?"#808080":icolor);
				fill = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#808080" coordorigin="0,0" coordsize="'+cs+','+cs+'" path="m 0,0 c '+ir+','+vs+','+or+','+hs+','+or+','+(cs-or)+' qy 0,'+cs+' c '+yr+','+cs+','+yr+','+cs+','+xr+','+(cs-vr)+' l '+(cs-vr)+','+xr+' c '+cs+','+yr+','+cs+','+yr+','+cs+',0 qy '+(cs-or)+','+or+' c '+hs+','+or+','+vs+','+ir+',0,0 x e" style="position:absolute;top:'+(ih-cs)+'px;left:'+(iw-cs)+'px;width:'+cs+'px;height:'+cs+'px;"><v:fill color="'+icolor+'" /></v:shape>'; shine = ''; strok = '';
			}else {
				if(iw>ih) {f=(ih/iw); t=(1-f)+((1-isize)*f); l=1-isize;}else if(ih>iw) {t=1-isize; f=(iw/ih); l=(1-f)+((1-isize)*f); }else {t=1-isize; l=1-isize;}
				fill = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#808080" coordorigin="0,0" coordsize="'+cs+','+cs+'" path="m 2,2 c '+ir+','+vs+','+or+','+hs+','+or+','+(cs-or)+' qy 0,'+cs+' c '+yr+','+cs+','+yr+','+cs+','+(xr+1)+','+(cs-vr+1)+' l '+(cs-vr+1)+','+(xr+1)+' c '+cs+','+yr+','+cs+','+yr+','+cs+',0 qy '+(cs-or)+','+or+' c '+hs+','+or+','+vs+','+ir+',2,2 x e" style="rotation:180; filter:fliph() progid:DXImageTransform.Microsoft.BasicImage(rotation=1);position:absolute;top:'+(ih-cs)+'px;left:'+(iw-cs)+'px;width:'+cs+'px;height:'+cs+'px;"><v:fill src="'+image.src+'" origin="'+t+','+l+'" type="tile" /></v:shape>';
				shine = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#808080" coordorigin="0,0" coordsize="'+cs+','+cs+'" path="m 0,0 c '+ir+','+vs+','+or+','+hs+','+or+','+(cs-or)+' qy 0,'+cs+' c '+yr+','+cs+','+yr+','+cs+','+xr+','+(cs-vr)+' l '+(cs-vr)+','+xr+' c '+cs+','+yr+','+cs+','+yr+','+cs+',0 qy '+(cs-or)+','+or+' c '+hs+','+or+','+vs+','+ir+',0,0 x e" style="position:absolute;top:'+(ih-cs)+'px;left:'+(iw-cs)+'px;width:'+cs+'px;height:'+cs+'px;"><v:fill color="#ffffff" opacity="0.75" /></v:shape>';
				strok = '<v:shape strokeweight="1.5" filled="f" stroked="t" strokecolor="#808080" opacity="0" coordorigin="0,0" coordsize="'+cs+','+cs+'" path="m 0,0 c '+(ir-1)+','+vs+','+(or-1)+','+hs+','+(or-1)+','+(cs-or-1)+' qy 1,'+(cs-1)+' m '+(cs-1)+',1 qy '+(cs-or-1)+','+(or-1)+' c '+hs+','+(or-1)+','+vs+','+(ir-1)+',0,0 e" style="position:absolute;top:'+(ih-cs)+'px;left:'+(iw-cs)+'px;width:'+cs+'px;height:'+cs+'px;"></v:shape>';
			}
			shade = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+cs+','+cs+'" path="m 0,0 c '+ir+','+vs+','+or+','+hs+','+or+','+(cs-or)+' qy 0,'+cs+' c '+yr+','+cs+','+yr+','+cs+','+xr+','+(cs-vr)+' l '+(cs-vr)+','+xr+' c '+cs+','+yr+','+cs+','+yr+','+cs+',0 qy '+(cs-or)+','+or+' c '+hs+','+or+','+vs+','+ir+',0,0 x e" style="position:absolute;top:'+(ih-cs)+'px;left:'+(iw-cs)+'px;width:'+cs+'px;height:'+cs+'px;"><v:fill method="linear sigma" type="gradient" focus="-0.15" angle="45" color="#000000" opacity="1" color2="#000000" o:opacity2="0" /></v:shape>';
			foot = '</v:group>';
			vml.innerHTML = head+shadow+back+fill+shine+shade+strok+foot;
			vml.className = newClasses;
			vml.style.cssText = image.style.cssText;
			vml.style.height = ih+'px'; vml.width = iw;
			vml.height = ih; vml.style.width = iw+'px';
			vml.src = image.src; vml.alt = image.alt;
			if(image.id!='') vml.id = image.id; 
			if(image.title!='') vml.title = image.title;
			if(image.getAttribute('onclick')!='') vml.setAttribute('onclick',image.getAttribute('onclick'));
			object.replaceChild(vml,image);
			vml.style.visibility = 'visible';
		}
	}
}

function addCurl() {
	var theimages = getImages('curl');
	var image, object, canvas, context, classes, newClasses;
	var i, f, ih, iw, cs, or, ir, hr, st;  
	var isize, ishadow, icolor, invert; var dg = (Math.PI*90/180);
	var children = document.getElementsByTagName('img');
	for(i=0;i<theimages.length;i++) {	
		image = theimages[i]; object = image.parentNode; 
		canvas = document.createElement('canvas');
		if(canvas.getContext && image.width>=64 && image.height>=64) {
			classes = image.className.split(' ');
			isize = 0; ishadow = 0; icolor = 0; invert = 0;
			isize = getClassValue(classes,"isize");
			ishadow = getClassValue(classes,"ishadow");
			icolor = getClassColor(classes,"icolor");
			invert = getClassAttribute(classes,"invert");			
			newClasses = getClasses(classes,"curl");
			isize = isize==0?0.33:isize/100;
			ishadow = ishadow==0?0.66:ishadow/100;
			ih = image.height; iw = image.width; 
			cs = Math.floor(Math.min(iw,ih)*isize);
			or = Math.floor(cs*0.15); hr = Math.floor(or*0.5); ir = Math.floor(or*0.8);
			canvas.className = newClasses;
			canvas.style.cssText = image.style.cssText;
			canvas.style.height = ih+'px'; canvas.width = iw;
			canvas.style.width = iw+'px'; canvas.height = ih;
			canvas.src = image.src; canvas.alt = image.alt;
			if(image.id!='') canvas.id = image.id;
			if(image.title!='') canvas.title = image.title;
			if(image.getAttribute('onclick')!='') canvas.setAttribute('onclick',image.getAttribute('onclick'));
			context = canvas.getContext("2d");
			object.replaceChild(canvas,image);
			context.clearRect(0,0,iw,ih);
			context.save();
			if(invert<1) {
				clipCurl(context,iw-cs,ih-cs,iw,ih,or,ir);
				context.clip();
				if(!isNaN(icolor)) {
					context.fillStyle = 'rgba(0,0,0,0)';
					context.fillRect(0,0,iw,ih);
					context.rotate(dg);
					context.scale(-1,1);
					context.translate(-(iw),-(ih));
					context.drawImage(image,-(ih-cs),-(iw-cs),iw,ih);
				}
			}else {
				clipInversCurl(context,iw-cs,ih-cs,iw,ih,or,ir);
				context.clip();
				context.clearRect(0,0,iw,ih);
				context.drawImage(image,0,0,iw,ih);
			}
			context.restore();
			clipCurl(context,iw-cs,ih-cs,iw,ih,or,ir);
			context.fillStyle = 'rgba(254,254,254,0.5)';
			if(isNaN(icolor)) context.fillStyle = icolor;
			context.fill();
			clipCurl(context,iw-cs,ih-cs,iw,ih,or,ir);
			context.strokeStyle = 'rgba(128,128,128,0.5)';
			context.stroke();
			clipCurl(context,iw-cs,ih-cs,iw,ih,or,ir);
			st = context.createLinearGradient(iw-cs,ih-cs,iw-(cs*.455),ih-(cs*.455)); st.addColorStop(0,'rgba(254,254,254,0.5)'); st.addColorStop(0.33,'rgba(254,254,254,0)'); st.addColorStop(0.33,'rgba(0,0,0,0)'); st.addColorStop(0.4,'rgba(0,0,0,0.05)'); st.addColorStop(0.5,'rgba(0,0,0,0.1)'); st.addColorStop(0.75,'rgba(0,0,0,0.15)'); st.addColorStop(0.85,'rgba(0,0,0,0.3)'); st.addColorStop(0.99,'rgba(0,0,0,0.7)'); st.addColorStop(1,'rgba(0,0,0,0.8)');
			context.fillStyle = st;
			context.fill();
			context.save();
			if(invert<1) {
				clipReversCurl(context,iw-cs,ih-cs,iw,ih,or,ir);
				context.clip();
				context.clearRect(0,0,iw,ih);
				context.drawImage(image,0,0,iw,ih);
			}
			context.restore();
			clipCurlShadow(context,iw-cs,ih-cs,iw,ih,or,ir);
			context.clip();
			context.save();
			context.translate(iw,ih-cs);
			context.rotate((Math.PI/180)*45);
			context.scale(0.75,1);
			curlShadow(context,cs,or,hr,ishadow);
			context.restore();
			canvas.style.visibility = 'visible';
		}
	}
}

var curlOnload = window.onload;
window.onload = function () { if(curlOnload) curlOnload(); if(isIE){addIECurl(); }else {addCurl(); }}