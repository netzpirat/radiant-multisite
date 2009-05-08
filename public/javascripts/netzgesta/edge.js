/**
 * edge.js 1.41 (21-Mar-2009)
 * (c) by Christian Effenberger 
 * All Rights Reserved
 * Source: edge.netzgesta.de
 * Distributed under Netzgestade Software License Agreement
 * http://www.netzgesta.de/cvi/LICENSE.txt
 * License permits free of charge
 * use on non-commercial and 
 * private web sites only
**/

// the mask images must be set before loading "edge.js" !

if(typeof mask2load=="undefined") {var ina = true; var mask2load = new Array("");}

var tmp = navigator.appName == 'Microsoft Internet Explorer' && navigator.userAgent.indexOf('Opera') < 1 ? 1 : 0;
if(tmp) var isIE = document.namespaces ? 1 : 0;

if(isIE) {
	if(document.namespaces['v']==null) {
		var e=["shape","shapetype","group","background","path","formulas","handles","fill","stroke","shadow","textbox","textpath","imagedata","line","polyline","curve","roundrect","oval","rect","arc","image"],s=document.createStyleSheet(); 
		for(var i=0; i<e.length; i++) {s.addRule("v\\:"+e[i],"behavior: url(#default#VML);");} document.namespaces.add("v","urn:schemas-microsoft-com:vml");
	} 
}

if(document.images) {
	var maskimg = new Array();
	var mimgCount = 0; var mi, mtimerID;
	var loadedmask = new Array();
}

function preloadImages() {
	for(mi=0; mi<mask2load.length; mi++) {
		maskimg[mi] = new Image();
		maskimg[mi].src = mask2load[mi];
	}
	for(mi=0; mi<maskimg.length; mi++) {
		loadedmask[mi] = false;
	}
	checkMaskImgLoad();
}

function checkMaskImgLoad() {
	if(ina==true || mimgCount==maskimg.length || maskimg[0].src=='') {
		if(isIE){
			addIEdges(); 
			return;
		}else {
			addEdges(); 
			return;
		}
	}
	for(mi=0; mi<=maskimg.length; mi++) {
		if(loadedmask[mi] == false && maskimg[mi].complete) {
			loadedmask[mi] = true; mimgCount++;
		}
	}
	mtimerID = setTimeout("checkMaskImgLoad()",10); 
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

function getClassAttribute(classes,string){
	var temp = 0; var pos = string.length;
	for (var j=0;j<classes.length;j++) {
		if (classes[j].indexOf(string) == 0) {
			temp = 1; break;
		}
	}
	return temp;
}

function setRadialStyle(ctx,x1,y1,r1,x2,y2,r2,o,c,i) {
	var sg = (i==true?o:0), eg = (i==true?0:o);
	var tmp = ctx.createRadialGradient(x1,y1,r1,x2,y2,r2);
	tmp.addColorStop(0,'rgba('+c+','+c+','+c+','+sg+')');
	tmp.addColorStop(1,'rgba('+c+','+c+','+c+','+eg+')');
	return tmp;
}

function setLinearStyle(ctx,x,y,w,h,o,c,i) {
	var sg = (i==true?o:0), eg = (i==true?0:o);
	var tmp = ctx.createLinearGradient(x,y,w,h);
	tmp.addColorStop(0,'rgba('+c+','+c+','+c+','+sg+')');
	tmp.addColorStop(1,'rgba('+c+','+c+','+c+','+eg+')');
	return tmp;
}

function addMask(ctx,x,y,w,h,r,o,c,i){
	var style; var os = r, p = Math.round(r/8);
	ctx.fillStyle = 'rgba('+c+','+c+','+c+','+o+')';
	if(i) {ctx.beginPath(); ctx.rect(x+r,y+r,w-(r*2),h-(r*2)); ctx.closePath(); ctx.fill();}
	if(window.opera && !i) {
		ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x+p,y+p,x+r,y); ctx.closePath(); ctx.fill();
		ctx.beginPath(); ctx.moveTo(x+w,y); ctx.lineTo(x+w,y+r); ctx.quadraticCurveTo(x+w-p,y+p,x+w-r,y); ctx.closePath(); ctx.fill();
		ctx.beginPath(); ctx.moveTo(x+w,y+h); ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w-p,y+h-p,x+w-r,y+h); ctx.closePath(); ctx.fill();
		ctx.beginPath(); ctx.moveTo(x,y+h); ctx.lineTo(x,y+h-r); ctx.quadraticCurveTo(x+p,y+h-p,x+r,y+h); ctx.closePath(); ctx.fill();
	}
	ctx.beginPath(); ctx.rect(x+r,y,w-(r*2),os); ctx.closePath(); style = setLinearStyle(ctx,x+r,y+os,x+r,y,o,c,i); ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y,r,r); ctx.closePath(); style = setRadialStyle(ctx,x+r,y+r,r-os,x+r,y+r,r,o,c,i); ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y+r,os,h-(r*2)); ctx.closePath(); style = setLinearStyle(ctx,x+os,y+r,x,y+r,o,c,i); ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y+h-r,r,r); ctx.closePath(); style = setRadialStyle(ctx,x+r,y+h-r,r-os,x+r,y+h-r,r,o,c,i); ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+r,y+h-os,w-(r*2),os); ctx.closePath(); style = setLinearStyle(ctx,x+r,y+h-os,x+r,y+h,o,c,i); ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+w-r,y+h-r,r,r); ctx.closePath(); style = setRadialStyle(ctx,x+w-r,y+h-r,r-os,x+w-r,y+h-r,r,o,c,i); ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+w-os,y+r,os,h-(r*2)); ctx.closePath(); style = setLinearStyle(ctx,x+w-os,y+r,x+w,y+r,o,c,i); ctx.fillStyle = style; ctx.fill(); 
	ctx.beginPath(); ctx.rect(x+w-r,y,r,r); ctx.closePath(); style = setRadialStyle(ctx,x+w-r,y+r,r-os,x+w-r,y+r,r,o,c,i); ctx.fillStyle = style; ctx.fill();
}

