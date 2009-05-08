/**
 * cvi_slide_lib.js 1.32 (21-Mar-2009)
 * (c) by Christian Effenberger 
 * All Rights Reserved
 * Source: slide.netzgesta.de
 * Distributed under Netzgestade Software License Agreement
 * http://www.netzgesta.de/cvi/LICENSE.txt
 * License permits free of charge
 * use on non-commercial and 
 * private web sites only 
 * syntax:
	cvi_slide.defaultShade = 50;				//INT  0-100 (% opacity)
	cvi_slide.defaultShadow = 40;				//INT  1-100 (% opacity)
	cvi_slide.defaultColor = 0; 				//STR '#000000'-'#ffffff' or 0
	cvi_slide.defaultColor2 = 0;				//STR '#000000'-'#ffffff' or 0
	cvi_slide.defaultGradient = 'd';			//STR  'd|h|v'-'diagonally|horizontal|vertical'
	cvi_slide.defaultNoshadow = false;			//BOOLEAN
	cvi_slide.defaultNocircles = false;			//BOOLEAN
	
	depends on: cvi_text_lib.js
		cvi_slide.defaultTextcolor = '#000000';	//STR '#000000'-'#ffffff'
		cvi_slide.defaultFontattr = [100,100,100];//OBJ [1-200==weight, 10-400==width, 10-1000==space]
		cvi_slide.defaultText = '';				//STR
	
	cvi_slide.remove( image );
	cvi_slide.add( image, options );
	cvi_slide.modify( image, options );
	cvi_slide.add( image, { shade: value, shadow: value, color: value, color2: value, gradient: value, noshadow: value, nocircles: value } );
	cvi_slide.modify( image, { shade: value, shadow: value, color: value, color2: value, gradient: value, noshadow: value, nocircles: value } );
 *
**/

