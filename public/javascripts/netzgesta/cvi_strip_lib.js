/**
 * cvi_strip_lib.js 1.21 (21-Mar-2009)
 * (c) by Christian Effenberger 
 * All Rights Reserved
 * Source: strip.netzgesta.de
 * Distributed under Netzgestade Software License Agreement
 * http://www.netzgesta.de/cvi/LICENSE.txt
 * License permits free of charge
 * use on non-commercial and 
 * private web sites only 
 * syntax:
	cvi_strip.defaultStrip = 100;		//INT  1-100 (% opacity)
	cvi_strip.defaultShine = 25;		//INT  1-100 (% opacity)
	cvi_strip.defaultShadow = 33;		//INT  1-100 (% opacity)
	cvi_strip.defaultColor = '#000000'; //STR '#000000'-'#ffffff'
	cvi_strip.defaultNoshadow = false;	//BOOLEAN
	cvi_strip.defaultSoftshadow = false;//BOOLEAN
	cvi_strip.remove( image );
	cvi_strip.add( image, options );
	cvi_strip.modify( image, options );
	cvi_strip.add( image, { strip: value, shine: value, shadow: value, color: value, noshadow: value, softshadow: value } );
	cvi_strip.modify( image, { strip: value, shine: value, shadow: value, color: value, noshadow: value, softshadow: value } );
 *
**/

