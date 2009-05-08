/**
 * cvi_corner_lib.js 1.81 (21-Mar-2009)
 * (c) by Christian Effenberger 
 * All Rights Reserved
 * Source: corner.netzgesta.de
 * Distributed under Netzgestade Software License Agreement
 * http://www.netzgesta.de/cvi/LICENSE.txt
 * License permits free of charge
 * use on non-commercial and 
 * private web sites only 
 * syntax:
	cvi_corner.defaultRadius = 0;		//INT 0-100 (px)
	cvi_corner.defaultShadow = 0;		//INT 0-100 (% opacity)
	cvi_corner.defaultShade = 0;		//INT 0-100 (% opacity)
	cvi_corner.defaultInverse = false;	//BOOLEAN
	cvi_corner.remove( image );
	cvi_corner.add( image, options );
	cvi_corner.modify( image, options );
	cvi_corner.add( image, { radius: value, shadow: value, shade: value, inverse: value } );
	cvi_corner.modify( image, { radius: value, shadow: value, shade: value, inverse: value } );
 *
**/

function getRadius(radius,width,height){
	var part = (Math.min(width,height)/100);
	radius = Math.max(Math.min(100,radius/part),0);
	return radius+'%';
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
function addGradient(ctx,x,y,w,h,color,opacity) {
	var tmp = ctx.createLinearGradient(x,y,w,h);
	var val = (color>0?0.25:0.2);
	tmp.addColorStop(0,'rgba('+color+','+color+','+color+',0.9)');
	tmp.addColorStop(val,'rgba('+color+','+color+','+color+','+opacity+')');
	tmp.addColorStop(0.75,'rgba('+color+','+color+','+color+',0)');
	tmp.addColorStop(1,'rgba('+color+','+color+','+color+',0)');
	return tmp;
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
function addShine(ctx,width,height,radius,opacity,extra) {
	var style; var color = (extra!=1?254:0);
	style = addGradient(ctx,0,radius,radius,radius,color,opacity);
	ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,height); ctx.lineTo(radius,height); ctx.lineTo(radius,radius); ctx.closePath();
	ctx.fillStyle = style; ctx.fill();
	style = addGradient(ctx,radius,0,radius,radius,color,opacity);
	ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(width,0); ctx.lineTo(width,radius); ctx.lineTo(radius,radius); ctx.closePath();
	ctx.fillStyle = style; ctx.fill();
}
function addShade(ctx,width,height,radius,opacity) {
	var style;
	style = addGradient(ctx,width,radius,width-radius,radius,0,opacity);
	ctx.beginPath(); ctx.moveTo(width,0); ctx.lineTo(width,height); ctx.lineTo(width-radius,height-radius); ctx.lineTo(width-radius,0); ctx.closePath();
	ctx.fillStyle = style; ctx.fill(); 
	style = addGradient(ctx,radius,height,radius,height-radius,0,opacity);
	ctx.beginPath(); ctx.moveTo(width,height); ctx.lineTo(0,height); ctx.lineTo(0,height-radius); ctx.lineTo(width-radius,height-radius); ctx.closePath();
	ctx.fillStyle = style; ctx.fill();
}
function roundedShadow(ctx,x,y,width,height,radius,opacity){
	var style;
	ctx.beginPath(); ctx.rect(x,y+height-radius,radius,radius); ctx.closePath();
	style = addRadialStyle(ctx,x+radius,y+height-radius,radius-x,x+radius,y+height-radius,radius,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+radius,y+height-y,width-x-(radius*2),y); ctx.closePath();
	style = addLinearStyle(ctx,x+radius,y+height-y,x+radius,y+height,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(width-radius,height-radius,radius+x,radius+y); ctx.closePath();
	style = addRadialStyle(ctx,width-radius,height-radius,radius,width-radius,height-radius,radius+x,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+width-x,y+radius,x,height-y-(radius*2)); ctx.closePath();
	style = addLinearStyle(ctx,x+width-x,y+radius,x+width,y+radius,opacity);
	ctx.fillStyle = style; ctx.fill();
	ctx.beginPath(); ctx.rect(x+width-radius,y,radius,radius); ctx.closePath();
	style = addRadialStyle(ctx,x+width-radius,y+radius,radius-x,x+width-radius,y+radius,radius,opacity);
	ctx.fillStyle = style; ctx.fill();
}

var cvi_corner = {
	defaultRadius : 0,
	defaultShadow : 0,
	defaultShade : 0,
	defaultInverse : false,
	add: function(image, options) {
		if(image.tagName.toUpperCase() == "IMG") {
			var defopts = { "radius" : cvi_corner.defaultRadius, "shadow" : cvi_corner.defaultShadow, "shade" : cvi_corner.defaultShade, "inverse" : cvi_corner.defaultInverse }
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
					var canvas = document.createElement(['<var style="zoom:1;overflow:hidden;display:' + display + ';width:' + imageWidth + 'px;height:' + imageHeight + 'px;padding:0;">'].join(''));
					var flt =  image.currentStyle.styleFloat.toLowerCase();
					display = (flt=='left'||flt=='right')?'inline':display;
					canvas.options = options;
					canvas.dpl = display;
					canvas.id = image.id;
					canvas.alt = image.alt;
					canvas.title = image.title;
					canvas.source = image.src;
					canvas.className = image.className;
					canvas.style.cssText = image.style.cssText;
					canvas.height = imageHeight;
					canvas.width = imageWidth;
					object.replaceChild(canvas,image);
					cvi_corner.modify(canvas, options);
				}else {
					var canvas = document.createElement('canvas');
					if(canvas.getContext("2d")) {
						canvas.options = options;
						canvas.id = image.id;
						canvas.alt = image.alt;
						canvas.title = image.title;
						canvas.source = image.src;
						canvas.className = image.className;
						canvas.style.cssText = image.style.cssText;
						canvas.style.height = imageHeight+'px';
						canvas.style.width = imageWidth+'px';
						canvas.height = imageHeight;
						canvas.width = imageWidth;
						object.replaceChild(canvas,image);
						cvi_corner.modify(canvas, options);
					}
				}
			} catch (e) {
			}
		}
	},
	
	modify: function(canvas, options) {
		try {			
			var iradius = (typeof options['radius']=='number'?options['radius']:canvas.options['radius']); canvas.options['radius'] = iradius;
			var ishadow = (typeof options['shadow']=='number'?options['shadow']:canvas.options['shadow']); canvas.options['shadow'] = ishadow;
			var ishade = (typeof options['shade']=='number'?options['shade']:canvas.options['shade']); canvas.options['shade'] = ishade;
			var inverse = (typeof options['inverse']=='boolean'?options['inverse']:canvas.options['inverse']); canvas.options['inverse']=inverse;
			var iw = canvas.width; var ih = canvas.height; var os = 4; var is = 0;
			var ir = Math.min(Math.min(iw,ih)/3,iradius); canvas.options['radius'] = ir; var r = getRadius(ir,iw,ih); 
			os = (ishadow>0?(inverse!=false?0:Math.min(Math.max(os,ir/2),16)):0);
			if(document.all && document.namespaces && !window.opera) {
				if(canvas.tagName.toUpperCase() == "VAR") {
					var start = '<v:group style="zoom:1;display:'+canvas.dpl+';margin:0;padding:0;position:relative;width:'+iw+'px;height:'+ih+'px;" coordsize="'+iw+','+ih+'">';
					var fill = '<v:fill src="'+canvas.source+'" type="frame" />'; var foot = (ir>0?'</v:roundrect>':'</v:rect>'); var end = '</v:group>';
					var pos = 0, linear = 'linear', soft = '', head = '', shado = '', lt = '', left = '', top = '', bottom = '', right = '';
					if(ir<=0) {
						if(ishadow>0) {
							if(inverse<=0) { ishadow = ishadow/50; os = 8; is = 4;
								soft = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute;margin:0;padding:0;width:'+iw+'px;height:'+ih+'px;"><v:fill color="#ffffff" opacity="0" /></v:rect><v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="filter:Alpha(opacity='+(ishadow*64)+'), progid:dxImageTransform.Microsoft.Blur(PixelRadius='+is+', MakeShadow=false); zoom:1;margin:-1px 0 0 -1px;padding: 0;display:block;position:absolute;top:'+is+'px;left:'+is+'px;width:'+(iw-(3*is))+'px;height:'+(ih-(3*is))+'px;"><v:fill color="#000000" opacity="1" /></v:rect>';
								head = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute;margin:0;padding:0;width:'+(iw-os)+'px;height:'+(ih-os)+'px;">';
							}else if(inverse>0) { ishadow = ishadow/50; ir = 12; linear = "linear";
								head = '<v:rect filled="t" stroked="t" fillcolor="#ffffff" style="position:absolute;margin:0;padding:0;width:'+iw+'px;height:'+ih+'px;">';
								shado = '<v:stroke weight="0.5" opacity="'+(ishadow/2)+'" color="#000000" />';
								top = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+iw+','+ir+'" path="m 0,0 l '+iw+',0,'+iw+','+ir+','+ir+','+ir+' x e" style="position:absolute;margin:0;top:0px;left:0px;width:'+iw+'px;height:'+ir+'px;"><v:fill method="'+linear+'" type="gradient" angle="0" color="#000000" opacity="0" color2="#000000" o:opacity2="'+ishadow+'" /></v:shape>'; 
								left = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+ir+','+ih+'" path="m 0,0 l 0,'+ih+','+ir+','+ih+','+ir+','+ir+' x e" style="position:absolute; margin:0;top:0px;left:0px;width:'+ir+'px;height:'+ih+'px;"><v:fill method="'+linear+'" type="gradient" angle="90" color="#000000" opacity="0" color2="#000000" o:opacity2="'+ishadow+'" /></v:shape>';
							}
						}else {
							head = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="margin:0;padding:0;display:'+canvas.dpl+';width:'+iw+'px;height:'+ih+'px;">';
						}
						if(ishade>0) { ishade = ishade/50; ir = 12;
							top = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="'+(iw-os)+','+ir+'" path="m 0,0 l '+(iw-os)+',0,'+(iw-os)+','+ir+','+ir+','+ir+' x e" style="position:absolute;margin:0;top:0px;left:0px;width:'+(iw-os)+'px;height:'+ir+'px;"><v:fill method="linear" type="gradient" angle="0" color="#ffffff" opacity="0" color2="#ffffff" o:opacity2="'+ishade+'" /></v:shape>'; 
							left = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="'+ir+','+(ih-os)+'" path="m 0,0 l 0,'+(ih-os)+','+ir+','+(ih-os)+','+ir+','+ir+' x e" style="position:absolute;margin:0;top:0px;left:0px;width:'+ir+'px;height:'+(ih-os)+'px;"><v:fill method="linear" type="gradient" angle="90" color="#ffffff" opacity="0" color2="#ffffff" o:opacity2="'+ishade+'" /></v:shape>';
							bottom = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+(iw-os)+','+ir+'" path="m 0,'+ir+' l '+(iw-os)+','+ir+','+(iw-os-ir)+',0,'+ir+',0 x e" style="position:absolute;margin:0;top:'+(ih-os-ir)+'px;left:0px;width:'+(iw-os)+'px;height:'+ir+'px;"><v:fill method="linear" type="gradient" angle="180" color="#000000" opacity="0" color2="#000000" o:opacity2="'+ishade+'" /></v:shape>';
							right = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+ir+','+(ih-os)+'" path="m '+ir+',0 l '+ir+','+(ih-os)+',0,'+(ih-os-ir)+',0,'+ir+' x e" style="position:absolute;margin:0;top:0px;left:'+(iw-os-ir)+'px;width:'+ir+'px;height:'+(ih-os)+'px;"><v:fill method="linear" type="gradient" angle="270" color="#000000" opacity="0" color2="#000000" o:opacity2="'+ishade+'" /></v:shape>';
						}
					}else {
						if(ishadow>0) {
							linear = "linear sigma"; pos = 2;
							if(inverse==false) { ishadow = ishadow/50; is = Math.round(os*0.5);
								soft = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute;margin:0;padding:0;width:'+iw+'px;height:'+ih+'px;"><v:fill color="#ffffff" opacity="0" /></v:rect><v:roundrect arcsize="'+(r+is)+'" strokeweight="0" filled="t" stroked="f" fillcolor="#000000" style="filter:Alpha(opacity='+(ishadow*64)+'), progid:dxImageTransform.Microsoft.Blur(PixelRadius='+is+', MakeShadow=false); zoom:1;margin:0;padding:0;display:block;position:absolute;top:'+is+'px;left:'+is+'px;width:'+(iw-(3*is))+'px;height:'+(ih-(3*is))+'px;"><v:fill color="#000000" opacity="1" /></v:roundrect>';
								head = '<v:roundrect arcsize="'+r+'" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute;margin:0;padding:0;width:'+(iw-os)+'px;height:'+(ih-os)+'px;">';
							}else if(inverse==true) { ishadow = ishadow/50;
								head = '<v:roundrect arcsize="'+r+'" filled="t" stroked="t" fillcolor="#ffffff" style="position:absolute;margin:0;padding:0;width:'+iw+'px;height:'+ih+'px;">';
								shado = '<v:stroke weight="0.5" opacity="'+(ishadow/2)+'" color="#000000" />';
								top = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+iw+','+ir+'" path="m '+ir+','+ir+' l '+iw+','+ir+' qy '+(iw-ir)+',0 l '+ir+',0 x e" style="position:absolute;margin:0;top:0px;left:-1px;width:'+(iw+1)+'px;height:'+ir+'px;"><v:fill method="'+linear+'" type="gradient" angle="0" color="#000000" opacity="0" color2="#000000" o:opacity2="'+ishadow+'" /></v:shape>'; 
								left = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+ir+','+ih+'" path="m 0,'+ir+' l 0,'+(ih-ir)+' qy '+ir+','+ih+' l '+ir+','+ir+' x e" style="position:absolute;margin:0;top:-1px;left:0px;width:'+ir+'px;height:'+(ih+1)+'px;"><v:fill method="'+linear+'" type="gradient" angle="90" color="#000000" opacity="0" color2="#000000" o:opacity2="'+ishadow+'" /></v:shape>';
								lt = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#000000" coordorigin="0,0" coordsize="'+ir+','+ir+'" path="m '+ir+','+ir+' l 0,'+ir+' qy '+ir+',0 l '+ir+','+ir+' x e" style="position:absolute;margin:0;top:0px;left:0px;width:'+ir+'px;height:'+ir+'px;"><v:fill method="'+linear+'" focus="1" focusposition="1,1" focussize="0.5,0.5" type="gradientradial" color="#000000" opacity="0" color2="#000000" o:opacity2="'+ishadow+'" /></v:shape>';
							}
						}else { pos = 1; os = 0;
							head = '<v:roundrect arcsize="'+r+'" strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute;margin:0;padding:0;width:'+iw+'px;height:'+ih+'px;">';
						}
						if(ishade>0 && inverse==false) { ishade = ishade/50; linear = "linear";
							top = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="'+(iw-os)+','+ir+'" path="m '+ir+','+ir+' l '+(iw-os)+','+ir+' qy '+(iw-os-ir)+',0 l '+ir+',0 x e" style="position:absolute;margin:0;top:0px;left:-1px;width:'+(iw-os+pos)+'px;height:'+ir+'px;"><v:fill method="'+linear+'" type="gradient" angle="0" color="#ffffff" opacity="0" color2="#ffffff" o:opacity2="'+ishade+'" /></v:shape>'; 
							left = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="'+ir+','+(ih-os)+'" path="m 0,'+ir+' l 0,'+(ih-ir-os)+' qy '+ir+','+(ih-os)+' l '+ir+','+ir+' x e" style="position:absolute;margin:0;top:-1px;left:0px;width:'+ir+'px;height:'+(ih-os+pos)+'px;"><v:fill method="'+linear+'" type="gradient" angle="90" color="#ffffff" opacity="0" color2="#ffffff" o:opacity2="'+ishade+'" /></v:shape>';
							lt = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="'+ir+','+ir+'" path="m '+ir+','+ir+' l 0,'+ir+' qy '+ir+',0 l '+ir+','+ir+' x e" style="position:absolute;margin:0;top:0px;left:0px;width:'+ir+'px;height:'+ir+'px;"><v:fill method="'+linear+'" focus="1" focusposition="1,1" focussize="0.5,0.5" type="gradientradial" color="#ffffff" opacity="0" color2="#ffffff" o:opacity2="'+ishade+'" /></v:shape>';
						}
					}
					canvas.innerHTML = start+soft+head+fill+shado+foot+right+bottom+top+left+lt+end;
				}
			}else {
				if(canvas.tagName.toUpperCase() == "CANVAS" && canvas.getContext("2d")) {
					var context = canvas.getContext("2d");
					var img = new Image();
					img.onload = function() {
						context.clearRect(0,0,iw,ih);
						context.save();
						if(ishadow>0 && inverse==false) { ishadow = ishadow/100;
							if(ir>0) {
								roundedShadow(context,os,os,iw-os,ih-os,ir,ishadow);								
							}else { os = 8; 
								roundedShadow(context,os,os,iw-os,ih-os,os,ishadow);
							}
						}
						if(ir<=0) {
							context.beginPath(); context.rect(0,0,iw-os,ih-os); context.closePath();
						}else {
							roundedRect(context,0,0,iw-os,ih-os,ir);
						}
						context.clip();
						context.fillStyle = 'rgba(0,0,0,0)';
						context.fillRect(0,0,iw,ih);
						context.drawImage(img,0,0,iw-os,ih-os);
						if(ishadow>0 && inverse==true) { ishadow = ishadow/100;
							if(ir>0) {
								addShine(context,iw,ih,ir,ishadow,1);
								roundedRect(context,0,0,iw,ih,ir);
							}else { ir = 16; 
								addShine(context,iw,ih,ir,ishadow,1);
								context.beginPath();
								context.rect(0,0,iw,ih);
								context.closePath();
							}
							context.strokeStyle = 'rgba(0,0,0,'+ishadow+')';
							context.lineWidth = 2;
							context.stroke();
						}			
						if(ishade>0 && inverse==false) {
							ishade = ishade/100; if(ir<=0) ir = 16; 
							addShade(context,iw-os,ih-os,ir,ishade);
							addShine(context,iw-os,ih-os,ir,ishade);
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
		img.style.height = canvas.height+'px';
		img.style.width = canvas.width+'px';
		object.replaceChild(img,canvas);
	},

	remove : function(canvas) {
		if(document.all && document.namespaces && !window.opera) {
			if(canvas.tagName.toUpperCase() == "VAR") {
				cvi_corner.replace(canvas);
			}
		}else {
			if(canvas.tagName.toUpperCase() == "CANVAS") {
				cvi_corner.replace(canvas);
			}
		}
	}
}
