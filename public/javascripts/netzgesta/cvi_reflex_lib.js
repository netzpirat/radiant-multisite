/**
 * cvi_reflex_lib.js 1.21 (21-Mar-2009)
 * (c) by Christian Effenberger
 * All Rights Reserved
 * Source: reflex.netzgesta.de
 * Distributed under Netzgestade Software License Agreement
 * http://www.netzgesta.de/cvi/LICENSE.txt
 * License permits free of charge
 * use on non-commercial and
 * private web sites only
 * syntax:
	cvi_reflex.defaultTilt = 'none'; 		//STR  'n|l|r'-'none|left|right'
	cvi_reflex.defaultHeight = 33;  		//INT  10-100 (%)
	cvi_reflex.defaultDistance = 0;  		//INT  0-100 (px)
	cvi_reflex.defaultTransparency = 50;  	//INT  1-100 (%)
	cvi_reflex.defaultBorder = 0;  			//INT  0-20 (px)
	cvi_reflex.defaultColor = '#ffffff'; 	//STR '#000000'-'#ffffff'
	cvi_reflex.defaultBoxmode = false; 		//BOOLEAN (use max height)
	cvi_reflex.remove( image );
	cvi_reflex.add( image, options );
	cvi_reflex.modify( image, options );
	cvi_reflex.add( image, { tilt: value, height: value, distance: value, transparency: value, border: value, color: value, boxmode: value } );
	cvi_reflex.modify( image, { tilt: value, height: value, distance: value, transparency: value, border: value, color: value, boxmode: value } );
 *
**/

function clipPolyRight(ctx,x,y,w,h,t,d,s) {
	var z = (h-t-t)/h;
	ctx.beginPath();
	ctx.moveTo(x,y); ctx.lineTo(w,y+t); ctx.lineTo(w,y+h-t); ctx.lineTo(x,y+h);
	if(d>0) {ctx.lineTo(x,y+h-s); ctx.lineTo(w,y+h-t-(z*s)); ctx.lineTo(w,y+h-t-(z*(s+d))); ctx.lineTo(x,y+h-s-d);}
	ctx.closePath();
}
function clipPolyLeft(ctx,x,y,w,h,t,d,s) {
	var z = (h-t-t)/h;
	ctx.beginPath();
	ctx.moveTo(x,y+t); ctx.lineTo(w,y+1); ctx.lineTo(w,y+h); ctx.lineTo(x,y+h-t);
	if(d>0) {ctx.lineTo(x,y+h-t-(z*s)); ctx.lineTo(w,y+h-s); ctx.lineTo(w,y+h-s-d); ctx.lineTo(x,y+h-t-(z*(s+d))); }
	ctx.closePath();
}
function strokePolyRight(ctx,x,y,w,h,t,d,s,b) {
	var z = (h-t-t)/h; var n = (b>=1?1:0);
	ctx.beginPath();
	ctx.moveTo(x+b,y+b); ctx.lineTo(w-b,y+t+b-n); ctx.lineTo(w-b,y+h-t-(z*(s+d))-b); ctx.lineTo(x+b,y+h-s-d-b);
	ctx.closePath();
}
function strokePolyLeft(ctx,x,y,w,h,t,d,s,b) {
	var z = (h-t-t)/h; var n = (b>=1?1:0);
	ctx.beginPath();
	ctx.moveTo(x+b,y+t+b-n); ctx.lineTo(w-b,y+b); ctx.lineTo(w-b,y+h-s-d-b); ctx.lineTo(x+b,y+h-t-(z*(s+d))-b);
	ctx.closePath();
}
function clipReflex(ctx,x,y,w,h,t,d,s,o) {
	var z = (h-t-t)/h;
	ctx.beginPath();
	if(o=='r') {
		ctx.moveTo(x,y+h-s); ctx.lineTo(w,y+h-t-(z*s)); ctx.lineTo(w,y+h-t+2); ctx.lineTo(x,y+h+2);
	}else {
		ctx.moveTo(w,y+h+2); ctx.lineTo(w,y+h-s); ctx.lineTo(x,y+h-t-(z*s)); ctx.lineTo(x,y+h-t+2);
	}
	ctx.closePath();
}
function clearReflex(ctx,x,y,w,h,t,d,s,o) {
	var z = (h-t-t)/h;
	ctx.beginPath();
	if(o=='r') {
		ctx.moveTo(x,y+h-1); ctx.lineTo(w,y+h-t-1); ctx.lineTo(w,y+h-t+1); ctx.lineTo(x,y+h+1);
	}else {
		ctx.moveTo(w,y+h-1); ctx.lineTo(x,y+h-t-1); ctx.lineTo(x,y+h-t+1); ctx.lineTo(w,y+h+1);
	}
	ctx.closePath();
}