function checkGifVersion(num) {
	var tmp, str, i, t, n, p, s;
	t = maskimg[num].src.split("/"); n = t[t.length-1].toLowerCase();
	p = n.split("."); s = p[p.length-1]; p = n.slice(0, n.length-s.length-1);
	if(s!='gif') {
		for(i=0; i<maskimg.length; i++) {
			tmp = maskimg[i].src.toLowerCase(); str = tmp.lastIndexOf(p+'.gif'); if(str >= 0) {return i; }
		} return -1;
	}else {return num;}
}

function applyMask() {
	var ia = document.getElementById("img_a"); var ib = document.getElementById("img_b");
	if(ia!=null && ib!=null){
		ia.filters[0].Apply(); ia.innerHTML = ib.innerHTML; ia.filters[0].Play(); 
		ia.filters['DXImageTransform.Microsoft.Compositor'].Function=6; ia.id = ""; ib.id = "";
		return;
	}else {setTimeout("applyMask()",10);}
}

function addIEdges() {
	var theimages = getImages('edges');
	var image, object, canvas, display, head, fill, foot, map, flt, i, pos, tpa, tpb, ia, ib, source;
	var inbuilt = 0; var imask = 0; var classes = ''; var newClasses = '';
	for (i=0;i<theimages.length;i++) {
		image = theimages[i]; object = image.parentNode;
		classes = image.className.split(' '); map = '';
		imask = getClassValue(classes,"imask");
		inbuilt = getClassAttribute(classes,"inbuilt");
		newClasses = getClasses(classes,"edges");
		display = (image.currentStyle.display.toLowerCase()=='block')?'block':'inline-block';
		canvas = document.createElement(['<var style="zoom:1;overflow:hidden;display:' + display + ';width:' + image.width + 'px;height:' + image.height + 'px;padding:0;">'].join(''));
		flt = image.currentStyle.styleFloat.toLowerCase();
		display = (flt=='left'||flt=='right')?'inline':display;
		head = '<v:group style="zoom:1; display:' + display + '; margin:-1px 0 0 -1px; padding:0; position:relative; width:' + image.width + 'px;height:' + image.height + 'px;" coordsize="' + image.width + ',' + image.height + '">';
		fill = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="zoom:1;margin:-1px 0 0 -1px;padding: 0;display:block;position:absolute;top:0px;left:0px;width:' + image.width + 'px;height:' + image.height + 'px; filter:Alpha(opacity=100, finishopacity=0, style=3);"><v:fill src="' + image.src + '" type="frame" /></v:rect>'; 
		if(image.getAttribute("usemap")) map = '<img usemap="'+image.getAttribute('usemap')+'" src="'+image.src+'" border="0" style="filter:Alpha(opacity=0); position:absolute; margin:0; padding:0; top:0; left:0; width:'+image.width+'px; height:'+image.height+'px;" />';
		foot = '</v:group>';
		if(typeof(window['mask2load'])!="undefined" && !ina && imask>=0) { pos = checkGifVersion(imask);
			if(maskimg[pos].width>0 && maskimg[pos].height>0 && inbuilt!=1 && pos>=0) {
				source = maskimg[pos].src;
				head = '<v:group style="zoom:1; display:'+display+';margin:0;padding:0;position:relative;width:'+image.width+'px;height:'+image.height+'px;" coordsize="'+image.width+','+image.height+'">';
				tpb = '<div id="img_b" style="margin:0;padding:0;position:absolute;top:0;left:0;width:'+image.width+'px;height:'+image.height+'px;display:none;"><img src="'+source+'" width="'+image.width+'" height="'+image.height+'" /></div>';	
				tpa = '<div id="img_a" style="margin:0;padding:0;position:absolute;top:0;left:0;width:'+image.width+'px;height:'+image.height+'px; filter:progid:DXImageTransform.Microsoft.Compositor(Function=4);"><img src="'+image.src+'" width="'+image.width+'" height="'+image.height+'" /></div>';
				canvas.innerHTML = head+tpb+tpa+map+foot; applyMask();
			} else {
				canvas.innerHTML = head+fill+fill+fill+fill+fill+fill+map+foot;
			}
		} else {
			canvas.innerHTML = head+fill+fill+fill+fill+fill+fill+map+foot;
		}
		canvas.className = newClasses;
		canvas.style.cssText = image.style.cssText;
		canvas.style.height = image.height+'px';
		canvas.style.width = image.width+'px';
		canvas.height = image.height;
		canvas.width = image.width;
		canvas.src = image.src; canvas.alt = image.alt;
		if(image.id!='') canvas.id = image.id; map = '';
		if(image.title!='') canvas.title = image.title;
		if(image.getAttribute('onclick')!='') canvas.setAttribute('onclick',image.getAttribute('onclick'));
		object.replaceChild(canvas,image);
	}
}