function hextorgba(val,trans) {
	function hex2dec(hex){return(Math.max(0,Math.min(parseInt(hex,16),255)));}
	var cr=hex2dec(val.substr(1,2)),cg=hex2dec(val.substr(3,2)),cb=hex2dec(val.substr(5,2));
	return 'rgba('+cr+','+cg+','+cb+','+trans+')';
}
function roundedRect(ctx,x,y,width,height,radius,nopath) {
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
function addShadowing(ctx,x,y,width,height,radius,opacity) {
	var style; var os = radius/2;
	ctx.beginPath(); ctx.rect(x+radius,y,width-(radius*2),os); ctx.closePath();
	style = addLinearStyle(ctx,x+radius,y+os,x+radius,y,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y,radius,radius); ctx.closePath();
	style = addRadialStyle(ctx,x+radius,y+radius,radius-os,x+radius,y+radius,radius,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y+radius,os,height-(radius*2)); ctx.closePath();
	style = addLinearStyle(ctx,x+os,y+radius,x,y+radius,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y+height-radius,radius,radius); ctx.closePath();
	style = addRadialStyle(ctx,x+radius,y+height-radius,radius-os,x+radius,y+height-radius,radius,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+radius,y+height-os,width-x-(radius*2),os); ctx.closePath();
	style = addLinearStyle(ctx,x+radius,y+height-os,x+radius,y+height,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(width-radius,height-radius,x+radius,y+radius); ctx.closePath();
	style = addRadialStyle(ctx,width-radius,height-radius,radius-os+x,width-radius,height-radius,y+radius,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+width-os,y+radius,os,height-y-(radius*2)); ctx.closePath();
	style = addLinearStyle(ctx,x+width-os,y+radius,x+width,y+radius,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+width-radius,y,radius,radius); ctx.closePath();
	style = addRadialStyle(ctx,x+width-radius,y+radius,radius-os,x+width-radius,y+radius,radius,opacity);
	ctx.fillStyle = style; ctx.fill();
}
function addShadeing(ctx,x,y,width,height,radius,opacity) {
	var style; var os = radius/2;
	ctx.beginPath(); ctx.rect(x+radius,y,width-radius,y+os); ctx.closePath();
	style = addLinearShine(ctx,x+radius,y+os,x+radius,y,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y,radius,radius); ctx.closePath();
	style = addRadialShine(ctx,x+radius,y+radius,radius-os,x+radius,y+radius,radius,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y+radius,os,height-radius); ctx.closePath();
	style = addLinearShine(ctx,x+os,y+radius,x,y+radius,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x,y+height-os,width-radius,os); ctx.closePath();
	style = addLinearShade(ctx,x+radius,y+height-os,x+radius,y+height,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+width-radius,y+height-radius,radius,radius); ctx.closePath();
	style = addRadialShade(ctx,x+width-radius,y+height-radius,radius-os,x+width-radius,y+height-radius,radius,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+width-os,y,os,height-radius); ctx.closePath();
	style = addLinearShade(ctx,x+width-os,y+radius,x+width,y+radius,opacity);
	ctx.fillStyle = style; ctx.fill();
}
function addTextFrame(ctx,x,y,width,height,opacity,vertical) {
	var style, radius = vertical?width/2:height/2, opac = Math.max(parseFloat(opacity/2),0.1); ctx.lineWidth = 1;
	if(vertical) {
		ctx.beginPath(); ctx.moveTo(x,y+height-radius); ctx.lineTo(x,y+radius); ctx.quadraticCurveTo(x,y,x+radius,y);
		ctx.quadraticCurveTo(x+width,y,x+width,y+radius); style = ctx.createLinearGradient(x,y,x+width,y);
		style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(0.8,'rgba(0,0,0,'+opac+')');
		style.addColorStop(1,'rgba(254,254,254,'+opac+')'); ctx.strokeStyle = style; ctx.stroke();
		ctx.beginPath(); ctx.moveTo(x+width,y+radius); ctx.lineTo(x+width,y+height-radius); 
		ctx.quadraticCurveTo(x+width,y+height,x+radius,y+height);
		ctx.quadraticCurveTo(x,y+height,x,y+height-radius); style = ctx.createLinearGradient(x,y,x+width,y);
		style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(0.2,'rgba(254,254,254,'+opac+')');
		style.addColorStop(1,'rgba(254,254,254,'+opac+')'); ctx.strokeStyle = style; ctx.stroke();
	}else {
		ctx.beginPath(); ctx.moveTo(x+width-radius,y); ctx.lineTo(x+radius,y); ctx.quadraticCurveTo(x,y,x,y+radius);
		ctx.quadraticCurveTo(x,y+height,x+radius,y+height); style = ctx.createLinearGradient(x,y,x,y+height);
		style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(0.8,'rgba(0,0,0,'+opac+')');
		style.addColorStop(1,'rgba(254,254,254,'+opac+')'); ctx.strokeStyle = style; ctx.stroke();
		ctx.beginPath(); ctx.moveTo(x+radius,y+height); ctx.lineTo(x+width-radius,y+height);
		ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius); ctx.lineTo(x+width,y+radius);
		ctx.quadraticCurveTo(x+width,y,x+width-radius,y); style = ctx.createLinearGradient(x,y,x,y+height);
		style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(0.2,'rgba(254,254,254,'+opac+')'); 
		style.addColorStop(1,'rgba(254,254,254,'+opac+')'); ctx.strokeStyle = style; ctx.stroke();
	}
}
function addFraming(ctx,x,y,width,height,wide,opacity) {
	var style; wide = Math.max(wide,2); var opac = Math.max(parseFloat(opacity/1.6),0.1);
	style = ctx.createLinearGradient(x,y,x,y-wide); style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(1,'rgba(0,0,0,0)');
	ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-wide,y-wide); ctx.lineTo(x+width+wide,y-wide); ctx.lineTo(x+width,y); ctx.closePath(); ctx.fillStyle = style; ctx.fill();
	style = ctx.createLinearGradient(x,y,x-wide,y); style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(1,'rgba(0,0,0,0)');
	ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-wide,y-wide); ctx.lineTo(x-wide,y+height+wide); ctx.lineTo(x,y+height); ctx.closePath(); ctx.fillStyle = style; ctx.fill();
	style = ctx.createLinearGradient(x,y+height,x,y+height+wide); style.addColorStop(0,'rgba(254,254,254,'+opacity+')'); style.addColorStop(1,'rgba(254,254,254,0)');
	ctx.beginPath(); ctx.moveTo(x,y+height); ctx.lineTo(x-wide,y+height+wide); ctx.lineTo(x+width+wide,y+height+wide); ctx.lineTo(x+width,y+height); ctx.closePath(); ctx.fillStyle = style; ctx.fill();
	style = ctx.createLinearGradient(x+width,y,x+width+wide,y); style.addColorStop(0,'rgba(254,254,254,'+opacity+')'); style.addColorStop(1,'rgba(254,254,254,0.0)');
	ctx.beginPath(); ctx.moveTo(x+width,y+height); ctx.lineTo(x+width+wide,y+height+wide); ctx.lineTo(x+width+wide,y-wide); ctx.lineTo(x+width,y); ctx.closePath(); ctx.fillStyle = style; ctx.fill();
}
function addCircles(ctx,x,y,width,height,radius,opacity) {
	var style = '';	var opac = Math.max(parseFloat(opacity/1.6),0.1);
	ctx.lineWidth = Math.max(radius/8,1);
	ctx.beginPath(); ctx.arc(x+radius,y+radius,radius/4,0,Math.PI*2,true);
	style = ctx.createLinearGradient(x+(radius*0.75),y+(radius*0.75),x+(radius*1.2),y+(radius*1.2));
	style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(1,'rgba(254,254,254,'+opacity+')');
	ctx.strokeStyle = style; ctx.stroke();
	ctx.beginPath(); ctx.arc(x+width-radius,y+radius,radius/4,0,Math.PI*2,true);
	style = ctx.createLinearGradient(x+width-(radius*1.25),y+(radius*0.75),x+width-(radius*0.725),y+(radius*1.2));
	style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(1,'rgba(254,254,254,'+opacity+')');
	ctx.strokeStyle = style; ctx.stroke();
	ctx.beginPath(); ctx.arc(x+radius,y+height-radius,radius/4,0,Math.PI*2,true);
	style = ctx.createLinearGradient(x+(radius*0.75),y+height-(radius*1.25),x+(radius*1.2),y+height-(radius*0.725));
	style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(1,'rgba(254,254,254,'+opacity+')');
	ctx.strokeStyle = style; ctx.stroke();
	ctx.beginPath(); ctx.arc(x+width-radius,y+height-radius,radius/4,0,Math.PI*2,true);
	style = ctx.createLinearGradient(x+width-(radius*1.25),y+height-(radius*1.25),x+width-(radius*0.725),y+height-(radius*0.725));
	style.addColorStop(0,'rgba(0,0,0,'+opac+')'); style.addColorStop(1,'rgba(254,254,254,'+opacity+')');
	ctx.strokeStyle = style; ctx.stroke();
}

