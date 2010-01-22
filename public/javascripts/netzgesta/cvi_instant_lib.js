/**
 * cvi_instant_lib.js 2.3 (14-Jul-2009) (c) by Christian Effenberger 
 * All Rights Reserved. Source: instant.netzgesta.de
 * Distributed under Netzgestade Non-commercial Software License Agreement.
 * This license permits free of charge use on non-commercial 
 * and private web sites only under special conditions. 
 * Read more at... http://www.netzgesta.de/cvi/LICENSE.html
 
 * syntax:
	cvi_instant.defaultTilt = 'none'; 				//STR  'n|l|r'-'none|left|right'
	cvi_instant.defaultShade = 33;  				//INT  0-100 (% opacity)
	cvi_instant.defaultShadow = 33;  				//INT  0-100 (% opacity)
	cvi_instant.defaultColor = '#f0f4ff'; 			//STR '#000000'-'#ffffff'
	cvi_instant.defaultNoshade = false; 			//BOOLEAN (a.k.a. no dark-bright gradient)
	cvi_instant.defaultNocorner = false; 			//BOOLEAN (a.k.a. with round corners)
	cvi_instant.defaultHistorical = false; 			//BOOLEAN (a.k.a. with frayed border)
	cvi_instant.defaultPreserve = false; 			//BOOLEAN (a.k.a. correct aspect ratio)
	
	depends on: cvi_text_lib.js
		cvi_instant.defaultTextcolor = '#000000';	//STR '#000000'-'#ffffff'
		cvi_instant.defaultFontattr = [100,100,100];//OBJ [1-200==weight, 10-400==width, 10-1000==space]
		cvi_instant.defaultText = '';				//STR
	
	depends on: cvi_filter_lib.js
		cvi_instant.defaultFilter = null;			//OBJ [{f='grayscale'},{f='emboss', s:1}...]
	
	cvi_instant.remove( image );
	cvi_instant.add( image, options );
	cvi_instant.modify( image, options );
	cvi_instant.add( image, { tilt: value, shadow: value, shade: value, color: value, noshade: value, nocorner: value, historical: value, preserve: value } );
	cvi_instant.modify( image, { tilt: value, shadow: value, shade: value, color: value, noshade: value, nocorner: value, historical: value, preserve: value } );
 *
**/