function roundedRect(ctx,x,y,width,height,radius,nopath){
	if(!nopath) ctx.beginPath();
	ctx.moveTo(x,y+radius);
	ctx.lineTo(x,y+height-radius);
	ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
	ctx.lineTo(x+width-radius,y+height);
	ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
	ctx.lineTo(x+width,y+radius);
	ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
	ctx.lineTo(x+radius,y);
	ctx.quadraticCurveTo(x,y,x,y+radius);
	if(!nopath) ctx.closePath();
}
function addHoles(ctx,x,y,hw,hh,iw,ih,width,height,dir,tmp) {
	var ww = Math.round(hw/2)-tmp; var wh = Math.round(hh/2)-tmp;
	var ir = Math.max(Math.round(Math.max(ww,wh)/6),1);
	var ow = hw/4; var oh = hh/4; var op = window.opera?1:0;
	if(dir==0) {
		for(var j=0;j<8;j++){
			ctx.save(); roundedRect(ctx,x+ow+(j*hw),y+oh,ww,wh,ir);
			if(op) {ctx.fillStyle='rgba(0,0,0,1)'; ctx.fill();} ctx.clip(); 
			ctx.clearRect(x+ow+(j*hw),y+oh,ww,wh); ctx.restore();
			ctx.save(); roundedRect(ctx,x+ow+(j*hw),y+hh+ih+oh,ww,wh,ir);
			if(op) {ctx.fillStyle='rgba(0,0,0,1)'; ctx.fill();} ctx.clip(); 
			ctx.clearRect(x+ow+(j*hw),y+hh+ih+oh,ww,wh); ctx.restore();
		}	
	}else {
		for(var j=0;j<8;j++){
			ctx.save(); roundedRect(ctx,x+ow,y+oh+(j*hh),ww,wh,ir);
			if(op) {ctx.fillStyle='rgba(0,0,0,1)'; ctx.fill();} ctx.clip(); 
			ctx.clearRect(x+ow,y+oh+(j*hh),ww,wh); ctx.restore();
			ctx.save(); roundedRect(ctx,x+hw+iw+ow,y+oh+(j*hh),ww,wh,ir);
			if(op) {ctx.fillStyle='rgba(0,0,0,1)'; ctx.fill();} ctx.clip(); 
			ctx.clearRect(x+hw+iw+ow,y+oh+(j*hh),ww,wh); ctx.restore();
		}	
	}
}
function addRadialShadow(ctx,x1,y1,r1,x2,y2,r2,o) {
	var tmp = ctx.createRadialGradient(x1,y1,r1,x2,y2,r2);
	tmp.addColorStop(1,'rgba(0,0,0,'+o+')');
	tmp.addColorStop(0,'rgba(0,0,0,0)');
	return tmp;
}
function addLinearShadow(ctx,x,y,w,h,o) {
	var tmp = ctx.createLinearGradient(x,y,w,h);
	tmp.addColorStop(1,'rgba(0,0,0,'+o+')');
	tmp.addColorStop(0,'rgba(0,0,0,0)');
	return tmp;
}
function addHoleShadow(ctx,x,y,w,h,r,o,s) {
	var style; var os = r/2; 
	ctx.beginPath(); ctx.moveTo(x,y+r); ctx.lineTo(x,y+h-r); ctx.quadraticCurveTo(x,y+h,x+r,y+h);
	if(s==0) {ctx.lineTo(x+r,y+(r*2)); ctx.quadraticCurveTo(x+r,y+r,x+(r*2),y+r); ctx.lineTo(x+w,y+r);}
	else {ctx.lineTo(x+r,y+r); ctx.lineTo(x+w,y+r);}
	ctx.quadraticCurveTo(x+w,y,x+w-r,y); ctx.lineTo(x+r,y); ctx.quadraticCurveTo(x,y,x,y+r);
	ctx.fillStyle = 'rgba(0,0,0,'+(o*0.95)+')'; ctx.fill();
	if(s) {
		ctx.beginPath(); ctx.rect(x+(r*2),y+r,w-(r*2),r); ctx.closePath();
		style = addLinearShadow(ctx,x+(r*2),y+(r*2),x+(r*2),y+r,o);
		ctx.fillStyle = style; ctx.fill();
		ctx.beginPath(); ctx.rect(x+r,y+r,r,r); ctx.closePath();
		style = addRadialShadow(ctx,x+(r*2),y+(r*2),0,x+(r*2),y+(r*2),r,o);
		ctx.fillStyle = style; ctx.fill();
		ctx.beginPath(); ctx.rect(x+r,y+(r*2),r,h-(r*2)); ctx.closePath();
		style = addLinearShadow(ctx,x+(r*2),y+(r*2),x+r,y+(r*2),o);
		ctx.fillStyle = style; ctx.fill();
	}
}
function addHoleShadows(ctx,x,y,hw,hh,iw,ih,dir,opac,shadow) {
	var ww = Math.round(hw/2); var wh = Math.round(hh/2);
	var ir = Math.max(Math.round(Math.max(ww,wh)/6),1);
	var ow = hw/4; var oh = hh/4;
	if(dir==0) {
		for(var j=0;j<8;j++) {
			addHoleShadow(ctx,x+ow+(j*hw),y+oh,ww,wh,ir,opac,shadow);
			addHoleShadow(ctx,x+ow+(j*hw),y+hh+ih+oh,ww,wh,ir,opac,shadow);
		}	
	}else {
		for(var j=0;j<8;j++) {
			addHoleShadow(ctx,x+ow,y+oh+(j*hh),ww,wh,ir,opac,shadow);
			addHoleShadow(ctx,x+hw+iw+ow,y+oh+(j*hh),ww,wh,ir,opac,shadow);
		}	
	}
}
function addStripLight(ctx,x,y,width,height,shine) {
	var style = ctx.createLinearGradient(x,y,width,height);
	style.addColorStop(0.0,'rgba(254,254,254,'+shine+')');
	style.addColorStop(0.1,'rgba(254,254,254,0)');
	style.addColorStop(0.15,'rgba(254,254,254,0)');
	style.addColorStop(0.25,'rgba(254,254,254,'+shine+')');
	style.addColorStop(0.35,'rgba(254,254,254,0)');
	style.addColorStop(0.4,'rgba(254,254,254,0)');
	style.addColorStop(0.5,'rgba(254,254,254,'+shine+')');
	style.addColorStop(0.6,'rgba(254,254,254,0)');
	style.addColorStop(0.65,'rgba(254,254,254,0)');
	style.addColorStop(0.75,'rgba(254,254,254,'+shine+')');
	style.addColorStop(0.85,'rgba(254,254,254,0)');
	style.addColorStop(0.9,'rgba(254,254,254,0)');
	style.addColorStop(1.0,'rgba(254,254,254,'+shine+')');
	ctx.fillStyle = style;
	ctx.beginPath();
	ctx.rect(x,y,width,height);
	ctx.closePath();
	ctx.fill();
}
function addStripShadow(ctx,x,y,w,h,wd,opac) {
	var style; wd = Math.max(wd,1);
	ctx.fillStyle = 'rgba(0,0,0,'+(opac*0.75)+')'; ctx.fillRect(x,y,w,h);
	style = ctx.createLinearGradient(x,y,x,y-wd); style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(1,'rgba(0,0,0,0)');
	ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-wd,y-wd); ctx.lineTo(x+w+wd,y-wd); ctx.lineTo(x+w,y); ctx.closePath();
	ctx.fillStyle = style; ctx.fill();
	style = ctx.createLinearGradient(x,y,x-wd,y); style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(1,'rgba(0,0,0,0)');
	ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-wd,y-wd); ctx.lineTo(x-wd,y+h+wd); ctx.lineTo(x,y+h); ctx.closePath();
	ctx.fillStyle = style; ctx.fill();
	style = ctx.createLinearGradient(x,y+h,x,y+h+wd); style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(1,'rgba(0,0,0,0)');
	ctx.beginPath(); ctx.moveTo(x,y+h); ctx.lineTo(x-wd,y+h+wd); ctx.lineTo(x+w+wd,y+h+wd); ctx.lineTo(x+w,y+h); ctx.closePath();
	ctx.fillStyle = style; ctx.fill();
	style = ctx.createLinearGradient(x+w,y,x+w+wd,y); style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(1,'rgba(0,0,0,0)');
	ctx.beginPath(); ctx.moveTo(x+w,y+h); ctx.lineTo(x+w+wd,y+h+wd); ctx.lineTo(x+w+wd,y-wd); ctx.lineTo(x+w,y); ctx.closePath();
	ctx.fillStyle = style; ctx.fill();
}
function hextorgba(val,trans) {
	function hex2dec(hex){return(Math.max(0,Math.min(parseInt(hex,16),255)));}
	var cr=hex2dec(val.substr(1,2)),cg=hex2dec(val.substr(3,2)),cb=hex2dec(val.substr(5,2));
	return 'rgba('+cr+','+cg+','+cb+','+trans+')';
}

