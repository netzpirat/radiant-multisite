/**
 * bevel.js 1.21 (21-Mar-2009)
 * (c) by Christian Effenberger 
 * All Rights Reserved
 * Source: bevel.netzgesta.de
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

function getClassHexColor(classes,string,color){
	var temp, val = color, pos = string.length;
	for (var j=0;j<classes.length;j++) {
		if (classes[j].indexOf(string) == 0) {
			temp = classes[j].substring(pos);
			val = temp.toLowerCase();
			break;
		}
	}
	if(!val.match(/^[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i)) {val = color||'000000'; }
	if(isIE) {return val; }else {var mx=254;
		function hex2dec(hex){return(Math.max(0,Math.min(parseInt(hex,16),255)));}
		var cr=hex2dec(val.substr(0,2)),cg=hex2dec(val.substr(2,2)),cb=hex2dec(val.substr(4,2));
		return Math.min(cr,mx)+','+Math.min(cg,mx)+','+Math.min(cb,mx);
	}
}

function getRadius(radius,width,height){
	var part = (Math.min(width,height)/100);
	radius = Math.max(Math.min(100,radius/part),0);
	return radius+'%';
}

function applyForm(ctx,x,y,w,h,r,o,f) {
	var z=o?Math.round(r*((window.opera?0.3:0.25)*f)):0; 
	ctx.beginPath(); ctx.moveTo(x,y+r); ctx.lineTo(x,y+h-r);
	ctx.quadraticCurveTo(x+z,y+h-z,x+r,y+h); ctx.lineTo(x+w-r,y+h);
	ctx.quadraticCurveTo(x+w-z,y+h-z,x+w,y+h-r); ctx.lineTo(x+w,y+r);
	ctx.quadraticCurveTo(x+w-z,y+z,x+w-r,y); ctx.lineTo(x+r,y);
	ctx.quadraticCurveTo(x+z,y+z,x,y+r); ctx.closePath();
}

function applyFlex(ctx,x,y,w,h,r,o,c) {
	ctx.beginPath();ctx.moveTo(x-r,y-r); ctx.lineTo(x-r,y+r);
	ctx.lineTo(x,y+(r*2)); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); 
	ctx.lineTo(x+(r*2),y); ctx.lineTo(x+r,y-r); ctx.closePath();
	var st=ctx.createRadialGradient(x+(r/4),y+(r/4),0,x+(r/4),y+(r/4),r);
	st.addColorStop(0,'rgba('+c+','+o+')'); st.addColorStop(1,'rgba('+c+',0)');
	ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.moveTo(x+w+r,y-r); ctx.lineTo(x+w+r,y+r); 
	ctx.lineTo(x+w,y+(r*2)); ctx.lineTo(x+w,y+r); ctx.quadraticCurveTo(x+w,y,x+w-r,y); 
	ctx.lineTo(x+w-(r*2),y); ctx.lineTo(x+w-r,y-r); ctx.closePath();
	st=ctx.createRadialGradient(x+w-(r/4),y+(r/4),0,x+w-(r/4),y+(r/4),r);
	st.addColorStop(0,'rgba('+c+','+o+')'); st.addColorStop(1,'rgba('+c+',0)');
	ctx.fillStyle=st; ctx.fill();
}

function applyGlow(ctx,x,y,w,h,r,o,c) {
	function setRS(ctx,x1,y1,r1,x2,y2,r2,o,c) {
		var opt=Math.min(parseFloat(o+0.1),1.0),tmp=ctx.createRadialGradient(x1,y1,r1,x2,y2,r2);
		tmp.addColorStop(0,'rgba('+c+','+opt+')'); tmp.addColorStop(0.25,'rgba('+c+','+o+')');
		tmp.addColorStop(1,'rgba('+c+',0)'); return tmp;
	}
	function setLS(ctx,x,y,w,h,o,c) {
		var opt=Math.min(parseFloat(o+0.1),1.0),tmp=ctx.createLinearGradient(x,y,w,h);
		tmp.addColorStop(0,'rgba('+c+','+opt+')'); tmp.addColorStop(0.25,'rgba('+c+','+o+')');
		tmp.addColorStop(1,'rgba('+c+',0)'); return tmp;
	}
	var st,os=Math.round(Math.min(w,h)*(window.opera?0.058:0.05));
	ctx.beginPath(); ctx.rect(x+r,y,w-(r*2),r); ctx.closePath();	
	st=setLS(ctx,x+r,y+os,x+r,y,o,c); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y+r,r,h-(r*2)); ctx.closePath();
	st=setLS(ctx,x+os,y+r,x,y+r,o,c); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x+r,y+h-r,w-x-(r*2),r); ctx.closePath();
	st=setLS(ctx,x+r,y+h-os,x+r,y+h,o,c); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x+w-r,y+r,r,h-y-(r*2)); ctx.closePath();
	st=setLS(ctx,x+w-os,y+r,x+w,y+r,o,c); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y,r,r); ctx.closePath();
	st=setRS(ctx,x+r,y+r,r-os,x+r,y+r,r,o,c); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y+h-r,r,r); ctx.closePath();
	st=setRS(ctx,x+r,y+h-r,r-os,x+r,y+h-r,r,o,c); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(w-r,h-r,x+r,y+r); ctx.closePath();
	st=setRS(ctx,w-r,h-r,r-os+x,w-r,h-r,y+r,o,c); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x+w-r,y,r,r); ctx.closePath();
	st=setRS(ctx,x+w-r,y+r,r-os,x+w-r,y+r,r,o,c); ctx.fillStyle=st; ctx.fill();
}

function applyMask(ctx,x,y,w,h,r,o,c,i,z) {
	function setRS(ctx,x1,y1,r1,x2,y2,r2,o,c,i,z) {
		var sg=(i==true?o:0),eg=(i==true?0:o),mg=eg*(z==true?0.9:0.7);
		var tmp=ctx.createRadialGradient(x1,y1,r1,x2,y2,r2); tmp.addColorStop(0,'rgba('+c+','+sg+')');
		if(z==false) {tmp.addColorStop(0.9,'rgba('+c+','+mg+')');}tmp.addColorStop(1,'rgba('+c+','+eg+')'); return tmp;
	}
	function setLS(ctx,x,y,w,h,o,c,i,z) {
		var sg=(i==true?o:0),eg=(i==true?0:o),mg=eg*(z==true?0.9:0.7);
		var tmp=ctx.createLinearGradient(x,y,w,h); tmp.addColorStop(0,'rgba('+c+','+sg+')');
		if(z==false) {tmp.addColorStop(0.9,'rgba('+c+','+mg+')');}tmp.addColorStop(1,'rgba('+c+','+eg+')'); return tmp;
	}
	var st,os=r,p=Math.round(r/8); ctx.fillStyle='rgba('+c+','+o+')';
	if(i) {ctx.beginPath(); ctx.rect(x+r,y+r,w-(r*2),h-(r*2)); ctx.closePath(); ctx.fill();}
	if(window.opera && !i) {
		ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x+p,y+p,x+r,y); ctx.closePath(); ctx.fill();
		ctx.beginPath(); ctx.moveTo(x+w,y); ctx.lineTo(x+w,y+r); ctx.quadraticCurveTo(x+w-p,y+p,x+w-r,y); ctx.closePath(); ctx.fill();
		ctx.beginPath(); ctx.moveTo(x+w,y+h); ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w-p,y+h-p,x+w-r,y+h); ctx.closePath(); ctx.fill();
		ctx.beginPath(); ctx.moveTo(x,y+h); ctx.lineTo(x,y+h-r); ctx.quadraticCurveTo(x+p,y+h-p,x+r,y+h); ctx.closePath(); ctx.fill();
	}
	ctx.beginPath(); ctx.rect(x+r,y,w-(r*2),os); ctx.closePath(); st=setLS(ctx,x+r,y+os,x+r,y,o,c,i,z); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y,r,r); ctx.closePath(); st=setRS(ctx,x+r,y+r,r-os,x+r,y+r,r,o,c,i,z); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y+r,os,h-(r*2)); ctx.closePath(); st=setLS(ctx,x+os,y+r,x,y+r,o,c,i,z); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y+h-r,r,r); ctx.closePath(); st=setRS(ctx,x+r,y+h-r,r-os,x+r,y+h-r,r,o,c,i,z); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x+r,y+h-os,w-(r*2),os); ctx.closePath(); st=setLS(ctx,x+r,y+h-os,x+r,y+h,o,c,i,z); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x+w-r,y+h-r,r,r); ctx.closePath(); st=setRS(ctx,x+w-r,y+h-r,r-os,x+w-r,y+h-r,r,o,c,i,z); ctx.fillStyle=st; ctx.fill();
	ctx.beginPath(); ctx.rect(x+w-os,y+r,os,h-(r*2)); ctx.closePath(); st=setLS(ctx,x+w-os,y+r,x+w,y+r,o,c,i,z); ctx.fillStyle=st; ctx.fill(); 
	ctx.beginPath(); ctx.rect(x+w-r,y,r,r); ctx.closePath(); st=setRS(ctx,x+w-r,y+r,r-os,x+w-r,y+r,r,o,c,i,z); ctx.fillStyle=st; ctx.fill();
}

function addIEBevel() {
	var theimages = getImages('bevel');
	var image, object, vml, display, flt, classes, newClasses;
	var ww, hh, iw, ih, ix, iy, i, t, f, p, ro, ri, r, mask, radius, inner;
	var iglowcol, ishinecol, ishadecol, ibackcol, ifillcol, usemask, noshine;
	var iglowopac, ishineopac, ishadeopac, iradius, noglow, noshade, islinear;
	var head, foot, glow, fill, shade, shine, high, left, right, oline;
	for (i=0;i<theimages.length;i++) {
		image = theimages[i]; object = image.parentNode;
		high = ''; shine = ''; left = ''; right = ''; shade = ''; glow = ''; oline = '';
		classes = image.className.split(' ');
		iglowcol = getClassHexColor(classes,"iglowcol",'000000');
		ibackcol = getClassHexColor(classes,"ibackcol",'0080ff');
		ifillcol = getClassHexColor(classes,"ifillcol",'000000');
		if(ifillcol=='000000') {ifillcol = ibackcol; }
		ishinecol = getClassHexColor(classes,"ishinecol",'ffffff');
		ishadecol = getClassHexColor(classes,"ishadecol",'000000');
		iradius = getClassValue(classes,"iradius");
		iglowopac = getClassValue(classes,"iglowopac");
		ishineopac = getClassValue(classes,"ishineopac");
		ishadeopac  = getClassValue(classes,"ishadeopac");
		islinear = getClassAttribute(classes,"islinear");
		usemask = getClassAttribute(classes,"usemask");
		noglow = getClassAttribute(classes,"noglow");
		noshine = getClassAttribute(classes,"noshine");
		noshade = getClassAttribute(classes,"noshade");
		iradius = iradius==0?20:iradius;
		iglowopac = Math.min(iglowopac==0?40:iglowopac*1.2,100);
		ishineopac = ishineopac==0?0.4:ishineopac/100;
		ishadeopac = ishadeopac==0?0.5:ishadeopac/100;
		newClasses = getClasses(classes,"bevel");
		ww = image.width; hh = image.height;
		mask = usemask>=1?"filter:progid:DXImageTransform.Microsoft.Alpha(opacity=100,finishopacity=50,style=3);":"";
		if(noglow<1) {
			radius = Math.max(Math.min(iradius,40),20);
			ix = Math.round(Math.min(ww,hh)*0.05); 
			iy = ix; iw = ww-(2*ix); ih = hh-(2*iy);
			ro = Math.round(Math.min(iw,ih)*(radius/100));	
			ri = Math.round(ro*0.8); r = ri/2;
			inner = getRadius(ri/2,iw-ri,ih-ri); 
			radius = radius*0.8; ro = Math.round(ro*0.8);
		}else {
			radius = Math.max(Math.min(iradius,40),20);
			ix = 0; iy = 0; iw = ww; ih = hh;
			ri = Math.round(Math.min(iw,ih)*(radius/100));
			r = ri/2; inner = getRadius(ri/2,iw-ri,ih-ri);
			ro = ri;
		} t = Math.round(Math.max(Math.round(iw/200),1)); f = 0;
		if(noglow<1) {glow = '<v:roundrect arcsize="'+radius+'%" strokeweight="0" filled="t" stroked="f" fillcolor="#'+iglowcol+'" style="filter:Alpha(opacity='+iglowopac+'), progid:dxImageTransform.Microsoft.Blur(PixelRadius='+(ix/2)+',MakeShadow=false); zoom:1;margin:-1px 0 0 -1px;padding:0;position:absolute;top:0px;left:0px;width:'+(iw+ix)+'px;height:'+(ih+iy)+'px;"><v:fill color="#'+iglowcol+'" opacity="1" /></v:roundrect>';}
		fill = '<v:roundrect arcsize="'+radius+'%" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="zoom:1;margin:-1px 0 0 -1px;padding:0;position:absolute;top:'+iy+'px;left:'+ix+'px;width:'+iw+'px;height:'+ih+'px;"><v:fill method="linear" type="gradient" angle="0" color="#'+ifillcol+'" color2="#'+ibackcol+'" /></v:roundrect>';
		fill += '<v:roundrect arcsize="'+radius+'%" strokeweight="0" filled="t" stroked="f" style="'+mask+'zoom:1;margin:-1px 0 0 -1px;padding:0;position:absolute;top:'+iy+'px;left:'+ix+'px;width:'+iw+'px;height:'+ih+'px;"><v:fill src="'+image.src+'" type="frame" /></v:roundrect>';
		if(noshade<1) {
			shade = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+ro+','+ro+'" path="m '+ro+','+ro+' l 0,'+ro+' qy '+ro+',0 l '+ro+','+ro+' x e" style="position:absolute;margin: -1px 0 0 -1px;top:'+iy+'px;left:'+ix+'px;width:'+ro+'px;height:'+ro+'px;"><v:fill method="'+(islinear>0?"linear":"sigma")+'" type="gradientradial" focus="1" focusposition="1,1" focussize="0.5,0.5" color="#'+ishadecol+'" opacity="0" color2="#'+ishadecol+'" o:opacity2="'+ishadeopac+'" /></v:shape>'; 
			shade += '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+ro+','+ro+'" path="m 0,'+ro+' l '+ro+','+ro+' qy 0,0 l 0,'+ro+' x e" style="position:absolute;margin: -1px 0 0 -1px;top:'+iy+'px;left:'+(ix+iw-ro)+'px;width:'+ro+'px;height:'+ro+'px;"><v:fill method="'+(islinear>0?"linear":"sigma")+'" type="gradientradial" focus="1" focusposition="-0.5,1" focussize="0.5,0.5" color="#'+ishadecol+'" opacity="0" color2="#'+ishadecol+'" o:opacity2="'+ishadeopac+'" /></v:shape>'; 
			shade += '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+ro+','+ro+'" path="m '+ro+',0 l '+ro+','+ro+' qx 0,0 l '+ro+',0 x e" style="position:absolute;margin: -1px 0 0 -1px;top:'+(iy+ih-ro)+'px;left:'+ix+'px;width:'+ro+'px;height:'+ro+'px;"><v:fill method="'+(islinear>0?"linear":"sigma")+'" type="gradientradial" focus="1" focusposition="1,-0.5" focussize="0.5,0.5" color="#'+ishadecol+'" opacity="0" color2="#'+ishadecol+'" o:opacity2="'+ishadeopac+'" /></v:shape>'; 
			shade += '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+ro+','+ro+'" path="m 0,0 l '+ro+',0 qy 0,'+ro+' l 0,0 x e" style="position:absolute;margin: -1px 0 0 -1px;top:'+(iy+ih-ro)+'px;left:'+(ix+iw-ro)+'px;width:'+ro+'px;height:'+ro+'px;"><v:fill method="'+(islinear>0?"linear":"sigma")+'" type="gradientradial" focus="1" focusposition="-0.5,-0.5" focussize="0.5,0.5" color="#'+ishadecol+'" opacity="0" color2="#'+ishadecol+'" o:opacity2="'+ishadeopac+'" /></v:shape>'; 
			shade += '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="position:absolute;margin: -1px 0 0 -1px;top:'+iy+'px;left:'+(ix+ro-f)+'px;width:'+(iw-ro-ro+f+f)+'px;height:'+ro+'px;"><v:fill method="'+(islinear>0?"linear":"sigma")+'" type="gradient" angle="0" color="#'+ishadecol+'" opacity="0" color2="#'+ishadecol+'" o:opacity2="'+ishadeopac+'" /></v:rect>';	
			shade += '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="position:absolute;margin: -1px 0 0 -1px;top:'+(iy+ro-f)+'px;left:'+ix+'px;width:'+ro+'px;height:'+(ih-ro-ro+f+f)+'px;"><v:fill method="'+(islinear>0?"linear":"sigma")+'" type="gradient" angle="90" color="#'+ishadecol+'" opacity="0" color2="#'+ishadecol+'" o:opacity2="'+ishadeopac+'" /></v:rect>';	
			shade += '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="position:absolute;margin: -1px 0 0 -1px;top:'+(iy+ro-f)+'px;left:'+(ix+iw-ro)+'px;width:'+ro+'px;height:'+(ih-ro-ro+f+f)+'px;"><v:fill method="'+(islinear>0?"linear":"sigma")+'" type="gradient" angle="270" color="#'+ishadecol+'" opacity="0" color2="#'+ishadecol+'" o:opacity2="'+ishadeopac+'" /></v:rect>';	
			shade += '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="position:absolute;margin: -1px 0 0 -1px;top:'+(iy+ih-ro)+'px;left:'+(ix+ro-f)+'px;width:'+(iw-ro-ro+f+f)+'px;height:'+ro+'px;"><v:fill method="'+(islinear>0?"linear":"sigma")+'" type="gradient" angle="180" color="#'+ishadecol+'" opacity="0" color2="#'+ishadecol+'" o:opacity2="'+ishadeopac+'" /></v:rect>';	
			oline = '<v:roundrect arcsize="'+radius+'%" filled="f" stroked="t" style="zoom:1;margin:-1px 0 0 -1px;padding:0;position:absolute;top:'+iy+'px;left:'+ix+'px;width:'+iw+'px;height:'+ih+'px;"><v:stroke weight="1" style="single" color="#'+ishadecol+'" opacity="'+ishadeopac+'" /></v:roundrect>';
		}
		if(noshine<1) {
			shine = '<v:roundrect arcsize="'+inner+'" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="zoom:1;margin:-1px 0 0 -1px;padding:0;position:absolute;top:'+(iy+(ri/2))+'px;left:'+(ix+(ri/2))+'px;width:'+(iw-ri)+'px;height:'+(ih-ri)+'px;"><v:fill method="linear sigma" type="gradient" angle="0" color="#'+ishinecol+'" opacity="0" color2="#'+ishinecol+'" o:opacity2="'+ishineopac+'" /></v:roundrect>';
			r=Math.round(r); p = "m 0,"+r+" l 0,"+(ih-ri-r)+","+t+","+(ih-ri-r)+","+t+","+r+" qy "+r+","+t+" l "+(iw-ri-r)+","+t+" qx "+(iw-ri-t)+","+r+" l "+(iw-ri-t)+","+(ih-ri-r)+","+(iw-ri)+","+(ih-ri-r)+","+(iw-ri)+","+r+" qy "+(iw-ri-r)+",0 l "+r+",0 qx 0,"+r+" x e";
			high = '<v:shape strokeweight="0" stroked="f" filled="t" coordorigin="0,0" coordsize="'+(iw-ri)+','+(ih-ri)+'" path="'+p+'" style="zoom:1;margin:-1px 0 0 -1px;padding:0;position:absolute;top:'+(iy+(ri/2))+'px;left:'+(ix+(ri/2))+'px;width:'+(iw-ri)+'px;height:'+(ih-ri)+'px;"><v:fill method="linear sigma" type="gradient" angle="0" color="#'+ishinecol+'" opacity="0" color2="#'+ishinecol+'" o:opacity2="'+ishineopac+'" /></v:shape>';
			left = '<v:oval stroked="f" strokeweight="0" style="zoom:1;margin:-1px 0 0 -1px;padding:0;position:absolute;top:'+(iy+(ri/8))+'px;left:'+(ix+(ri/8))+'px;width:'+ri+'px;height:'+ri+'px;"><v:fill method="any" type="gradientradial" focus="0" focussize="0,0" focusposition="0.5,0.5" on="t" color="#'+ishinecol+'" opacity="0" color2="#'+ishinecol+'" o:opacity2="'+ishineopac+'" /></v:oval>';
			right = '<v:oval stroked="f" strokeweight="0" style="zoom:1;margin:-1px 0 0 -1px;padding:0;position:absolute;top:'+(iy+(ri/8))+'px;left:'+(ix+iw-(ri*1.125))+'px;width:'+ri+'px;height:'+ri+'px;"><v:fill method="any" type="gradientradial" focus="0" focussize="0,0" focusposition="0.5,0.5" on="t" color="#'+ishinecol+'" opacity="0" color2="#'+ishinecol+'" o:opacity2="'+ishineopac+'" /></v:oval>';
		}
		display = (image.currentStyle.display.toLowerCase()=='block')?'block':'inline-block';
		vml = document.createElement(['<var style="zoom:1;overflow:hidden;display:'+display+';width:'+ww+'px;height:'+hh+'px;padding:0;">'].join(''));
		flt = image.currentStyle.styleFloat.toLowerCase();
		display = (flt=='left'||flt=='right')?'inline':display;
		head = '<v:group style="zoom:1;display:'+display+';margin:-1px 0 0 -1px;padding:0;position:relative;width:'+ww+'px;height:'+hh+'px;" coordsize="'+ww+','+hh+'"><v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="zoom:1;margin:-1px 0 0 -1px;padding:0;position:absolute;top:0px;left:0px;width:'+ww+'px;height:'+hh+'px;"><v:fill color="#ffffff" opacity="0.0" /></v:rect>';
		foot = '</v:group>';
		vml.innerHTML = head+glow+fill+shade+shine+high+left+right+oline+foot;
		vml.className = newClasses;
		vml.style.cssText = image.style.cssText;
		vml.style.height = image.height+'px';
		vml.style.width = image.width+'px';
		vml.height = image.height;
		vml.width = image.width;
		if(image.id!=null) vml.id = image.id;
		if(image.alt!=null) vml.alt = image.alt;
		if(image.title!=null) vml.title = image.title;
		if(image.getAttribute('onclick')!=null) vml.setAttribute('onclick',image.getAttribute('onclick'));
		object.replaceChild(vml,image);
		vml.style.visibility = 'visible';
	}
}

function addBevel() {
	var theimages = getImages('bevel');
	var image, object, canvas, context, classes, newClasses;
	var ww, hh, iw, ih, ix, iy, i, r, radius, inner, outer, style, islinear;
	var iglowcol, ishinecol, ishadecol, ibackcol, ifillcol, usemask, noshine;
	var iglowopac, ishineopac, ishadeopac, iradius, noglow, noshade;
	for (i=0;i<theimages.length;i++) {
		image = theimages[i]; object = image.parentNode;
		canvas = document.createElement('canvas');
		if (canvas.getContext) {
			classes = image.className.split(' ');
			iglowcol = getClassHexColor(classes,"iglowcol",'000000');
			ibackcol = getClassHexColor(classes,"ibackcol",'0080ff');
			ifillcol = getClassHexColor(classes,"ifillcol",'000000');
			if(ifillcol=='0,0,0') {ifillcol = ibackcol; }
			ishinecol = getClassHexColor(classes,"ishinecol",'ffffff');
			ishadecol = getClassHexColor(classes,"ishadecol",'000000');
			iradius = getClassValue(classes,"iradius");
			iglowopac = getClassValue(classes,"iglowopac");
			ishineopac = getClassValue(classes,"ishineopac");
			ishadeopac  = getClassValue(classes,"ishadeopac");
			islinear = getClassAttribute(classes,"islinear");
			usemask = getClassAttribute(classes,"usemask");
			noglow = getClassAttribute(classes,"noglow");
			noshine = getClassAttribute(classes,"noshine");
			noshade = getClassAttribute(classes,"noshade");
			iradius = iradius==0?0.2:iradius/100;
			iglowopac = iglowopac==0?0.33:iglowopac/100;
			ishineopac = ishineopac==0?0.4:ishineopac/100;
			ishadeopac = ishadeopac==0?0.5:ishadeopac/100;
			newClasses = getClasses(classes,"bevel");
			canvas.className = newClasses;
			canvas.style.cssText = image.style.cssText;
			canvas.style.height = image.height+'px';
			canvas.style.width = image.width+'px';
			canvas.height = image.height;
			canvas.width = image.width;
			canvas.src = image.src; 
			if(image.id!=null) canvas.id = image.id;
			if(image.alt!=null) canvas.alt = image.alt;
			if(image.title!=null) canvas.title = image.title;
			if(image.getAttribute('onclick')!=null) canvas.setAttribute('onclick',image.getAttribute('onclick'));
			ww = canvas.width; hh = canvas.height;
			r = Math.max(Math.min(iradius,0.4),0.2);
			ix = Math.round(Math.min(ww,hh)*0.05); 
			iy = ix; iw = ww-(2*ix); ih = hh-(2*iy);
			outer = Math.round(Math.min(iw,ih)*r);
			radius = Math.round(outer*0.8);
			if(noglow>0) {
				ix = 0; iy = 0; iw = ww; ih = hh; 
				radius = Math.round(Math.min(iw,ih)*r);
			} inner = Math.round(radius/2);
			context = canvas.getContext("2d");
			object.replaceChild(canvas,image);
			context.clearRect(0,0,ww,hh);
			context.globalCompositeOperation = "source-over";
			context.save();
			if(noglow<1) {applyGlow(context,0,0,ww,hh,outer,iglowopac,iglowcol);}
			applyForm(context,ix,iy,iw,ih,radius,true,r);
			context.clip();
			style = context.createLinearGradient(ix,iy,ix,iy+ih);
			style.addColorStop(0,'rgba('+ibackcol+',1)');
			style.addColorStop(1,'rgba('+ifillcol+',1)');
			context.fillStyle = style; context.fill();
			context.fillStyle = 'rgba(0,0,0,0)';
			context.fillRect(0,0,ww,hh);
			context.drawImage(image,0,0,ww,hh);
			if(usemask>=1) {
				context.globalCompositeOperation = "destination-out";
				applyMask(context,ix,iy,iw,ih,radius,1,'0,0,0');
				context.globalCompositeOperation = "destination-over";
				context.fillStyle = style;
				context.beginPath(); context.rect(ix,iy,iw,ih);
				context.closePath(); context.fill();
			}
			if(noshade<1) {
				context.globalCompositeOperation = window.opera?"source-over":"source-atop";
				context.fillStyle = 'rgba(0,0,0,0)'; context.fillRect(ix,iy,iw,ih);
				applyMask(context,ix,iy,iw,ih,radius,ishadeopac,ishadecol,false,islinear);
				applyForm(context,ix,iy,iw,ih,radius,true,r);
				context.strokeStyle = 'rgba('+ishadecol+','+ishadeopac+')';
				context.lineWidth = 1; context.stroke();
			}
			if(noshine<1) {
				context.globalCompositeOperation = window.opera?"source-over":"source-atop";
				applyForm(context,ix+inner,iy+inner,iw-radius,ih-radius,inner);
				if(!window.opera) {context.globalCompositeOperation = "lighter"; ishineopac = ishineopac*0.5; }
				style = context.createLinearGradient(0,inner,0,ih-radius);
				style.addColorStop(0,'rgba('+ishinecol+','+ishineopac+')');
				style.addColorStop(0.25,'rgba('+ishinecol+','+(ishineopac/2)+')');
				style.addColorStop(1,'rgba('+ishinecol+',0)');
				context.fillStyle = style; context.fill();
				applyForm(context,ix+inner,iy+inner,iw-radius,ih-radius,inner);
				style = context.createLinearGradient(0,inner,0,ih-radius);
				style.addColorStop(0,'rgba('+ishinecol+','+(ishineopac*1.25)+')');
				style.addColorStop(0.25,'rgba('+ishinecol+','+(ishineopac/1.5)+')');
				style.addColorStop(1,'rgba('+ishinecol+',0)');
				context.strokeStyle = style; context.lineWidth = Math.max(Math.round(iw/200),0.5); context.stroke();				
				applyFlex(context,ix+inner,iy+inner,iw-radius,ih-radius,inner,ishineopac,ishinecol);
			}
			canvas.style.visibility = 'visible';
		}
	}
}

var bevelOnload = window.onload;
window.onload = function () { if(bevelOnload) bevelOnload(); if(isIE){addIEBevel(); }else {addBevel();}}