var cvi_slide = {
	defaultShade : 50,
	defaultShadow : 40,
	defaultColor : 0,
	defaultColor2 : 0,
	defaultGradient: 'diagonally',
	defaultNoshadow: false,
	defaultNocircles: false,
	defaultTextcolor: '#000000',
	defaultFontattr: [100,100,100],
	defaultText : '',
	add: function(image, options) {
		if(image.tagName.toUpperCase() == "IMG") {
			var defopts = { "shade" : cvi_slide.defaultShade, "shadow" : cvi_slide.defaultShadow, "color" : cvi_slide.defaultColor, "color2" : cvi_slide.defaultColor2, "gradient" : cvi_slide.defaultGradient, "noshadow" : cvi_slide.defaultNoshadow, "nocircles" : cvi_slide.defaultNocircles, "textcolor" : cvi_slide.defaultTextcolor, "fontattr": cvi_slide.defaultFontattr, "text" : cvi_slide.defaultText }
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
					cvi_slide.modify(canvas, options);
				}else {
					var canvas = document.createElement('canvas');
					if(canvas.getContext("2d")) {
						canvas.options = options;
						canvas.isOP = window.opera?1:0;
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
						cvi_slide.modify(canvas, options);
					}
				}
			} catch (e) {
			}
		}
	},
	
	modify: function(canvas, options) {
		try {
			var shade = (typeof options['shade']=='number'?options['shade']:canvas.options['shade']); canvas.options['shade']=shade;
			var shadow = (typeof options['shadow']=='number'?options['shadow']:canvas.options['shadow']); canvas.options['shadow']=shadow;
			var color = (typeof options['color']=='string'?options['color']:canvas.options['color']); canvas.options['color']=color;
			var color2 = (typeof options['color2']=='string'?options['color2']:canvas.options['color2']); canvas.options['color2']=color2;
			var gradient = (typeof options['gradient']=='string'?options['gradient']:canvas.options['gradient']); canvas.options['gradient']=gradient;
			var noshadow = (typeof options['noshadow']=='boolean'?options['noshadow']:canvas.options['noshadow']); canvas.options['noshadow']=noshadow;
			var nocircles = (typeof options['nocircles']=='boolean'?options['nocircles']:canvas.options['nocircles']); canvas.options['nocircles']=nocircles;
			var textcolor = (typeof options['textcolor']=='string'?options['textcolor']:canvas.options['textcolor']); canvas.options['textcolor']=textcolor;
			var attr = (typeof options['fontattr']=='object'?options['fontattr']:canvas.options['fontattr']); canvas.options['fontattr']=attr;
			var text = (typeof options['text']=='string'?options['text']:canvas.options['text']); canvas.options['text']=text;
			var sz = canvas.height; var h = canvas.iheight; var w = canvas.iwidth;
			var ishade = shade==0?0.5:shade/100; var ishadow = shadow==0?0.4:shadow/100; 
			var icolor = 0; if(isNaN(color)) var icolor = (color.match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i)?color:0);
			var icolor2 = 0; if(isNaN(color2)) var icolor2 = (color2.match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i)?color2:0);
			var tcolor = (textcolor.match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i)?textcolor:'#000000');
			var igradient = (gradient.match(/^[dhv]/i)?gradient.substr(0,1):'d');
			var ro = 0.66666667; var ir = Math.max(Math.round((sz/2)*0.2),4);
			var sr = ir*0.75; var r = ir; var is = 0; var pos = ir; var os = ir/4;
			var tmp = '', shado='', shade='', fill='', txt='';
			var th, tw, io, os, wide, deep, rus, ww, hh, xoff, yoff, whf, iw, ih, ix, iy, ff, style, angle, head, foot;
			if(document.all && document.namespaces && !window.opera) {
				if(noshadow==false) {
					ir = 10; sr = ir*0.75; r = sr; sr = r*0.75; os = Math.round((sz/ir)/4); is = os; pos = os*3; wide = os; deep = Math.round(pos/2.5); rus = Math.round(pos/4);
					shado = '<v:roundrect arcsize="'+ir+'%" strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="filter:Alpha(opacity='+(ishadow*100)+'), progid:dxImageTransform.Microsoft.Blur(PixelRadius='+is+', MakeShadow=false); zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+(0.5*is)+'px;left:'+(0.5*is)+'px;width:'+(sz-(2.5*is))+'px;height:'+(sz-(2.5*is))+'px;"><v:fill color="#000000" opacity="1" /></v:roundrect>';
					tmp = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:'+sz+'px;height:'+sz+'px;"><v:fill color="#ffffff" opacity="0" /></v:rect>';
				}else {
					ir = 10; r = ir; sr = ir*0.75; is = 0; os = Math.round((sz/ir)/4); pos = os*4; wide = os; deep = Math.round(pos/2.5); rus = os;
				}
			}else {
				if(noshadow==false) {ir = Math.round(ir/4)*4; os = ir/4; sr = ir*0.75; is = os; r = sr; sr = r*0.75; pos = sr;}
			}
			if(w>=h) {
				io = 0; ww = sz-(pos*2)-(is*4); hh = Math.round(ww*ro); yoff = pos+is+((ww-hh)*0.5); xoff = pos+is; ff = h/w;
				if(ff>=ro) {
					whf = hh/h; ih = hh; iy = yoff; iw = Math.round(w*whf); ix = xoff+((ww-iw)*0.5);
				}else {
					whf = ww/w; iw = ww; ix = xoff; ih = Math.round(h*whf); iy = yoff+((hh-ih)*0.5); 
				}
			}else {
				io = 1; hh = sz-(pos*2)-(is*4); ww = Math.round(hh*ro); xoff = pos+is+((hh-ww)*0.5); yoff = pos+is; ff = w/h;
				if(ff>=ro) {
					whf = ww/w; iw = ww; ix = xoff; ih = Math.round(h*whf); iy = yoff+((hh-ih)*0.5); 
				}else {
					whf = hh/h; ih = hh; iy = yoff; iw = Math.round(w*whf); ix = xoff+((ww-iw)*0.5);
				}
			}		
			if(document.all && document.namespaces && !window.opera) {
				if(canvas.tagName.toUpperCase() == "VAR") {
					if(isNaN(icolor)) {
						fill = '<v:roundrect arcsize="'+r+'%" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:'+(sz-(is*2))+'px;height:'+(sz-(is*2))+'px;">';
						if(isNaN(icolor2)) {
							if(igradient=='h') {angle = 90; }else if(igradient=='v') {angle = 0; }else { angle = 45; }
							fill = fill+'<v:fill method="sigma" type="gradient" angle="'+angle+'" color="'+icolor2+'" color2="'+icolor+'" /></v:roundrect>';
						}else {
							fill = fill+'<v:fill color="'+icolor+'" /></v:roundrect>';
						}
					}
					shade = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="'+(sz-(is*2))+','+deep+'" path="m '+pos+','+deep+' l '+(sz-rus-(is*2))+','+deep+' qy '+(sz-pos-(is*2))+',0 l '+pos+',0 qx '+rus+','+deep+' x e" style="position:absolute;margin:0;top:0px;left:0px;width:'+(sz-(is*2))+'px;height:'+deep+'px;"><v:fill method="linear" type="gradient" angle="0" color="#ffffff" opacity="0" color2="#ffffff" o:opacity2="'+ishade+'" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="'+deep+','+(sz-(is*2))+'" path="m 0,'+pos+' l 0,'+(sz-pos-(is*2))+' qy '+deep+','+(sz-rus-(is*2))+' l '+deep+','+rus+' qx 0,'+pos+' x e" style="position:absolute;margin:0;top:0px;left:0px;width:'+deep+'px; height:'+(sz-(is*2))+'px;"><v:fill method="linear" type="gradient" angle="90" color="#ffffff" opacity="0" color2="#ffffff" o:opacity2="'+ishade+'" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+(sz-(is*2))+','+deep+'" path="m '+pos+','+deep+' l '+(sz-rus-(is*2))+','+deep+' qy '+(sz-pos-(is*2))+',0 l '+pos+',0 qx '+rus+','+deep+' x e" style="position:absolute;margin:0;top:'+(sz-deep-(is*2))+'px;left:0px;width:'+(sz-(is*2))+'px;height:'+deep+'px;flip:y;"><v:fill method="linear" type="gradient" angle="180" color="#000000" opacity="0" color2="#000000" o:opacity2="'+ishade+'" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+deep+','+(sz-(is*2))+'" path="m 0,'+pos+' l 0,'+(sz-pos-(is*2))+' qy '+deep+','+(sz-rus-(is*2))+' l '+deep+','+rus+' qx 0,'+pos+' x e" style="position:absolute;margin:0;top:0px;left:'+(sz-deep-(is*2))+'px;width:'+deep+'px;height:'+(sz-(is*2))+'px;flip:x;"><v:fill method="linear" type="gradient" angle="270" color="#000000" opacity="0" color2="#000000" o:opacity2="'+ishade+'" /></v:shape>';
					if(nocircles==false) shade = shade+'<v:oval size="'+deep+','+deep+'" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute;margin:0;top:'+(pos/2)+'px;left:'+(pos/2)+'px;width:'+deep+'px;height:'+deep+'px;"><v:fill method="linear" focus="1" focusposition="50%,50%" focussize="50%,50%" type="gradientradial" color="#ffffff" opacity="'+(ishade/2)+'" color2="#000000" o:opacity2="'+ishade+'" /></v:oval><v:oval size="'+deep+','+deep+'" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute;margin:0;top:'+(pos/2)+'px;left:'+(sz-(is*2)-pos)+'px;width:'+deep+'px;height:'+deep+'px;"><v:fill method="linear" focus="1" focusposition="50%,50%" focussize="50%,50%" type="gradientradial" color="#ffffff" opacity="'+(ishade/2)+'" color2="#000000" o:opacity2="'+ishade+'" /></v:oval><v:oval size="'+deep+','+deep+'" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute;margin:0;top:'+(sz-(is*2)-pos)+'px;left:'+(sz-(is*2)-pos)+'px;width:'+deep+'px;height:'+deep+'px;"><v:fill method="linear" focus="1" focusposition="50%,50%" focussize="50%,50%" type="gradientradial" color="#ffffff" opacity="'+(ishade/2)+'" color2="#000000" o:opacity2="'+ishade+'" /></v:oval><v:oval size="'+deep+','+deep+'" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute;margin:0;top:'+(sz-(is*2)-pos)+'px;left:'+(pos/2)+'px;width:'+deep+'px;height:'+deep+'px;"><v:fill method="linear" focus="1" focusposition="50%,50%" focussize="50%,50%" type="gradientradial" color="#ffffff" opacity="'+(ishade/2)+'" color2="#000000" o:opacity2="'+ishade+'" /></v:oval>';
					shade = shade + '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+(ww+wide+wide)+','+wide+'" path="m 0,0 l '+(ww+wide+wide)+',0,'+(ww+wide)+','+wide+','+wide+','+wide+' x e" style="position:absolute;margin:0;top:'+(yoff-wide)+'px;left:'+(xoff-wide)+'px;width:'+(ww+wide+wide)+'px;height:'+wide+'px;"><v:fill method="linear" type="gradient" angle="180" color="#000000" opacity="0" color2="#000000" o:opacity2="'+ishade+'" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+wide+','+(hh+wide+wide)+'" path="m 0,0 l 0,'+(hh+wide+wide)+','+wide+','+(hh+wide)+','+wide+','+wide+' x e" style="position:absolute;margin:0;top:'+(yoff-wide)+'px;left:'+(xoff-wide)+'px;width:'+wide+'px;height:'+(hh+wide+wide)+'px;"><v:fill method="linear" type="gradient" angle="270" color="#000000" opacity="0" color2="#000000" o:opacity2="'+ishade+'" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="'+(ww+wide+wide)+','+wide+'" path="m 0,'+wide+' l '+(ww+wide+wide)+','+wide+','+(ww+wide)+',0,'+wide+',0 x e" style="position:absolute;margin:0;top:'+(yoff+hh)+'px;left:'+(xoff-wide)+'px;width:'+(ww+wide+wide)+'px;height:'+wide+'px;"><v:fill method="linear" type="gradient" angle="0" color="#ffffff" opacity="0" color2="#ffffff" o:opacity2="'+ishade+'" /></v:shape><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="'+wide+','+(hh+wide+wide)+'" path="m '+wide+',0 l '+wide+','+(hh+wide+wide)+',0,'+(hh+wide)+',0,'+wide+' x e" style="position:absolute;margin:0;top:'+(yoff-wide)+'px;left:'+(xoff+ww)+'px;width:'+wide+'px;height:'+(hh+wide+wide)+'px;"><v:fill method="linear" type="gradient" angle="90" color="#ffffff" opacity="0" color2="#ffffff" o:opacity2="'+ishade+'" /></v:shape>';
					head = '<v:group style="zoom:1;display:'+canvas.dpl+';margin:0;padding:0;position:relative;width:'+sz+'px;height:'+sz+'px;" coordsize="'+sz+','+sz+'">'+tmp;
					foot = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+yoff+'px;left:'+xoff+'px;width:'+ww+'px;height:'+hh+'px;"><v:fill color="#000000" opacity="1" /></v:rect><v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+iy+'px;left:'+ix+'px;width:'+iw+'px;height:'+ih+'px;"><v:fill src="'+canvas.source+'" type="frame" /></v:rect></v:group>';
					if(typeof check_strokeTextCapability=='function' && text!='') {
						if(check_strokeTextCapability()) {
							if(io==1) {
								th = parseInt((sz-(is*2)-ww)/4);
								text = get_widthText(text,hh-os-os,th/2,attr[1],attr[2]); 
								tw = get_textWidth(text,th/2,attr[1],attr[2]);
								txt = '<v:group style="zoom:1;rotation:-90;display:'+canvas.dpl+';margin:0;padding:0;position:relative;width:'+sz+'px;height:'+sz+'px;" coordsize="'+sz+','+sz+'"><v:shape filled="f" stroked="t" coordorigin="0,0" coordsize="'+hh+','+th+'" path="m 0,'+parseInt(th*0.25)+' l 0,'+parseInt(th*0.5)+' c 0,'+th+',0,'+th+','+parseInt(th*0.5)+','+th+' l '+parseInt(hh-(th*0.25))+','+th+' e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+(sz-(is*2)-(th*1.6))+'px;left:'+(yoff+is+is)+'px;width:'+hh+'px;height:'+th+'px;"><v:stroke color="#ffffff" opacity="'+(ishade/2)+'" weight="1" miterlimit="0" endcap="round" joinstyle="round" /></v:shape><v:shape filled="f" stroked="t" coordorigin="0,0" coordsize="'+hh+','+th+'" path="m '+parseInt(th*0.25)+',0 l '+parseInt(hh-(th*0.5))+',0 c '+hh+',0,'+hh+',0,'+hh+','+parseInt(th*0.5)+' l '+hh+','+parseInt(th*0.75)+' e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+(sz-(is*2)-(th*1.6))+'px;left:'+(yoff+is+is)+'px;width:'+hh+'px;height:'+th+'px;"><v:stroke color="#000000" opacity="'+(ishade/2)+'" weight="1" miterlimit="0" endcap="round" joinstyle="round" /></v:shape>'+get_strokeText(text,xoff+is+is+((ww-tw)/2),sz-(is*2)-(th*1.4),th/2,attr[0],attr[1],attr[2],"sans-serif",tcolor,1,0)+'</v:group>';
							}else {
								th = parseInt((sz-(is*2)-hh)/4);
								text = get_widthText(text,ww-os-os,th/2,attr[1],attr[2]); 
								tw = get_textWidth(text,th/2,attr[1],attr[2]); 
								txt = '<v:shape filled="f" stroked="t" coordorigin="0,0" coordsize="'+ww+','+th+'" path="m '+ww+','+parseInt(th*0.25)+' l '+ww+','+parseInt(th*0.5)+' c '+ww+','+th+','+ww+','+th+','+parseInt(ww-(th*0.5))+','+th+' l '+parseInt(th*0.25)+','+th+' e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+(sz-(is*2)-(th*1.6))+'px;left:'+xoff+'px;width:'+ww+'px;height:'+th+'px;"><v:stroke color="#ffffff" opacity="'+(ishade/2)+'" weight="1" miterlimit="0" endcap="round" joinstyle="round" /></v:shape><v:shape filled="f" stroked="t" coordorigin="0,0" coordsize="'+ww+','+th+'" path="m 0,'+parseInt(th*0.75)+' l 0,'+parseInt(th*0.5)+' c 0,0,0,0,'+parseInt(th*0.5)+',0 l '+parseInt(ww-(th*0.25))+',0 e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+(sz-(is*2)-(th*1.6))+'px;left:'+xoff+'px;width:'+ww+'px;height:'+th+'px;"><v:stroke color="#000000" opacity="'+(ishade/2)+'" weight="1" miterlimit="0" endcap="round" joinstyle="round" /></v:shape>'+get_strokeText(text,xoff+((ww-tw)/2),sz-(is*2)-(th*1.4),th/2,attr[0],attr[1],attr[2],"sans-serif",tcolor,1,0);
							}
						}
					}
					canvas.innerHTML = head+shado+fill+shade+txt+foot;
				}
			}else {
				if(canvas.tagName.toUpperCase() == "CANVAS" && canvas.getContext("2d")) {
					var context = canvas.getContext("2d");
					var img = new Image();
					img.onload = function() {
						context.clearRect(0,0,sz,sz);
						context.save();  
						if(noshadow==false) addShadowing(context,is,is,sz-is,sz-is,ir,ishadow);
						if(!isNaN(icolor)&&window.opera) {
							context.globalCompositeOperation = "destination-out";
							context.save(); roundedRect(context,0,0,sz-(is*2),sz-(is*2),r);
							context.fillStyle='rgba(0,0,0,1)'; context.fill(); context.clip(); 
							context.clearRect(0,0,sz,sz);
							context.restore(); roundedRect(context,0,0,sz-(is*2),sz-(is*2),r);
							context.clip(); context.globalCompositeOperation = "source-over";
						}else {
							roundedRect(context,0,0,sz-(is*2),sz-(is*2),r);
							context.clip();
						}
						if(isNaN(icolor)) {
							if(isNaN(icolor2)) {
								if(igradient=='h') {
									style = context.createLinearGradient(0,0,sz,0);
								}else if(igradient=='v') {
									style = context.createLinearGradient(0,0,0,sz-(is*2));
								}else {
									style = context.createLinearGradient(0,0,sz-(is*2),sz-(is*2));
								}
								style.addColorStop(0,icolor); 
								style.addColorStop(1,icolor2);
								context.beginPath();
								context.rect(0,0,sz,sz-(is*2));
								context.closePath();
								context.fillStyle = style;
								context.fill();
							}else {
								context.fillStyle = icolor;
								context.fillRect(0,0,sz,sz-(is*2));
							}
						}else {
							if(!window.opera) {context.clearRect(0,0,sz,sz);}
						}
						addShadeing(context,0,0,sz-(is*2),sz-(is*2),sr,ishade);
						context.fillStyle = '#000000';
						context.fillRect(xoff,yoff,ww,hh);
						context.drawImage(img,ix,iy,iw,ih);
						addFraming(context,xoff,yoff,ww,hh,sr/2,ishade);
						if(nocircles==false) addCircles(context,0,0,sz-(is*2),sz-(is*2),sr,ishade);
						if(typeof set_textRenderContext=='function' && text!='') {							set_textRenderContext(context);
							if(check_textRenderContext(context)) {
								if(io) {
									th=parseInt((sz-(is*2)-ww)/4); addTextFrame(context,sz-(is*2)-(th*1.6),yoff,th,hh,ishade,io);
								}else {
									th=parseInt((sz-(is*2)-hh)/4); addTextFrame(context,xoff,sz-(is*2)-(th*1.6),ww,th,ishade,io);
								} context.strokeStyle = hextorgba(tcolor,1); 
								if(io) {
									text=get_widthText(text,hh-os-os,th/2,attr[1],attr[2]); tw=get_textWidth(text,th/2,attr[1],attr[2]);
									context.save();
									context.rotate(-(Math.PI*90/180)); context.translate(-(sz),0);
									context.strokeText(text,yoff+os+os+((hh-tw)/2),sz-(is*2)-(th*1.4),th/2,attr[0],attr[1],attr[2]);
									context.restore();
								}else {
									text=get_widthText(text,ww-os-os,th/2,attr[1],attr[2]); tw=get_textWidth(text,th/2,attr[1],attr[2]);
									context.strokeText(text,xoff+((ww-tw)/2),sz-(is*2)-(th*1.4),th/2,attr[0],attr[1],attr[2]);
								}
							}
						}
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
				cvi_slide.replace(canvas);
			}
		}else {
			if(canvas.tagName.toUpperCase() == "CANVAS") {
				cvi_slide.replace(canvas);
			}
		}
	}
}