function addEdges() {
	var theimages = getImages('edges');
	var image; var object; var canvas; var context; 
	var isize = 0; var inbuilt = 0; var imask = 0;
	var classes = ''; var newClasses = ''; var radius;
	var maxdim = 0; var mindim = 0; var i; 
	for (i=0;i<theimages.length;i++) {
		image = theimages[i]; object = image.parentNode;
		radius = Math.round((image.width+image.height)/20);
		canvas = document.createElement('canvas');
		if (canvas.getContext) {
			classes = image.className.split(' ');
			isize = getClassValue(classes,"isize");
			imask = getClassValue(classes,"imask");
			inbuilt = getClassAttribute(classes,"inbuilt");
			newClasses = getClasses(classes,"edges");
			canvas.className = newClasses;
			canvas.style.cssText = image.style.cssText;
			canvas.style.height = image.height+'px';
			canvas.style.width = image.width+'px';
			canvas.height = image.height;
			canvas.width = image.width;
			canvas.src = image.src; canvas.alt = image.alt;
			if(image.id!='') canvas.id = image.id;
			if(image.title!='') canvas.title = image.title;
			if(image.getAttribute('onclick')!='') canvas.setAttribute('onclick',image.getAttribute('onclick'));
			maxdim = Math.min(canvas.width,canvas.height)/2;
			mindim = (isize==0?radius:isize);
			isize = Math.min(maxdim,mindim);
			imask = Math.min(imask,maskimg.length-1);
			context = canvas.getContext("2d");
			if(image.getAttribute("usemap")) {
				object.style.position = 'relative';
				object.style.height = image.height+'px';
				object.style.width = image.width+'px';
				canvas.left = 0; canvas.top = 0;
				canvas.style.position = 'absolute';
				canvas.style.left = 0 + 'px';
				canvas.style.top = 0 + 'px';
				image.left = 0; image.top = 0;
				image.style.position = 'absolute';
				image.style.height = image.height+'px';
				image.style.width = image.width+'px';
				image.style.left = 0 + 'px';
				image.style.top = 0 + 'px';
				image.style.opacity = 0;
				object.insertBefore(canvas,image);
			}else {
				object.replaceChild(canvas,image);
			}
			context.clearRect(0,0,canvas.width,canvas.height);
			context.globalCompositeOperation = "source-over";
			context.drawImage(image,0,0,canvas.width,canvas.height);
			context.globalCompositeOperation = "destination-out";
			if(maskimg[imask].width>0 && maskimg[imask].height>0 && inbuilt!=1) {
				context.drawImage(maskimg[imask],0,0,canvas.width,canvas.height);
			} else {
				addMask(context,0,0,canvas.width,canvas.height,isize,1,0);
			}
			canvas.style.visibility = 'visible';
		}
	}
}

var edgesOnload = window.onload;
window.onload = function () { if(edgesOnload) edgesOnload(); preloadImages();}