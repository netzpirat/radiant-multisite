/**
 * cvi_edge_lib.js 1.41 (21-Mar-2009)
 * (c) by Christian Effenberger 
 * All Rights Reserved
 * Source: edge.netzgesta.de
 * Distributed under Netzgestade Software License Agreement
 * http://www.netzgesta.de/cvi/LICENSE.txt
 * License permits free of charge
 * use on non-commercial and 
 * private web sites only 
 * syntax:
	cvi_edge.defaultMask = 0;  			//INT  0-n
	cvi_edge.defaultInbuilt = false; 	//BOOL
	cvi_edge.defaultType = 'frame'; 	//STR  'f|l|r'-'frame|linear|radial'
	cvi_edge.defaultAngle = 0; 			//INT  0|90|180|270 (degree) [linear only]
	cvi_edge.defaultSize = 20; 			//INT  1-200 (px) [frame only]
	cvi_edge.remove( image );
	cvi_edge.add( image, options );
	cvi_edge.modify( image, options );
	cvi_edge.add( image, { mask: value, inbuilt: value, type: value, angle: value, size: value } );
	cvi_edge.modify( image, { mask: value, inbuilt: value, type: value, angle: value, size: value } );
 *
**/


if(document.images) {
	var maskimg = new Array();
	var mimgCount = 0; var mi, mtimerID;
	var loadedmask = new Array();
}
function addImageMasks() {}
function preloadImages() {
	if(typeof(window['mask2load']) != "undefined") {
		for(mi=0; mi<mask2load.length; mi++) {
			maskimg[mi] = new Image();
			maskimg[mi].src = mask2load[mi];
		}
		for(mi=0; mi<maskimg.length; mi++) {
			loadedmask[mi] = false;
		}
		checkMaskImgLoad();
	}else {	
		addImageMasks();
	}
}
function checkMaskImgLoad() {
	if(mimgCount == maskimg.length || maskimg[0].src=='') {
		addImageMasks();
		return;
	}
	for(mi=0; mi<=maskimg.length; mi++) {
		if(loadedmask[mi] == false && maskimg[mi].complete) {
			loadedmask[mi] = true; mimgCount++;
		}
	}
	mtimerID = setTimeout("checkMaskImgLoad()",10); 
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
function addFrameMask(ctx,x,y,w,h,r,o,c,i){
	var style; var os = r, p = Math.round(r/8);
	ctx.fillStyle = 'rgba('+c+','+c+','+c+','+o+')';
	if(i) {ctx.beginPath(); ctx.rect(x+r,y+r,w-(r*2),h-(r*2)); ctx.closePath(); ctx.fill();}
	if(navigator.appName=='Opera' && !i) {
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
function addLinearMask(ctx,x,y,w,h,d){
	var style; ctx.beginPath(); ctx.rect(x,y,w,h); ctx.closePath();
	if(d==90) {style = ctx.createLinearGradient(w,y,x,y);}else if(d==180) {style = ctx.createLinearGradient(x,h,x,y);}else if(d==270) {style = ctx.createLinearGradient(x,y,w,y);}else {style = ctx.createLinearGradient(x,y,x,h);}
	style.addColorStop(0,'rgba(0,0,0,0.0)'); style.addColorStop(1,'rgba(0,0,0,1.0)'); ctx.fillStyle = style; ctx.fill();
}
function addRadialMask(ctx,x,y,w,h){
	var mx = Math.max(w,h); if(w>h) {ctx.scale(1,h/w);}else if(h>w) {ctx.scale(w/h,1);}
	var style = ctx.createRadialGradient(mx/2,mx/2,1,mx/2,mx/2,mx/2); style.addColorStop(0,'rgba(0,0,0,0.0)'); style.addColorStop(1,'rgba(0,0,0,1.0)');
	ctx.beginPath(); ctx.rect(x,y,mx,mx); ctx.closePath(); ctx.fillStyle = style; ctx.fill();
}

var cvi_edge = {
	defaultMask : 0,
	defaultInbuilt : false,
	defaultType : 'frame',
	defaultAngle : 0,
	defaultSize : 20,	
	add: function(image, options) {
		if(image.tagName.toUpperCase() == "IMG") {
			var defopts = { "mask" : cvi_edge.defaultMask, "inbuilt" : cvi_edge.defaultInbuilt, "type" : cvi_edge.defaultType, "angle" : cvi_edge.defaultAngle, "size" : cvi_edge.defaultSize }
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
					canvas.height = imageHeight;
					canvas.width = imageWidth;
					object.replaceChild(canvas,image);
					cvi_edge.modify(canvas, options);
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
						cvi_edge.modify(canvas, options);
					}
				}
			} catch (e) {
			}
		}
	},
	
	modify: function(canvas, options) {
		try {
			var mask = (typeof options['mask']=='number'?options['mask']:canvas.options['mask']); canvas.options['mask']=mask;
			var inbuilt = (typeof options['inbuilt']=='boolean'?options['inbuilt']:canvas.options['inbuilt']); canvas.options['inbuilt']=inbuilt;
			var type = (typeof options['type']=='string'?options['type']:canvas.options['type']); 
			var angle = (typeof options['angle']=='number'?options['angle']:canvas.options['angle']); 
			var size = (typeof options['size']=='number'?options['size']:canvas.options['size']); canvas.options['size']=size;
			var idir = (angle==90||angle==180||angle==270?angle:0); canvas.options['angle']=idir;
			var itype = (type.match(/^[flr]/i)?type.substr(0,1):'f'); canvas.options['type']=itype;
			var ih = canvas.height; var iw = canvas.width; var rs = Math.round((iw+ih)/20); var maxd = Math.min(iw,ih)/2; var mind = (size==0?rs:size); 
			var isize = Math.min(maxd,mind); var imask = Math.min(mask,maskimg.length-1); var head, foot, fill, linear, radial, tpa, tpb, vec, pos;
			if(document.all && document.namespaces && !window.opera) {
				if(canvas.tagName.toUpperCase() == "VAR") {
					if(idir==90) {vec = 'startX=100,finishX=0,startY=0,finishY=0';}else if(idir==180) {vec = 'startX=0,finishX=0,startY=100,finishY=0';}else if(idir==270) {vec = 'startX=0,finishX=100,startY=0,finishY=0';}else {vec = 'startX=0,finishX=0,startY=0,finishY=100';}
					head = '<v:group style="zoom:1;display:'+canvas.dpl+';margin:0;padding:0;position:relative;width:'+iw+'px;height:'+ih+'px;" coordsize="'+iw+','+ih+'">'; foot = '</v:group>';
					fill = '<v:rect strokeweight="0" filled="t" stroked="f" fillcolor="#ffffff" style="zoom:1;margin:-1px 0 0 -1px;padding:0;display:block;position:absolute;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px; filter:Alpha(opacity=100, finishopacity=0, style=3);"><v:fill src="'+canvas.source+'" type="frame" /></v:rect>'; 
					radial = '<div style="margin:0;padding:0;position:absolute;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px; filter:Alpha(opacity=100,finishOpacity=0,style=2);"><img src="'+canvas.source+'" width="'+iw+'" height="'+ih+'" /></div>'; 
					linear = '<div style="margin:0;padding:0;position:absolute;top:0px;left:0px;width:'+iw+'px;height:'+ih+'px; filter:Alpha(opacity=100,finishOpacity=0,'+vec+',style=1);"><img src="'+canvas.source+'" width="'+iw+'" height="'+ih+'" /></div>'; 
					if(typeof(window['mask2load'])!="undefined" && imask>=0) { pos = checkGifVersion(imask);
						if(maskimg[pos].width>0 && maskimg[pos].height>0 && inbuilt==false && pos>=0) {
							tpb = '<div id="img_b" style="margin:0;padding:0;width:'+iw+'px;height:'+ih+'px;display:none;"><img src="'+maskimg[pos].src+'" width="'+iw+'" height="'+ih+'" /></div>';	
							tpa = '<div id="img_a" style="margin:0;padding:0;width:'+iw+'px;height:'+ih+'px; filter:progid:DXImageTransform.Microsoft.Compositor(Function=4);"><img src="'+canvas.source+'" width="'+iw+'" height="'+ih+'" /></div>';
							canvas.innerHTML = head+tpb+tpa+foot;
							tpa = document.getElementById("img_a"); tpb = document.getElementById("img_b");
							tpa.filters[0].Apply(); tpa.innerHTML=tpb.innerHTML; tpa.filters[0].Play(); 
							tpa.filters['DXImageTransform.Microsoft.Compositor'].Function=6;
							tpa.id = ""; tpb.id = "";
						}else {
							if(itype=='l') {
								canvas.innerHTML = head+linear+foot;
							}else if(itype=='r') {
								canvas.innerHTML = head+radial+foot;
							}else {
								canvas.innerHTML = head+fill+fill+fill+fill+fill+fill+foot;
							}
						}
					}else {
						if(itype=='l') {
							canvas.innerHTML = head+linear+foot;
						}else if(itype=='r') {
							canvas.innerHTML = head+radial+foot;
						}else {
							canvas.innerHTML = head+fill+fill+fill+fill+fill+fill+foot;
						}
					}
				}
			}else {
				if(canvas.tagName.toUpperCase() == "CANVAS" && canvas.getContext("2d")) {
					var context = canvas.getContext("2d");
					var img = new Image();
					img.onload = function() {
						context.clearRect(0,0,iw,ih);
						context.globalCompositeOperation = "source-over";
						context.drawImage(img,0,0,iw,ih);
						context.save();
						context.globalCompositeOperation = "destination-out";
						if(typeof(window['mask2load'])!="undefined" && imask>=0) {
							if(maskimg[imask].width>0 && maskimg[imask].height>0 && inbuilt==false) {
								context.drawImage(maskimg[imask],0,0,iw,ih);
							}else {
								if(itype=='l') {
									addLinearMask(context,0,0,iw,ih,idir);
								}else if(itype=='r') {
									addRadialMask(context,0,0,iw,ih,isize);
								}else {
									addFrameMask(context,0,0,iw,ih,isize,1,0);
								}
							}
						}else {
							if(itype=='l') {
								addLinearMask(context,0,0,iw,ih,idir);
							}else if(itype=='r') {
								addRadialMask(context,0,0,iw,ih,isize);
							}else {
								addFrameMask(context,0,0,iw,ih,isize,1,0);
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
		img.style.height = canvas.height+'px';
		img.style.width = canvas.width+'px';
		object.replaceChild(img,canvas);
	},

	remove : function(canvas) {
		if(document.all && document.namespaces && !window.opera) {
			if(canvas.tagName.toUpperCase() == "VAR") {
				cvi_edge.replace(canvas);
			}
		}else {
			if(canvas.tagName.toUpperCase() == "CANVAS") {
				cvi_edge.replace(canvas);
			}
		}
	}
}