var cvi_reflex = {
	defaultTilt : 'none',
	defaultHeight : 33,
	defaultDistance : 0,
	defaultTransparency : 50,
	defaultBorder : 0,
	defaultColor : '#ffffff',
	defaultBoxmode : false,
	add: function(image, options) {
		if(image.tagName.toUpperCase() == "IMG") {
			var defopts = { "tilt" : cvi_reflex.defaultTilt, "height" : cvi_reflex.defaultHeight, "distance" : cvi_reflex.defaultDistance, "transparency" : cvi_reflex.defaultTransparency, "border" : cvi_reflex.defaultBorder, "color" : cvi_reflex.defaultColor, "boxmode" : cvi_reflex.defaultBoxmode }
			if(options) {
				for(var i in defopts) { if(!options[i]) { options[i] = defopts[i]; }}
			}else {
				options = defopts;
			}
			var imageWidth  = ('iwidth'  in options) ? parseInt(options.iwidth)  : image.width;
			var imageHeight = ('iheight' in options) ? parseInt(options.iheight) : image.height;
			try {
				var object = image.parentNode; var m = (typeof options['boxmode']=='boolean'?options['boxmode']:false);
				if(m==true) { var height = (imageHeight*2)+100; }else {
					var h = (typeof options['height']=='number'?Math.min(options['height'],100):33);
					var d = (typeof options['distance']=='number'?Math.min(options['distance'],100):0);
					var height = imageHeight+d+Math.floor(imageHeight*(Math.max(h,10)/100));
				}
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
					canvas.bm = m;
					canvas.id = image.id;
					canvas.alt = image.alt;
					canvas.name = image.name;
					canvas.title = image.title;
					canvas.source = image.src;
					canvas.className = image.className;
					canvas.style.cssText = image.style.cssText;
					canvas.height = height;
					canvas.width = imageWidth;
					canvas.iheight = imageHeight;
					canvas.iwidth = imageWidth;
					object.replaceChild(canvas,image);
					cvi_reflex.modify(canvas, options);
				}else {
					var canvas = document.createElement('canvas');
					if(canvas.getContext("2d")) {
						canvas.options = options;
						canvas.isOP = window.opera?1:0;
						canvas.isWK = navigator.appVersion.indexOf('WebKit')!=-1?1:0;
						canvas.isW5 = document.defaultCharset&&!window.execScript?1:0;
						canvas.bm = m;
						canvas.id = image.id;
						canvas.alt = image.alt;
						canvas.name = image.name;
						canvas.title = image.title;
						canvas.source = image.src;
						canvas.className = image.className;
						canvas.style.cssText = image.style.cssText;
						canvas.style.height = height+'px';
						canvas.style.width = imageWidth+'px';
						canvas.height = height;
						canvas.width = imageWidth;
						canvas.iheight = imageHeight;
						canvas.iwidth = imageWidth;
						object.replaceChild(canvas,image);
						cvi_reflex.modify(canvas, options);
					}
				}
			} catch (e) {
			}
		}
	},

	modify: function(canvas, options) {
		try {
			var tilt = (typeof options['tilt']=='string'?options['tilt']:canvas.options['tilt']); canvas.options['tilt']=tilt;
			var height = (typeof options['height']=='number'?options['height']:canvas.options['height']); canvas.options['height']=height;
			var opacity = (typeof options['transparency']=='number'?options['transparency']:canvas.options['transparency']); canvas.options['transparency']=opacity;
			var distance = (typeof options['distance']=='number'?options['distance']:canvas.options['distance']); canvas.options['distance']=distance;
			var border = (typeof options['border']=='number'?options['border']:canvas.options['border']); canvas.options['border']=border;
			var color = (typeof options['color']=='string'?options['color']:canvas.options['color']); canvas.options['color']=color;
			var hh = canvas.height; var ww = canvas.width; var ih = canvas.iheight; var iw = canvas.iwidth;
			var tmp = parseInt(height>=10&&height<=100?height:33); var j = Math.max(Math.min(tmp,100),10);
			var iheit = Math.floor(ih*(j/100)); var idist = parseInt(distance<=100?distance:0);
			var boxh = parseInt(idist+ih+iheit); var ibord = Math.round(Math.min(Math.min(border,iheit/4),Math.max(iw,ih)/20));
			var iopac = parseFloat(opacity==0?0.5:opacity/100); var itilt = (tilt.match(/^[lnr]/i)?tilt.substr(0,1):'n');
			var icolor = (color.match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i)?color:'#ffffff');
			var wide = 12; var q = 1, z, cw, ch, half; var bord = (ibord>0?ibord/2:0);
			var iter = Math.floor(ww/wide); var rest = (ww%wide); var divs = (100/tmp);
			var style = '', flex = '',xb = '',fill = '',fb = '';
			if(document.all && document.namespaces && !window.opera) {
				if(canvas.tagName.toUpperCase() == "VAR") {
					hh = boxh; iheit = Math.floor(ih/divs); tmp = '';
					if(border==1) { bord = 0; iborder = 1; }else {ibord = Math.floor(Math.round(Math.min(Math.min(border,iheit/4),Math.max(iw,ih)/20))/2)*2; bord = (ibord>0?ibord/2:0); }
					iopac = 1-iopac; cw = parseInt(iw/20);  iter = Math.floor((iw-cw-cw)/wide);
					rest = ((iw-cw-cw)%wide); half = (((iw-cw-cw)/wide)-1)/2; ch = iter+(rest>0?1:0); z = (ih-ch-ch)/ih;
					if(canvas.bm==true) {tmp = '<v:rect strokeweight="0" filled="f" stroked="f" fillcolor="transparent" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:'+ww+'px;height:'+hh+';"><v:fill opacity="0" color="#000000" /></v:rect>';}
					var head = '<v:group style="zoom:1;display:'+canvas.dpl+';margin:0;padding:0;position:relative;width:'+ww+'px;height:'+hh+'px;" coordsize="'+ww+','+hh+'">' + tmp;
					if(itilt=='n') {
						fill = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute;margin:0;padding:0;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"><v:fill src="'+canvas.source+'" type="frame" /></v:rect>';
						fb = '<v:rect strokeweight="'+ibord+'" strokecolor="'+icolor+'" filled="f" stroked="'+(bord>0||ibord>0?'t':'f')+'" fillcolor="#ffffff" style="position:absolute;margin:0;padding:0;top:'+bord+'px;left:'+bord+'px;width:'+(iw-bord-bord)+'px;height:'+(ih-bord-bord)+'px;"></v:rect>';
						xb = '<v:rect strokeweight="'+ibord+'" strokecolor="'+icolor+'" filled="f" stroked="'+(bord>0||ibord>0?'t':'f')+'" fillcolor="#ffffff" style="position:absolute;margin:0;padding:0;top:'+(ih+idist+bord)+'px;left:'+bord+'px;width:'+(iw-bord-bord)+'px;height:'+(iheit-bord-bord)+'px; filter: progid:DXImageTransform.Microsoft.Alpha(opacity='+(100*iopac)+',style=1,finishOpacity=0,startx=0,starty=0,finishx=0,finishy='+parseInt(ih*0.66)+');"></v:rect>';
						flex = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="position:absolute;margin:0;padding:0;top:'+(ih-1+idist)+'px;left:0px;width:'+iw+'px;height:'+iheit+'px; filter:flipv progid:DXImageTransform.Microsoft.Alpha(opacity='+(100*iopac)+',style=1,finishOpacity=0,startx=0,starty=0,finishx=0,finishy='+ih+');"><v:fill origin="0,0" position="0,-'+(divs/2-0.5)+'" size="1,'+(1*divs)+'" src="'+canvas.source+'" type="frame" /></v:rect>';
					}else if(itilt=='r') {
						fill = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#808080" style="position:absolute;margin:0;padding:0;width:'+iw+'px;height:'+(ih+iheit+idist)+'px;"><v:fill color="#808080" opacity="0" /></v:rect><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="'+iw+','+ih+'" path="m '+cw+',0 l '+cw+','+ih+','+(iw-cw)+','+(ih-ch)+','+(iw-cw)+','+ch+' x e" style="position:absolute;margin:0;padding:0;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"><v:fill src="'+canvas.source+'" type="frame" /></v:shape>';
						for(j=0;j<iter;j++) {
							if(j==(iter-1)) q = (rest>0?1:0);
							fill += '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#808080" coordorigin="0,0" coordsize="'+iw+','+ih+'" path="m '+(cw+(j*wide))+','+j+' l '+(q+cw+((j+1)*wide))+','+(j+1)+','+(q+cw+((j+1)*wide))+','+(ih-1-j)+','+(cw+(j*wide))+','+(ih-j)+' x e" style="position:absolute;margin:0;padding:0px;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"><v:fill origin="0,0" position="'+(half-j)+',0" size="'+((iw-cw-cw)/wide)+',1" type="frame" src="'+canvas.source+'" /></v:shape>';
						}
						if(rest>0) {
							fill += '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#808080" coordorigin="0,0" coordsize="'+iw+','+ih+'" path="m '+(cw+(j*wide))+','+j+' l '+(cw+((j+1)*wide))+','+(j+1)+','+(cw+((j+1)*wide))+','+(ih-1-j)+','+(cw+(j*wide))+','+(ih-j)+' x e" style="position:absolute;margin:0;padding:0px;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"><v:fill origin="0,0" position="'+(half-j)+',0" size="'+((iw-cw-cw)/wide)+',1" type="frame" src="'+canvas.source+'" /></v:shape>';
						} q = ((iter*z)/(ih/100))/2;
						if(bord>0||ibord>0) {
							fb = '<v:shape strokeweight="'+ibord+'" strokecolor="'+icolor+'" filled="f" stroked="'+(bord>0||ibord>0?'t':'f')+'" coordorigin="0,0" coordsize="'+iw+','+ih+'" path="m '+(cw+bord)+','+bord+' l '+(cw+bord)+','+(ih-bord)+','+(iw-cw-bord)+','+(ih-ch-bord)+','+(iw-cw-bord)+','+(ch+bord)+' x e" style="position:absolute;margin:0;padding:0;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"></v:shape>';
							xb = '<v:shape strokeweight="'+ibord+'" strokecolor="'+icolor+'" stroked="'+(bord>0||ibord>0?'t':'f')+'" filled="f" coordorigin="0,0" coordsize="'+iw+','+(ch+iheit+idist)+'" path="m '+(cw+bord)+','+(ch+idist+bord)+' l '+(cw+bord)+','+(iheit+ch+idist-bord)+','+(iw-cw-bord)+','+(parseInt((iheit+idist)*z)-bord)+','+(iw-cw-bord)+','+(parseInt(idist*z)+bord)+' x e" style="position:absolute;margin:0;padding:0;top:'+(ih-ch+idist)+'px;left:0px;width:'+iw+'px;height:'+(ch+iheit+idist)+'px; flip: y; filter:flipv progid:DXImageTransform.Microsoft.Alpha(opacity='+(100*iopac)+',style=1,finishOpacity=0,startx=0,starty=0,finishx='+q+',finishy=80);"></v:shape>';
						}else {fb = ''; xb = ''; }
						flex = '<v:shape strokeweight="0" stroked="f" filled="t" fillcolor="#808080" coordorigin="0,0" coordsize="'+iw+','+(ch+iheit+idist)+'" path="m '+cw+','+(ch+idist)+' l '+cw+','+(iheit+ch+idist)+','+(iw-cw)+','+parseInt((iheit+idist)*z)+','+(iw-cw)+','+parseInt(idist*z)+' x e" style="position:absolute;margin:0;padding:0;top:'+(ih-ch+idist)+'px;left:0px;width:'+iw+'px;height:'+(ch+iheit+idist)+'px; flip: y; filter:flipv progid:DXImageTransform.Microsoft.Alpha(opacity='+(100*iopac)+',style=1,finishOpacity=0,startx=0,starty=0,finishx='+q+',finishy=90);"><v:fill origin="0,0" position="0,-'+((divs/2)-0.5)+'" size="1,'+(divs)+'" src="'+canvas.source+'" type="frame" /></v:shape>';
					}else if(itilt=='l') {
						fill = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#808080" style="position:absolute;margin:0;padding:0;width:'+iw+'px;height:'+(ih+iheit+idist)+'px;"><v:fill color="#808080" opacity="0.0" /></v:rect><v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" coordorigin="0,0" coordsize="'+iw+','+ih+'" path="m '+cw+','+ch+' l '+cw+','+(ih-ch)+','+(iw-cw)+','+ih+','+(iw-cw)+',0 x e" style="position:absolute;margin:0;padding:0;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"><v:fill src="'+canvas.source+'" type="frame" /></v:shape>';
						for(j=0;j<iter;j++) {
							if(j==(iter-1)) q = (rest>0?1:0);
							fill += '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#808080" coordorigin="0,0" coordsize="'+iw+','+ih+'" path="m '+(cw+(j*wide))+','+(iter-j)+' l '+(q+cw+((j+1)*wide))+','+(iter-1-j)+','+(q+cw+((j+1)*wide))+','+(ih-1-iter+j)+','+(cw+(j*wide))+','+(ih-iter+j)+' x e" style="position:absolute;margin:0;padding:0px;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"><v:fill origin="0,0" position="'+(half-j)+',0" size="'+((iw-cw-cw)/wide)+',1" type="frame" src="'+canvas.source+'" /></v:shape>';
						}
						if(rest>0) {
							fill += '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#808080" coordorigin="0,0" coordsize="'+iw+','+ih+'" path="m '+(cw+(j*wide))+','+(iter-j)+' l '+(cw+((j+1)*wide))+','+(iter-1-j)+','+(cw+((j+1)*wide))+','+(ih-1-iter+j)+','+(cw+(j*wide))+','+(ih-iter+j)+' x e" style="position:absolute;margin:0;padding:0px;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"><v:fill origin="0,0" position="'+(half-j)+',0" size="'+((iw-cw-cw)/wide)+',1" type="frame" src="'+canvas.source+'" /></v:shape>';
						} q = 100-(((iter*z)/(ih/100))/2);
						if(bord>0||ibord>0) {
							fb = '<v:shape strokeweight="'+ibord+'" strokecolor="'+icolor+'" filled="f" stroked="'+(bord>0||ibord>0?'t':'f')+'" coordorigin="0,0" coordsize="'+iw+','+ih+'" path="m '+(cw+bord)+','+(ch+bord)+' l '+(cw+bord)+','+(ih-ch-bord)+','+(iw-cw-bord)+','+(ih-bord)+','+(iw-cw-bord)+','+bord+' x e" style="position:absolute;margin:0;padding:0;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px;"></v:shape>';
							xb = '<v:shape strokeweight="'+ibord+'" strokecolor="'+icolor+'" stroked="'+(bord>0||ibord>0?'t':'f')+'" filled="f" coordorigin="0,0" coordsize="'+iw+','+(ch+iheit+idist)+'" path="m '+(cw+bord)+','+(parseInt(idist*z)+bord)+' l '+(cw+bord)+','+(parseInt((iheit+idist)*z)-bord)+','+(iw-cw-bord)+','+(iheit+ch+idist-bord)+','+(iw-cw-bord)+','+(ch+idist+bord)+' x e" style="position:absolute;margin:0;padding:0;top:'+(ih-ch+idist)+'px;left:0px;width:'+iw+'px;height:'+(ch+iheit+idist)+'px; flip: y; filter:flipv progid:DXImageTransform.Microsoft.Alpha(opacity='+(100*iopac)+',style=1,finishOpacity=0,startx=100,starty=0,finishx='+q+',finishy=80);"></v:shape>';
						}else {fb = ''; xb = ''; }
						flex = '<v:shape strokeweight="0" filled="t" stroked="f" fillcolor="#808080" coordorigin="0,0" coordsize="'+iw+','+(ch+iheit+idist)+'" path="m '+cw+','+parseInt(idist*z)+' l '+cw+','+parseInt((iheit+idist)*z)+','+(iw-cw)+','+(iheit+ch+idist)+','+(iw-cw)+','+(ch+idist)+' x e" style="position:absolute;margin:0;padding:0;top:'+(ih-ch+idist)+'px;left:0px;width:'+iw+'px;height:'+(ch+iheit+idist)+'px; flip: y; filter:flipv progid:DXImageTransform.Microsoft.Alpha(opacity='+(100*iopac)+',style=1,finishOpacity=0,startx=100,starty=0,finishx='+q+',finishy=90);"><v:fill origin="0,0" position="0,-'+((divs/2)-0.5)+'" size="1,'+(divs)+'" src="'+canvas.source+'" type="frame" /></v:shape>';
					}
					var foot = '</v:group>';
					canvas.innerHTML = head+flex+xb+fill+fb+foot;
				}
			}else {
				if(canvas.tagName.toUpperCase() == "CANVAS" && canvas.getContext("2d")) {
					var context = canvas.getContext("2d");
					var img = new Image();
					img.onload = function() {
						if(canvas.isWK) {var obj = canvas.parentNode;}
						if(typeof resource=='undefined') {
							var resource = document.createElement('canvas');
							if(resource.getContext) {
								resource.style.position = 'fixed';
								resource.style.left = -9999+'px';
								resource.style.top = 0+'px';
								resource.height = canvas.height;
								resource.width = canvas.width;
								resource.style.height = canvas.height+'px';
								resource.style.width = canvas.width+'px';
								if(canvas.isWK&&!canvas.isW5) {obj.appendChild(resource);}
							}
						}
						if(canvas.isOP) {canvas.style.visibility = 'hidden';}
						context = canvas.getContext("2d");
						context.clearRect(0,0,ww,hh);
						context.globalCompositeOperation = "source-over";
						context.fillStyle = 'rgba(0,0,0,0)';
						context.fillRect(0,0,ww,hh);
						context.save();
						context.translate(0,boxh);
						context.scale(1,-1);
						context.drawImage(img,0,-(boxh-iheit-iheit-idist),ww,ih);
						context.restore();
						context.clearRect(0,boxh,ww,hh-boxh);
						if(ibord>0) {
							context.strokeStyle = icolor;
							context.lineWidth = ibord;
							context.beginPath();
							context.rect(bord,boxh-iheit+bord,ww-ibord,iheit);
							context.closePath();
							context.stroke();
							context.clearRect(0,boxh,ww,ibord);
						}
						if(!canvas.isWK||itilt=='n') {
							context.globalCompositeOperation = "destination-out";
							style = context.createLinearGradient(0,boxh-iheit,0,boxh);
							style.addColorStop(1,"rgba(0,0,0,1.0)");
							style.addColorStop(0,"rgba(0,0,0,"+iopac+")");
							context.fillStyle = style;
						}
						if(canvas.isWK) {
							context.beginPath();
							context.rect(0,boxh-iheit,ww,iheit);
							context.closePath();
							context.fill();
						}else {
							context.fillRect(0,boxh-iheit,ww,iheit);
						}
						context.globalCompositeOperation = "source-over";
						context.drawImage(img,0,0,iw,ih);
						if(canvas.isWK&&idist>0&&itilt!='n') {
							context.fillStyle = '#808080';
							context.fillRect(0,boxh-iheit-idist,ww,idist);
						}
						if(ibord>0&&itilt=='n') {
							context.beginPath();
							context.rect(bord,bord,ww-ibord,boxh-iheit-idist-ibord);
							context.closePath();
							context.stroke();
						}
						if(itilt=='l'||itilt=='r') {
							if(resource.getContext) {
								context = resource.getContext("2d");
								context.globalCompositeOperation = "source-over";
								context.clearRect(0,0,ww,hh);
								context.save();
								if(itilt=='r') {
									for(j=0;j<iter;j++) {
										context.drawImage(canvas,j*wide,0,wide,boxh,j*wide,j*1,wide,boxh-(j*2));
									}
									if(rest>0) {
										rest = canvas.width-(iter*wide);
										context.drawImage(canvas,j*wide,0,rest,boxh,j*wide,j*1,rest,boxh-(j*2));
									}
								}else {
									for(j=0;j<iter;j++) {
										context.drawImage(canvas,j*wide,0,wide,boxh,j*wide,(iter-j)*1,wide,boxh-((iter-j)*2));
									}
									if(rest>0) {
										rest = canvas.width-(iter*wide);
										context.drawImage(canvas,j*wide,0,rest,boxh,j*wide,0,rest,boxh);
									}
								}
								context.restore();
								if(canvas.getContext) {
									context = canvas.getContext("2d");
									context.clearRect(0,0,ww,hh);
									context.save();
									if(itilt=='r') {
										clipPolyRight(context,ww/20,0,ww*0.95,boxh,iter+(rest>0?1:0),idist,iheit);
									}else {
										clipPolyLeft(context,ww/20,0,ww*0.95,boxh,iter+(rest>0?1:1),idist,iheit);
									}
									context.clip();
									context.drawImage(resource,parseInt(ww/20),0,parseInt(ww*0.9),hh);
									context.restore();
									if(ibord>0) {
										context.lineWidth = ibord;
										if(itilt=='r') {
											strokePolyRight(context,ww/20,0,ww*0.95,boxh,iter+(rest>0?1:0),idist,iheit,bord);
											context.stroke();
										}else {
											strokePolyLeft(context,ww/20,0,ww*0.95,boxh,iter+(rest>0?1:0),idist,iheit,bord);
											context.stroke();
										}
									}
									if(canvas.isWK) {
										context.save();
										context.globalCompositeOperation = "destination-out";
										style = context.createLinearGradient((itilt=='l'?ww:0),boxh-iheit,(itilt=='l'?ww-(2*(wide/divs)):2*(wide/divs)),boxh);
										style.addColorStop(1,"rgba(0,0,0,1.0)");
										style.addColorStop(0,"rgba(0,0,0,"+iopac+")");
										context.fillStyle = style;
										clipReflex(context,ww/20,0,ww*0.95,boxh,iter+(rest>0?1:0),idist,iheit,itilt);
										context.fill();
										context.globalCompositeOperation = "source-in";
										clearReflex(context,ww/20,0,ww*0.95,boxh,iter+(rest>0?1:0),idist,iheit,itilt);
										context.clip();
										context.clearRect(0,0,ww,boxh);
										context.clearRect(0,0,ww,boxh);
										context.clearRect(0,0,ww,boxh);
										context.clearRect(0,0,ww,boxh);
										context.restore();
										if(canvas.isWK&&!canvas.isW5) {obj.removeChild(resource);}
									}
								}
							}
						}
						if(canvas.isOP) {canvas.style.visibility = 'visible';}
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
				cvi_reflex.replace(canvas);
			}
		}else {
			if(canvas.tagName.toUpperCase() == "CANVAS") {
				cvi_reflex.replace(canvas);
			}
		}
	}
}