var cvi_strip = {
	defaultStrip : 100,
	defaultShine : 25,
	defaultShadow : 33,
	defaultColor : '#000000',
	defaultNoshadow: false,
	defaultSoftshadow: false,
	add: function(image, options) {
		if(image.tagName.toUpperCase() == "IMG") {
			var defopts = { "strip" : cvi_strip.defaultStrip, "shine" : cvi_strip.defaultShine, "shadow" : cvi_strip.defaultShadow, "color" : cvi_strip.defaultColor, "noshadow" : cvi_strip.defaultNoshadow, "softshadow" : cvi_strip.defaultSoftshadow }
			if(options) {
				for(var i in defopts) { if(!options[i]) { options[i] = defopts[i]; }}
			}else {
				options = defopts;
			}
			var imageWidth  = ('iwidth'  in options) ? parseInt(options.iwidth)  : image.width;
			var imageHeight = ('iheight' in options) ? parseInt(options.iheight) : image.height;
			try {
				var object = image.parentNode; 
				var size = Math.max(imageWidth,imageHeight);
				if(document.all && document.namespaces && !window.opera) {
					if(document.namespaces['v']==null) {
						var e=["shape","shapetype","group","background","path","formulas","handles","fill","stroke","shadow","textbox","textpath","imagedata","line","polyline","curve","roundrect","oval","rect","arc","image"],s=document.createStyleSheet(); 
						for(var i=0; i<e.length; i++) {s.addRule("v\\:"+e[i],"behavior: url(#default#VML);");} document.namespaces.add("v","urn:schemas-microsoft-com:vml");
					}
					var display = (image.currentStyle.display.toLowerCase()=='block')?'block':'inline-block';        
					var canvas = document.createElement(['<var style="zoom:1;overflow:hidden;display:'+display+';width:'+imageWidth+'px;height:'+imageHeight+'px;padding:0;">'].join(''));
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
					canvas.height = size;
					canvas.width = size;
					canvas.iheight = imageHeight;
					canvas.iwidth = imageWidth;
					object.replaceChild(canvas,image);
					cvi_strip.modify(canvas, options);
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
						canvas.style.height = size+'px';
						canvas.style.width = size+'px';
						canvas.height = size;
						canvas.width = size;
						canvas.iheight = imageHeight;
						canvas.iwidth = imageWidth;
						object.replaceChild(canvas,image);
						cvi_strip.modify(canvas, options);
					}
				}
			} catch (e) {
			}
		}
	},
	
	modify: function(canvas, options) {
		try {
			var strip = (typeof options['strip']=='number'?options['strip']:canvas.options['strip']); canvas.options['strip']=strip;
			var shine = (typeof options['shine']=='number'?options['shine']:canvas.options['shine']); canvas.options['shine']=shine;
			var shadow = (typeof options['shadow']=='number'?options['shadow']:canvas.options['shadow']); canvas.options['shadow']=shadow;
			var color = (typeof options['color']=='string'?options['color']:canvas.options['color']); canvas.options['color']=color;
			var noshadow = (typeof options['noshadow']=='boolean'?options['noshadow']:canvas.options['noshadow']); canvas.options['noshadow']=noshadow;
			var softshadow = (typeof options['softshadow']=='boolean'?options['softshadow']:canvas.options['softshadow']); canvas.options['softshadow']=softshadow;
			var sz = canvas.height; var h = canvas.iheight; var w = canvas.iwidth;
			var istrip = strip==0?1:strip/100; var ishine = shine==0?0.25:shine/100; var ishadow = shadow==0?0.33:shadow/100; 
			var icolor = (color.match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i)?color:'#000000');
			var rt = 0.66666667; var os = 0; if(noshadow==false) {os = Math.max(Math.round(sz*0.025),1); }
			var is = Math.max(Math.round(os/2),1); var dir, wd, ht, xoff, yoff, hw, hh, ff, whf, ih, iw, ix, iy;
			if(w>=h) {
				dir = 0; wd = sz-os-(2*is); ht = Math.round(wd*rt);  
				yoff = is+((wd-ht)*0.5); xoff = is; hw = (sz-os)/8; hh = yoff; ff = h/w;
				if(ff>=rt) {
					whf = ht/h; ih = ht; iy = yoff; iw = Math.round(w*whf); ix = xoff+((wd-iw)*0.5);
				}else {
					whf = wd/w; iw = wd; ix = xoff; ih = Math.round(h*whf); iy = yoff+((ht-ih)*0.5); 
				}
			}else {
				dir = 1; ht = sz-os-(2*is); wd = Math.round(ht*rt); 
				xoff = is+((ht-wd)*0.5); yoff = is; hh = (sz-os)/8; hw = xoff; ff = w/h;
				if(ff>=rt) {
					whf = wd/w; iw = wd; ix = xoff; ih = Math.round(h*whf); iy = yoff+((ht-ih)*0.5); 
				}else {
					whf = ht/h; ih = ht; iy = yoff; iw = Math.round(w*whf); ix = xoff+((wd-iw)*0.5);
				}
			}
			var head, foot, fill, shade = '';
			if(document.all && document.namespaces && !window.opera) {
				if(canvas.tagName.toUpperCase() == "VAR") {
					dir = (dir==1?90:0);
					head = '<v:group style="zoom:1;display:'+canvas.dpl+';margin:0;padding:0;position:relative;width:'+sz+'px;height:'+sz+'px;" coordsize="'+sz+','+sz+'"><v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:'+sz+'px;height:'+sz+'px;"><v:fill color="#ffffff" opacity="0" /></v:rect>';
					if(noshadow==false) shade = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="800,800" path="m 0,0 l 800,0,800,66,775,66,775,45 qy 762,33 l 737,33 qx 725,45 l 725,66,675,66,675,45 qy 662,33 l 637,33 qx 625,45 l 625,66,575,66,575,45 qy 562,33 l 537,33 qx 525,45 l 525,66,475,66,475,45 qy 462,33 l 437,33 qx 425,45 l 425,66,375,66,375,45 qy 362,33 l 337,33 qx 325,45 l 325,66,275,66,275,45 qy 262,33 l 237,33 qx 225,45 l 225,66,175,66,175,45 qy 162,33 l 137,33 qx 125,45 l 125,66,75,66,75,45 qy 62,33 l 37,33 qx 25,45 l 25,88 qy 37,100 l 63,100 qx 75,88 l 75,66,125,66,125,88 qy 137,100 l 163,100 qx 175,88 l 175,66,225,66,225,88 qy 237,100 l 263,100 qx 275,88 l 275,66,325,66,325,88 qy 337,100 l 363,100 qx 375,88 l 375,66,425,66,425,88 qy 437,100 l 463,100 qx 475,88 l 475,66,525,66,525,88 qy 537,100 l 563,100 qx 575,88 l 575,66,625,66,625,88 qy 637,100 l 663,100 qx 675,88 l 675,66,725,66,725,88 qy 737,100 l 763,100 qx 775,88 l 775,66,800,66,800,733,775,733,775,712 qy 762,700 l 737,700 qx 725,712 l 725,733,675,733,675,712 qy 662,700 l 637,700 qx 625,712 l 625,733,575,733,575,712 qy 562,700 l 537,700 qx 525,712 l 525,733,475,733,475,712 qy 462,700 l 437,700 qx 425,712 l 425,733,375,733,375,712 qy 362,700 l 337,700 qx 325,712 l 325,733,275,733,275,712 qy 262,700 l 237,700 qx 225,712 l 225,733,175,733,175,712 qy 162,700 l 137,700 qx 125,712 l 125,733,75,733,75,712 qy 62,700 l 37,700 qx 25,712 l 25,755 qy 37,767 l 63,767 qx 75,755 l 75,733,125,733,125,755 qy 137,767 l 163,767 qx 175,755 l 175,733, 225,733,225,755 qy 237,767 l 263,767 qx 275,755 l 275,733,325,733,325,755 qy 337,767 l 363,767 qx 375,755 l 375,733,425,733,425,755 qy 437,767 l 463,767 qx 475,755 l 475,733,525,733,525,755 qy 537,767 l 563,767 qx 575,755 l 575,733,625,733,625,755 qy 637,767 l 663,767 qx 675,755 l 675,733,725,733,725,755 qy 737,767 l 763,767 qx 775,755 l 775,733,800,733,800,800,0,800 x e" style="filter:Alpha(opacity='+(ishadow*100)+'), progid:dxImageTransform.Microsoft.Blur(PixelRadius='+is+', MakeShadow=false); zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+is+'px;left:'+is+'px;width:'+(sz-os-is)+'px;height:'+(sz-os-is)+'px;rotation:'+dir+';"><v:fill color="#000000" opacity="1" /></v:shape>'; 
					fill = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="'+icolor+'" coordorigin="0,0" coordsize="800,800" path="m 0,0 l 800,0,800,66,775,66,775,45 qy 762,33 l 737,33 qx 725,45 l 725,66,675,66,675,45 qy 662,33 l 637,33 qx 625,45 l 625,66,575,66,575,45 qy 562,33 l 537,33 qx 525,45 l 525,66,475,66,475,45 qy 462,33 l 437,33 qx 425,45 l 425,66,375,66,375,45 qy 362,33 l 337,33 qx 325,45 l 325,66,275,66,275,45 qy 262,33 l 237,33 qx 225,45 l 225,66,175,66,175,45 qy 162,33 l 137,33 qx 125,45 l 125,66,75,66,75,45 qy 62,33 l 37,33 qx 25,45 l 25,88 qy 37,100 l 63,100 qx 75,88 l 75,66,125,66,125,88 qy 137,100 l 163,100 qx 175,88 l 175,66,225,66,225,88 qy 237,100 l 263,100 qx 275,88 l 275,66,325,66,325,88 qy 337,100 l 363,100 qx 375,88 l 375,66,425,66,425,88 qy 437,100 l 463,100 qx 475,88 l 475,66,525,66,525,88 qy 537,100 l 563,100 qx 575,88 l 575,66,625,66,625,88 qy 637,100 l 663,100 qx 675,88 l 675,66,725,66,725,88 qy 737,100 l 763,100 qx 775,88 l 775,66,800,66,800,733,775,733,775,712 qy 762,700 l 737,700 qx 725,712 l 725,733,675,733,675,712 qy 662,700 l 637,700 qx 625,712 l 625,733,575,733,575,712 qy 562,700 l 537,700 qx 525,712 l 525,733,475,733,475,712 qy 462,700 l 437,700 qx 425,712 l 425,733,375,733,375,712 qy 362,700 l 337,700 qx 325,712 l 325,733,275,733,275,712 qy 262,700 l 237,700 qx 225,712 l 225,733,175,733,175,712 qy 162,700 l 137,700 qx 125,712 l 125,733,75,733,75,712 qy 62,700 l 37,700 qx 25,712 l 25,755 qy 37,767 l 63,767 qx 75,755 l 75,733,125,733,125,755 qy 137,767 l 163,767 qx 175,755 l 175,733, 225,733,225,755 qy 237,767 l 263,767 qx 275,755 l 275,733,325,733,325,755 qy 337,767 l 363,767 qx 375,755 l 375,733,425,733,425,755 qy 437,767 l 463,767 qx 475,755 l 475,733,525,733,525,755 qy 537,767 l 563,767 qx 575,755 l 575,733,625,733,625,755 qy 637,767 l 663,767 qx 675,755 l 675,733,725,733,725,755 qy 737,767 l 763,767 qx 775,755 l 775,733,800,733,800,800,0,800 x e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:'+(sz-os)+'px;height:'+(sz-os)+'px;rotation:'+dir+';"><v:fill method="linear" color="'+icolor+'" opacity="'+istrip+'" /></v:shape>'; 
					foot = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+iy+'px;left:'+ix+'px;width:'+iw+'px;height:'+ih+'px;"><v:fill src="'+canvas.source+'" type="frame" /></v:rect></v:group>';
					canvas.innerHTML = head+shade+fill+foot;
				}
			}else {
				if(canvas.tagName.toUpperCase() == "CANVAS" && canvas.getContext("2d")) {
					var context = canvas.getContext("2d");
					var img = new Image();
					img.onload = function() {
						context.clearRect(0,0,sz,sz);
						context.save();  
						if(noshadow==false) addStripShadow(context,os*2,os*2,sz-(3*os),sz-(3*os),os,ishadow);
						context.fillStyle = hextorgba(icolor,istrip); 
						context.fillRect(0,0,sz-os,sz-os);
						addStripLight(context,0,0,sz-os,sz-os,ishine);
						context.save(); 
						if(window.opera) {context.globalCompositeOperation = "destination-out";}
						addHoles(context,0,0,hw,hh,wd,ht,sz,sz,dir,0);
						context.restore();
						if(noshadow==false) addHoleShadows(context,0,0,hw,hh,wd,ht,dir,ishadow,softshadow);
						context.drawImage(img,ix,iy,iw,ih);
						context.restore();
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
		img.style.cssText = canvas.style.cssText;
		img.style.height = canvas.iheight+'px';
		img.style.width = canvas.iwidth+'px';
		object.replaceChild(img,canvas);
	},

	remove : function(canvas) {
		if(document.all && document.namespaces && !window.opera) {
			if(canvas.tagName.toUpperCase() == "VAR") {
				cvi_strip.replace(canvas);
			}
		}else {
			if(canvas.tagName.toUpperCase() == "CANVAS") {
				cvi_strip.replace(canvas);
			}
		}
	}
}