function hextorgba(val,trans) {
	function hex2dec(hex){return(Math.max(0,Math.min(parseInt(hex,16),255)));}
	var cr=hex2dec(val.substr(1,2)),cg=hex2dec(val.substr(3,2)),cb=hex2dec(val.substr(5,2));
	return 'rgba('+cr+','+cg+','+cb+','+trans+')';
}
function addShading(ctx,x,y,width,height,opacity) {
	var style = ctx.createLinearGradient(0,y,0,y+height);
	style.addColorStop(0,'rgba(0,0,0,'+(opacity/2)+')');
	style.addColorStop(0.3,'rgba(0,0,0,0)');
	style.addColorStop(0.7,'rgba(254,254,254,0)');
	style.addColorStop(1,'rgba(254,254,254,'+(opacity)+')');
	ctx.beginPath();
	ctx.rect(x,y,width,height);
	ctx.closePath();
	ctx.fillStyle = style;
	ctx.fill();
}
function addLining(ctx,x,y,width,height,opacity,inset,inner,color) {
	var style = ctx.createLinearGradient(x,y,width,height);
	if(inner==true) {
		style.addColorStop(0,'rgba(192,192,192,'+opacity+')');
		style.addColorStop(0.7,'rgba(254,254,254,0.8)');
		style.addColorStop(1,'rgba(254,254,254,0.9)');
	}else {
		if(color=='#f0f4ff') {
			style.addColorStop(0,'rgba(254,254,254,0.9)');
			style.addColorStop(0.3,'rgba(254,254,254,0.8)');
			style.addColorStop(1,'rgba(192,192,192,0.0)');
		}else {
			style.addColorStop(0,'rgba(254,254,254,0.0)');
			style.addColorStop(1,'rgba(192,192,192,0.0)');
		}
	}
	ctx.beginPath(); ctx.rect(x,y,width,height); ctx.closePath();
	ctx.strokeStyle = style; ctx.lineWidth = inset; ctx.stroke();
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
function tiltShadow(ctx,x,y,width,height,radius,opacity,round){
	var style, f=round?2.5:1.25, t=round?3.5:2.25; ctx.fillStyle="rgba(0,0,0,"+(opacity*1.2)+")";
	ctx.beginPath(); ctx.rect(x+radius,y+height-y-y,width-(radius*t),y); ctx.closePath(); ctx.fill();
	ctx.beginPath(); ctx.rect(x+width-x-x,y,radius,radius); ctx.closePath(); 
	style=addLinearStyle(ctx,x+width-x-x,y+radius,x+width-x-x,y,opacity); ctx.fillStyle=style; ctx.fill();	
	ctx.beginPath(); ctx.rect(x,y+height-y-y,radius,radius); ctx.closePath(); 
	style=addLinearStyle(ctx,x+radius,y+height-y-y,x,y+height-y-y,opacity); ctx.fillStyle=style; ctx.fill();	
	ctx.beginPath(); ctx.moveTo(x+width-x-x,y+radius); ctx.lineTo(x+width-x,y+radius); ctx.quadraticCurveTo(x+width-x-x,y+(height/2),x+width-x,y+height-(radius*f)); ctx.lineTo(x+width-x-x,y+height-(radius*f)); ctx.quadraticCurveTo(x+width-(x*3),y+(height/2),x+width-x-x,y+radius); ctx.closePath(); ctx.fill();
	ctx.beginPath(); ctx.rect(x,y+height-radius,radius,radius); ctx.closePath();
	style=addRadialStyle(ctx,x+radius,y+height-radius,radius-x,x+radius,y+height-radius,radius,opacity);
	ctx.fillStyle=style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+radius,y+height-y,width-(radius*t),y); ctx.closePath();
	style=addLinearStyle(ctx,x+radius,y+height-y,x+radius,y+height,opacity);
	ctx.fillStyle=style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+width-(radius*f),y+height-(radius*f),radius*f,radius*f); ctx.closePath();
	style=addRadialStyle(ctx,x+width-(radius*f),y+height-(radius*f),Math.max(0,(radius*f)-1.5-x),x+width-(radius*f),y+height-(radius*f),radius*f,opacity);
	ctx.fillStyle=style; ctx.fill();
	ctx.beginPath(); ctx.moveTo(x+width-x,y+radius); ctx.lineTo(x+width,y+radius); ctx.quadraticCurveTo(x+width-x,y+(height/2),x+width,y+height-(radius*f)); ctx.lineTo(x+width-x,y+height-(radius*f)); ctx.quadraticCurveTo(x+width-(x*2),y+(height/2),x+width-x,y+radius); ctx.closePath();
	style=addLinearStyle(ctx,x+width-x,y+radius,x+width,y+radius,opacity);
	ctx.fillStyle=style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+width-radius,y,radius,radius); ctx.closePath();
	style=addRadialStyle(ctx,x+width-radius,y+radius,radius-x,x+width-radius,y+radius,radius,opacity);
	ctx.fillStyle=style; ctx.fill();
}
function getRadius(radius,width,height){
	var part = (Math.min(width,height)/100);
	radius = Math.max(Math.min(100,radius/part),0);
	return radius+'%';
}
function wavedRect(ctx,x,y,w,h,r,n){
	function rF(a,z) {return Math.random()*(z-a)+a;};
	var i,t,c,cx,cy,cw,ch,wa=w/16,wz=w/32,ha=h/16,hz=h/32,da=r*0.1,dz=r*0.25; if(!n) {ctx.beginPath();} ctx.moveTo(x,y);
	cx=x; cy=y; ch=h; while(ch>0) {t=rF(ha,Math.min(ch,hz)); c=rF(1,t); ctx.quadraticCurveTo(cx+rF(da,dz),cy+c,cx,cy+t); cy+=t; ch-=t;}
	cx=x; cy=y+h; cw=w; while(cw>0) {t=rF(wa,Math.min(cw,wz)); c=rF(1,t); ctx.quadraticCurveTo(cx+c,cy-rF(da,dz),cx+t,cy); cx+=t; cw-=t;}
	cx=x+w; cy=y+h; ch=h; while(ch>0) {t=rF(ha,Math.min(ch,hz)); c=rF(1,t); ctx.quadraticCurveTo(cx-rF(da,dz),cy-c,cx,cy-t); cy-=t; ch-=t;}
	cx=x+w; cy=y; cw=w; while(cw>0) {t=rF(wa,Math.min(cw,wz)); c=rF(1,t); ctx.quadraticCurveTo(cx-c,cy+rF(da,dz),cx-t,cy); cx-=t; cw-=t;}
	if(!n) ctx.closePath();
}
function wavedPath(x,y,w,h,r){
	function rI(a,b) {return parseInt(Math.floor(Math.random()*(b-a+1))+a);};
	function qC(cX,cY,CPx,CPy,aX,aY) {var z=new Array(6); z[0]=cX+2.0/3.0*(CPx-cX); z[1]=cY+2.0/3.0*(CPy-cY); z[2]=z[0]+(aX-cX)/3.0; z[3]=z[1]+(aY-cY)/3.0; z[4]=aX; z[5]=aY; return z;}
	var p="",i,k,t,c,cx,cy,cw,ch,wa=w/16,wz=w/32,ha=h/16,hz=h/32,da=r*0.1,dz=r*0.25; 
	p+='m '+x+','+y; cx=x; cy=y; ch=h; while(ch>0) {t=rI(ha,Math.min(ch,hz)); c=rI(1,t); k=qC(cx,cy,cx+rI(da,dz),cy+c,cx,cy+t); 
	p+=' c '+parseInt(k[0])+','+Math.min(h,parseInt(k[1]))+','+parseInt(k[2])+','+Math.min(h,parseInt(k[3]))+','+parseInt(k[4])+','+Math.min(h,parseInt(k[5]));	cy+=t; ch-=t;}
	cx=x; cy=y+h; cw=w; while(cw>0) {t=rI(wa,Math.min(cw,wz)); c=rI(1,t); k=qC(cx,cy,cx+c,cy-rI(da,dz),cx+t,cy); 
	p+=' c '+Math.min(w,parseInt(k[0]))+','+parseInt(k[1])+','+Math.min(w,parseInt(k[2]))+','+parseInt(k[3])+','+Math.min(w,parseInt(k[4]))+','+parseInt(k[5]); cx+=t; cw-=t;}
	cx=x+w; cy=y+h; ch=h; while(ch>0) {t=rI(ha,Math.min(ch,hz)); c=rI(1,t); k=qC(cx,cy,cx-rI(da,dz),cy-c,cx,cy-t); 
	p+=' c '+parseInt(k[0])+','+Math.max(0,parseInt(k[1]))+','+parseInt(k[2])+','+Math.max(0,parseInt(k[3]))+','+parseInt(k[4])+','+Math.max(0,parseInt(k[5])); cy-=t; ch-=t;}
	cx=x+w; cy=y; cw=w; while(cw>0) {t=rI(wa,Math.min(cw,wz)); c=rI(1,t); k=qC(cx,cy,cx-c,cy+rI(da,dz),cx-t,cy); 
	p+=' c '+Math.max(0,parseInt(k[0]))+','+parseInt(k[1])+','+Math.max(0,parseInt(k[2]))+','+parseInt(k[3])+','+Math.max(0,parseInt(k[4]))+','+parseInt(k[5]); cx-=t; cw-=t;}
	return p+' x e';	
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

var cvi_instant = {
	defaultTilt : 'none',
	defaultShadow : 33,
	defaultShade : 33,
	defaultColor : '#f0f4ff',
	defaultNoshade : false,
	defaultNocorner : false,
	defaultHistorical : false,
	defaultPreserve : false,
	defaultTextcolor: '#000000',
	defaultFontattr: [100,100,100],
	defaultText : '',
	defaultFilter : null,
	defaultCallback : null,
	add: function(image, options) {
		if(image.tagName.toUpperCase() == "IMG") {
			var defopts = { "tilt" : cvi_instant.defaultTilt, "shade" : cvi_instant.defaultShade, "shadow" : cvi_instant.defaultShadow, "color" : cvi_instant.defaultColor, "nocorner" : cvi_instant.defaultNocorner, "noshade" : cvi_instant.defaultNoshade, "historical" : cvi_instant.defaultHistorical, "preserve" : cvi_instant.defaultPreserve, "textcolor" : cvi_instant.defaultTextcolor, "fontattr": cvi_instant.defaultFontattr, "text" : cvi_instant.defaultText, "filter" : cvi_instant.defaultFilter, "callback" : cvi_instant.defaultCallback }
			if(options) {
				for(var i in defopts) { if(!options[i]) { options[i] = defopts[i]; }}
			}else {
				options = defopts;
			}
			var imageWidth  = ('iwidth'  in options) ? parseInt(options.iwidth)  : image.width;
			var imageHeight = ('iheight' in options) ? parseInt(options.iheight) : image.height;
			try {
				var object = image.parentNode;
				if(document.all && document.namespaces && !window.opera) {
					if(document.namespaces['v']==null) {
						var e=["shape","shapetype","group","background","path","formulas","handles","fill","stroke","shadow","textbox","textpath","imagedata","line","polyline","curve","roundrect","oval","rect","arc","image"],s=document.createStyleSheet(); 
						for(var i=0; i<e.length; i++) {s.addRule("v\\:"+e[i],"behavior: url(#default#VML);");} document.namespaces.add("v","urn:schemas-microsoft-com:vml");
					}
					var display = (image.currentStyle.display.toLowerCase()=='block')?'block':'inline-block';
					var canvas = document.createElement(['<var style="zoom:1;display:'+display+';width:'+imageWidth+'px;height:'+imageHeight+'px;padding:0px;">'].join(''));
					var flt =  image.currentStyle.styleFloat.toLowerCase();
					display = (flt=='left'||flt=='right')?'inline':display;
					canvas.options = options;
					canvas.dpl = display;
					canvas.id = image.id;
					canvas.alt = image.alt;
					canvas.name = image.name;
					canvas.title = image.title;
					canvas.source = image.src;
					canvas.className = image.className;
					canvas.style.cssText = image.style.cssText;
					canvas.height = imageHeight;
					canvas.width = imageWidth;
					object.replaceChild(canvas,image);
					cvi_instant.modify(canvas, options);
				}else {
					var canvas = document.createElement('canvas');
					if(canvas.getContext("2d")) {
						canvas.options = options;
						canvas.id = image.id;
						canvas.alt = image.alt;
						canvas.name = image.name;
						canvas.title = image.title;
						canvas.source = image.src;
						canvas.className = image.className;
						canvas.style.cssText = image.style.cssText;
						canvas.style.height = imageHeight+'px';
						canvas.style.width = imageWidth+'px';
						canvas.height = imageHeight;
						canvas.width = imageWidth;
						object.replaceChild(canvas,image);
						cvi_instant.modify(canvas, options);
					}
				}
			} catch (e) {
			}
		}
	},

	modify: function(canvas, options) {
		try {
			var tilt = (typeof options['tilt']=='string'?options['tilt']:canvas.options['tilt']); canvas.options['tilt']=tilt;
			var shade = (typeof options['shade']=='number'?options['shade']:canvas.options['shade']); canvas.options['shade']=shade;
			var shadow = (typeof options['shadow']=='number'?options['shadow']:canvas.options['shadow']); canvas.options['shadow']=shadow;
			var color = (typeof options['color']=='string'?options['color']:canvas.options['color']); canvas.options['color']=color;
			var noshade = (typeof options['noshade']=='boolean'?options['noshade']:canvas.options['noshade']); canvas.options['noshade']=noshade;
			var nocorner = (typeof options['nocorner']=='boolean'?options['nocorner']:canvas.options['nocorner']); canvas.options['nocorner']=nocorner;
			var historical = (typeof options['historical']=='boolean'?options['historical']:canvas.options['historical']); canvas.options['historical']=historical;
			var preserve = (typeof options['preserve']=='boolean'?options['preserve']:canvas.options['preserve']); canvas.options['preserve']=preserve;
			var textcolor = (typeof options['textcolor']=='string'?options['textcolor']:canvas.options['textcolor']); canvas.options['textcolor']=textcolor;
			var attr = (typeof options['fontattr']=='object'?options['fontattr']:canvas.options['fontattr']); canvas.options['fontattr']=attr;
			var text = (typeof options['text']=='string'?options['text']:canvas.options['text']); canvas.options['text']=text;
			var filter = (typeof options['filter']=='object'?options['filter']:canvas.options['filter']); canvas.options['filter']=filter;
			var callback = (typeof options['callback']=='string'?options['callback']:canvas.options['callback']); canvas.options['callback']=callback;
			var ih = canvas.height; var iw = canvas.width; var ishade = shadow==0?0.1:shade/100; if(historical==true) nocorner = false;
			var ishadow = shadow==0?0.33:shadow/100; var itilt = (tilt.match(/^[lnr]/i)?tilt.substr(0,1):'n');
			var icolor = (color.match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i)?color:'#f0f4ff');
			var tcolor = (textcolor.match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i)?textcolor:'#000000');
			var bd = Math.round(((iw+ih)/2)*0.05); var db = Math.round(Math.max(iw,ih)*0.05); var os = bd/2; var sc = 1.333333; var ww=iw-(bd*2); var hh=ih-(bd*2); var hz=Math.round(hh/3);
			if(iw>ih) {var xs = 0.05; var ys = xs*(iw/ih);}else if(iw<ih) {var ys = 0.05; var xs = ys*(ih/iw);}else {var xs = 0.05; var ys = 0.05;} var r=nocorner?getRadius(bd,iw,ih):0;
			var f, it, rt, tw, ff, yo, xo, head, foot, shadow, shade, shine, frame, fill, txt="", over="", path="";
			if(document.all && document.namespaces && !window.opera) {
				if(canvas.tagName.toUpperCase() == "VAR") {
					f = (noshade==false?'t':'f'); it = parseInt(os*.75); if(itilt=='r') {rt=2.8; sc=0.95;}else if(itilt=='l') {rt=-2.8; sc=0.95;}else {rt=0; sc=1;}
					head = '<v:group style="rotation:'+rt+';zoom:'+sc+';display:'+canvas.dpl+';margin:0px;padding:0px;position:relative;width:'+iw+'px;height:'+ih+'px;" coordsize="'+iw+','+ih+'"><v:rect strokeweight="0" filled="f" stroked="f" fillcolor="transparent" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"><v:fill opacity="0" color="#000000" /></v:rect>';
					shadow = '<v:roundrect arcsize="'+r+'" strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="filter:progid:dxImageTransform.Microsoft.Blur(PixelRadius='+it+', MakeShadow=false) Alpha(opacity='+(ishadow*100)+'); zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:'+os+'px;left:'+os+'px;width:'+(iw-(2*os))+'px;height:'+(ih-(2*os))+'px;"><v:fill color="#000000" opacity="1" /></v:roundrect>';
					if(historical==false) {
						frame = '<v:roundrect arcsize="'+r+'" strokeweight="0" filled="t" stroked="f" fillcolor="'+icolor+'" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:0px;left:0px;width:'+(iw-os)+'px;height:'+(ih-os)+'px;"></v:roundrect>';
					}else {path = wavedPath(0,0,(iw-os)*10,(ih-os)*10,bd*10);
						frame = '<v:shape strokeweight="0" stroked="f" filled="t" fillcolor="'+icolor+'" coordorigin="0,0" coordsize="'+((iw-os)*10)+','+((ih-os)*10)+'" path="'+path+'" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:0px;left:0px;width:'+(iw-os)+'px;height:'+(ih-os)+'px;"></v:shape>';
					}
					shine = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="'+icolor+'" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:'+bd+'px;left:'+bd+'px;width:'+(iw-os-(2*bd))+'px;height:'+(ih-os-(2*bd))+'px;"><v:fill color="#000000" opacity="'+ishadow+'" /></v:rect>';
					shade = '<v:rect strokeweight="0" filled="'+f+'" stroked="f" fillcolor="transparent" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:'+bd+'px;left:'+bd+'px;width:'+(iw-os-(2*bd))+'px;height:'+hz+'px;"><v:fill method="sigma" type="gradient" angle="0" color="#000000" opacity="0" color2="#000000" o:opacity2="'+(ishade/2)+'" /></v:rect><v:rect strokeweight="0" filled="'+f+'" stroked="f" fillcolor="transparent" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:'+(ih-os-bd-hz)+'px;left:'+bd+'px;width:'+(iw-os-(2*bd))+'px;height:'+hz+'px;"><v:fill method="sigma" type="gradient" angle="0" color="#ffffff" opacity="'+(ishade*0.75)+'" color2="#ffffff" o:opacity2="0" /></v:rect><v:rect strokeweight="2" filled="f" stroked="t" strokecolor="'+icolor+'" fillcolor="transparent" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:'+bd+'px;left:'+bd+'px;width:'+(iw-os-(2*bd))+'px;height:'+(ih-os-(2*bd))+'px;"><v:fill color="#ffffff" opacity="0" /></v:rect>';
					if(typeof check_strokeTextCapability=='function' && text!='') {
						if(check_strokeTextCapability()) {
							over = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="'+icolor+'" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;left:'+(bd-1)+'px;top:'+(ih-1-os-(bd*(document.documentMode==8&&rt!=0?4:3)))+'px;width:'+(iw-os+2-(bd*2))+'px;height:'+(bd*3)+'px;"></v:rect>';
							text = get_widthText(text,ww,bd*1.5,attr[1],attr[2]); tw = get_textWidth(text,bd*1.5,attr[1],attr[2]); txt = get_strokeText(text,((iw-os)-tw)/2,ih-os-(bd*(document.documentMode==8&&rt!=0?3.4:2.4)),bd*1.5,attr[0],attr[1],attr[2],"sans-serif",tcolor,1,0);
							shade = '<v:rect strokeweight="0" filled="'+f+'" stroked="f" fillcolor="transparent" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:'+bd+'px;left:'+bd+'px;width:'+(iw-os-(2*bd))+'px;height:'+hz+'px;"><v:fill method="sigma" type="gradient" angle="0" color="#000000" opacity="0" color2="#000000" o:opacity2="'+(ishade/2)+'" /></v:rect><v:rect strokeweight="0" filled="'+f+'" stroked="f" fillcolor="transparent" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:'+(ih-os-(bd*3)-hz)+'px;left:'+bd+'px;width:'+(iw-os-(2*bd))+'px;height:'+hz+'px;"><v:fill method="sigma" type="gradient" angle="0" color="#ffffff" opacity="'+(ishade*0.75)+'" color2="#ffffff" o:opacity2="0" /></v:rect><v:rect strokeweight="2" filled="f" stroked="t" strokecolor="'+icolor+'" fillcolor="transparent" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:'+bd+'px;left:'+bd+'px;width:'+(iw-os-(2*bd))+'px;height:'+(ih-os-(4*bd))+'px;"><v:fill color="#ffffff" opacity="0" /></v:rect>';
						}
					}
					if(preserve==false) {
						fill = '<v:image src="'+canvas.source+'" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:'+bd+'px;left:'+bd+'px;width:'+(iw-os-(2*bd))+'px;height:'+(ih-os-(2*bd))+'px;"></v:image>';
					}else {
						if(iw>ih) {
							ff=(ih/iw); xo=0; yo=((ww*ff)-hh)/2; hh=(ww*ff); yo=(yo/(hh/100));
						}else if(iw<ih) {
							ff=(iw/ih); yo=0; xo=((hh*ff)-ww)/2; ww=(hh*ff); xo=(xo/(ww/100));
						}else {
							ff=1; xo=0; yo=0;
						}
						fill = '<v:image croptop="'+yo+'%" cropbottom="'+yo+'%" cropleft="'+xo+'%" cropright="'+xo+'%" src="'+canvas.source+'" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:'+bd+'px;left:'+bd+'px;width:'+(iw-os-(2*bd))+'px;height:'+(ih-os-(2*bd))+'px;"></v:image>';
					}
					foot = '</v:group>';
					canvas.innerHTML = head+shadow+frame+shine+fill+shade+over+txt+foot;
					if(typeof window[callback]==='function') {window[callback](canvas.id,'cvi_instant');}
				}
			}else {
				if(canvas.tagName.toUpperCase() == "CANVAS" && canvas.getContext("2d")) {
					it = Math.floor(Math.min(Math.max(bd/8,1),2));
					var context = canvas.getContext("2d"), prepared=(context.getImageData?true:false), alternate=false;
					var img = new Image();
					img.onload = function() {
						context.clearRect(0,0,iw,ih);
						context.save();
						if(itilt=='r') {
							context.translate(db,0); context.scale(1-(sc*xs),1-(sc*ys)); context.rotate(0.05);
						}else if(itilt=='n') {
							context.scale(1-(xs/1.5),1-(ys/1.5));
						}else if(itilt=='l') {
							context.translate(0,db); context.scale(1-(sc*xs),1-(sc*ys)); context.rotate(-0.05);
						}
						tiltShadow(context,os,os,iw,ih,os,ishadow,nocorner);
						if(historical==true) {wavedRect(context,0,0,iw,ih,bd); context.clip(); }else
						if(nocorner==true) {roundedRect(context,0,0,iw,ih,bd); context.clip(); }
						context.fillStyle = icolor;
						context.fillRect(0,0,iw,ih);
						context.fillStyle = 'rgba(0,0,0,'+ishadow+')';
						context.fillRect(bd,bd,iw-(bd*2),ih-(bd*2));
						if(!window.opera) {addLining(context,1.5,1.5,iw-3,ih-3,ishadow,it,false,icolor);}
						if(preserve==false) {
							if(prepared&&(typeof cvi_filter!='undefined')&&filter!=null&&filter.length>0) {ww=Math.round(ww); hh=Math.round(hh);
								var source=document.createElement('canvas'); source.height=hh+4; source.width=ww+4; var src=source.getContext("2d");
								var buffer=document.createElement('canvas'); buffer.height=hh; buffer.width=ww; var ctx=buffer.getContext("2d");
								if(src&&ctx) {alternate=true; ctx.clearRect(0,0,ww,hh); ctx.drawImage(img,0,0,ww,hh); 
									src.clearRect(0,0,ww+4,hh+4); src.drawImage(img,0,0,ww+4,hh+4); src.drawImage(img,2,2,ww,hh); 
									for(var i in filter) {cvi_filter.add(source,buffer,filter[i],ww,hh);}
								}
							}
  							if(alternate) {
								context.drawImage(source,2,2,ww,hh,bd,bd,ww,hh);
							}else {
								context.drawImage(img,bd,bd,ww,hh);
							}
						}else {
							if(iw>ih) {
								ff=(ih/iw); xo=0; yo=((ww*ff)-hh)/2; hh=(ww*ff);
							}else if(iw<ih) {
								ff=(iw/ih); yo=0; xo=((hh*ff)-ww)/2; ww=(hh*ff);
							}else {
								ff=1; xo=0; yo=0;
							}
							if(prepared&&(typeof cvi_filter!='undefined')&&filter!=null&&filter.length>0) {ww=Math.round(ww); hh=Math.round(hh);
								var source=document.createElement('canvas'); source.height=hh+4; source.width=ww+4; var src=source.getContext("2d");
								var buffer=document.createElement('canvas'); buffer.height=hh; buffer.width=ww; var ctx=buffer.getContext("2d");
								if(src&&ctx) {alternate=true; ctx.clearRect(0,0,ww,hh); ctx.drawImage(img,0,0,ww,hh); 
									src.clearRect(0,0,ww+4,hh+4); src.drawImage(img,0,0,ww+4,hh+4); src.drawImage(img,2,2,ww,hh); 
									for(var i in filter) {cvi_filter.add(source,buffer,filter[i],ww,hh);}
								}
							}
							context.save(); context.beginPath();  
  							context.rect(bd,bd,ww-(2*xo),hh-(2*yo));
  							context.closePath(); context.clip();
  							if(alternate) {
								context.drawImage(source,2,2,ww,hh,bd-xo,bd-yo,ww,hh);
							}else {
								context.drawImage(img,bd-xo,bd-yo,ww,hh);
							}
							context.restore();
						}
						if(typeof set_textRenderContext=='function' && text!='') {							set_textRenderContext(context);
							if(check_textRenderContext(context)) {
								context.save();
								context.beginPath(); context.rect(1,ih-(bd*3),iw-2,(bd*3)); 
								context.closePath(); context.fillStyle = icolor; context.fill();
								context.restore(); 
								if(noshade==false) {addShading(context,bd,bd,iw-(bd*2),ih-(bd*4),ishade);}
								if(!window.opera) {addLining(context,bd,bd,iw-(bd*2),ih-(bd*4),ishadow,it,true);}
								context.strokeStyle = hextorgba(tcolor,1); text=get_widthText(text,ww,bd*1.5,attr[1],attr[2]); tw=get_textWidth(text,bd*1.5,attr[1],attr[2]);
								context.strokeText(text,bd+((ww-tw)/2),ih-(bd*2.4),bd*1.5,attr[0],attr[1],attr[2]);
							}
						}else {
							if(noshade==false) {addShading(context,bd,bd,iw-(bd*2),ih-(bd*2),ishade);}
							if(!window.opera) {addLining(context,bd,bd,iw-(bd*2),ih-(bd*2),ishadow,it,true);}
						}
						context.restore();
						if(typeof window[callback]==='function') {window[callback](canvas.id,'cvi_instant');}
					}
					img.src = canvas.source;
				}
			}
		} catch (e) {
		}
	},

	replace : function(canvas) {
		var object = canvas.parentNode;
		var img = document.createElement('img');
		img.id = canvas.id;
		img.alt = canvas.alt;
		img.title = canvas.title;
		img.src = canvas.source;
		img.className = canvas.className;
		img.height = canvas.height;
		img.width = canvas.width;
		img.style.cssText = canvas.style.cssText;
		img.style.height = canvas.height+'px';
		img.style.width = canvas.width+'px';
		object.replaceChild(img,canvas);
	},

	remove : function(canvas) {
		if(document.all && document.namespaces && !window.opera) {
			if(canvas.tagName.toUpperCase() == "VAR") {
				cvi_instant.replace(canvas);
			}
		}else {
			if(canvas.tagName.toUpperCase() == "CANVAS") {
				cvi_instant.replace(canvas);
			}
		}
	}
}
