/**
 * cvi_filter_lib.js 1.6 (14-Jul-2009) (c) by Christian Effenberger 
 * All Rights Reserved. Source: filter.netzgesta.de
 * Library supports: cvi_bevel.js|cvi_corner.js|cvi_curl.js|cvi_edge.js|
 * cvi_glossy.js|cvi_instant.js|cvi_reflex.js|cvi_slide.js|cvi_sphere.js|cvi_strip
 * Distributed under Netzgestade Non-commercial Software License Agreement.
 * This license permits free of charge use on non-commercial 
 * and private web sites only under special conditions. 
 * Read more at... http://www.netzgesta.de/cvi/LICENSE.html

 syntax:
	cvi_filter.defaultF	= null;		//STR filter (e.g. "invert"|"grayscale"|"solarize"|"convolve"...)
		"invert": Reverses all colors of the image [reversable].
		"colorkey": Set alpha to 0 if pixel color values are higher than min and lower than max rgb color.
		"chromakey": Set alpha to 0 if pixel hue & saturation & brightness matches.
		"invertalpha": Reverses the transparency of the image [reversable if transparency >0 && <255].
		"adjustrgba": Adjust the red & green & blue & alpha channel of the image (r,g,b,a).
		"adjusthsba": Adjust hue & saturation & brightness & alpha channel of the image (h,s,b,a).
		"adjustyuva": Adjust luminance & blue–yellow chrominance & red–cyan chrominance & alpha channel of the image (y,u,v,a).
		"grayscale": Converts the image into grayscale.
		"threshold": Converts the image to black&white (s<1 == darker and s>1 == brighter).
		"solarize": Solarizes the image by negating the colors.
		"posterize": Posterizes the image by quantizing each channel to a limited number of levels.
		"tritone": Applies 3 colors for low|mid|high range according to the brightness of the image.
		"mixrgb": Mixes the RGB channels with the other two channels.
		"sepia": Applies the well-known sepia coloring to the image.
		"gamma": Standard gamma correction (s<1 == darker and s>1 == brighter).
		"brightness": Change brightness (s<1 == darker and s>1 == brighter).
		"contrast": Change contrast (s<1 == lower and s>1 == higher).
		"exposure": Simulates changing the exposure of the image.
		"smooth": Smoothes the image (result is similar to bluring).
		"spinblur": Blurs by rotating the centered image.
		"zoomblur": Blurs by zooming the centered image.
		"motionblur": Blurs by moving the image to a defined direction.
		"outline": Creates grayscaled outline images by different operators (e.g. sobel, prewitt...).
		"convolve": Use your own 3x3 matrix via option m=[[n,n,n],[n,n,n],[n,n,n]].
		cvi_matrix.* Use external predefined 3x3 convolution kernels.
	cvi_filter.defaultM	= null;		//OBJ 3x3 kernel matrix if f=="convolve" (e.g. [[1,2,1],[2,4,2],[1,2,1]])
	cvi_filter.defaultS	= 1;		//FLT if f=="brightness|contrast|gamma|exposure". The multiplier (0-255)
	cvi_filter.defaultS	= 1;		//FLT if f=="zoomblur|spinblur" distance (px)
	cvi_filter.defaultS	= 1;		//FLT if f=="posterize" number of levels (1-16)
	cvi_filter.defaultS	= 1;		//FLT if f=="threshold". The multiplier of 127 (0-2)
	cvi_filter.defaultS	= 1;		//FLT if f=="smooth" radius (px 1-10) 
	cvi_filter.defaultS	= [1,0];	//OBJ if f=="motionblur" distance (px) and angle (0-360) 
	cvi_filter.defaultS	= [1,1,1,1];//OBJ if f=="adjustrgba" r, g, b, a. The multipliers (0-255)
	cvi_filter.defaultS	= [1,1,1,1];//OBJ if f=="adjusthsba" h, s, b, a. The multipliers (0-255)
	cvi_filter.defaultS	= [1,1,1,1];//OBJ if f=="adjustyuva" y, u, v, a. The multipliers (0-255)
	cvi_filter.defaultS	= [0,0,0,0,0];//OBJ if f=="chromakey" hue (0-360) and hue tolerance, min saturation, min brightness, max brightness (0-100)
	cvi_filter.defaultS	= [[0,0,0],[0,0,0]];//OBJ if f=="colorkey" rgb min and rgb max triplet (0-255)
	cvi_filter.defaultS	= [[0,0,0],[0,0,0]];//OBJ if f=="mixrgb" mix into r, g, b with bluegreen, redblue, greenred as triplets [0-255,0-255,0-255]
	cvi_filter.defaultS	= [[0,0,0],[0,0,0],[0,0,0]];//OBJ if f=="tritone" low|mid|high range colors as rgb triplets [0-255,0-255,0-255]
	cvi_filter.defaultS	= [auto,0];	//OBJ if f=="convolve" or m!=null. Divisor of convolution result (0-255), 
									useable for normalization and bias (-1==auto, 0-255) for brightness addition. 
	cvi_filter.defaultS	= [1,0,'name'];	//OBJ if f=="outline". Divisor (1-255), bias (0-255) and operator ('sobel'|'scharr'|'prewitt'|'kirsh'|'roberts'). 
	cvi_filter.add( canvas, buffer, options, width, height );
	options == {f:'convolve', m:[[-1,-1, 0],[-1, 0, 1],[ 0, 1, 1]], s:[1,0]}
FLT=cvi_filter.version;
STR=cvi_filter.released;
	
 *
**/

var cvi_matrix=new Object(); // External kernel matrix definitions
// REMEMBER: Used names should not match any of the filter names!!!
cvi_matrix.blur		= [[ 1, 2, 1],[ 2, 4, 2],[ 1, 2, 1]]; // blurs the image using the Gaussian method.
cvi_matrix.median	= [[ 1, 1, 1],[ 1, 1, 1],[ 1, 1, 1]]; // smoothes grainy images.
cvi_matrix.sharpen	= [[ 0,-1, 0],[-1, 9,-1],[ 0,-1, 0]]; // makes the image sharper.
cvi_matrix.sharper	= [[-1,-1,-1],[-1,16,-1],[-1,-1,-1]]; // makes the image even sharper.
cvi_matrix.sharp	= [[-1,-1,-1],[-1, 9,-1],[-1,-1,-1]]; // makes the image sharper.
cvi_matrix.sharpest	= [[-1,-2,-1],[-2,13,-2],[-1,-2,-1]]; // makes the image sharper.
cvi_matrix.bumplt	= [[ 1, 1, 0],[ 1, 1,-1],[ 0,-1,-1]]; // embosses the image. 
cvi_matrix.bumpbr	= [[-1,-1, 0],[-1, 1, 1],[ 0, 1, 1]]; // embosses the image. 
/*** add H E R E your personal convolution kernels  ***/
/*** additional edge detection convolution kernels  ***/
cvi_matrix.laplace1	= [[-1, 0,-1],[ 0, 4, 0],[-1, 0,-1]]; // embosses the image. 
cvi_matrix.laplace2	= [[ 0, 1, 0],[ 1,-4, 1],[ 0, 1, 0]]; // embosses the image. 
cvi_matrix.laplace3	= [[ 1, 1, 1],[ 1,-8, 1],[ 1, 1, 1]]; // embosses the image. 
cvi_matrix.laplace4	= [[ 1, 2, 1],[ 2,-12,2],[ 1, 2, 1]]; // embosses the image. 
cvi_matrix.embossbr	= [[-1,-1, 0],[-1, 0, 1],[ 0, 1, 1]]; // embosses the image. normalize with s=[1,0]
cvi_matrix.embosslt	= [[ 1, 1, 0],[ 1, 0,-1],[ 0,-1,-1]]; // embosses the image. normalize with s=[1,0]
cvi_matrix.edge1	= [[-5, 0, 0],[ 0, 0, 0],[ 0, 0, 5]]; // edge detection. use s=[0-255,0-255]
cvi_matrix.edge2	= [[-5,-5,-5],[-5,39,-5],[-5,-5,-5]]; // edge detection. use s=[0-255,0-255]
cvi_matrix.edge3	= [[-1,-1,-1],[-1, 8,-1],[-1,-1,-1]]; // edge detection. use s=[0-255,0-255]
cvi_matrix.edge4	= [[-1,-1,-1],[ 0, 0, 0],[ 1, 1, 1]]; // edge detection. use s=[0-255,0-255]
cvi_matrix.edge5	= [[-1,-1,-1],[ 2, 2, 2],[-1,-1,-1]]; // edge detection. use s=[0-255,0-255]
cvi_matrix.edge6	= [[ 1, 1, 1],[ 1,-7, 1],[ 1, 1, 1]]; // edge detection. use s=[0-255,0-255]
cvi_matrix.edge7	= [[-1, 0, 1],[ 0, 0, 0],[ 1, 0,-1]]; // edge detection. use s=[0-255,0-255]

var cvi_filter = {version : 1.6, released : '2009-07-14 16:34:00', defaultF : null, defaultM : null, defaultS : -1, 
	add : function(obj,img,opts,w,h) {
		function hsb2rgb(h,s,b) {var c,f,u,p,q,t; c=proper?Math.round(b/100*255):Math.min(255,Math.max(0,Math.round(b/100*255))); if(s==0){return [c,c,c];}else{u=h%360; f=u%60; p=proper?Math.round((b*(100-s))/10000*255):Math.min(255,Math.max(0,Math.round((b*(100-s))/10000*255))); q=proper?Math.round((b*(6000-s*f))/600000*255):Math.min(255,Math.max(0,Math.round((b*(6000-s*f))/600000*255))); t=proper?Math.round((b*(6000-s*(60-f)))/600000*255):Math.min(255,Math.max(0,Math.round((b*(6000-s*(60-f)))/600000*255))); switch(Math.floor(u/60)) {case 0: return [c,t,p]; case 1: return [q,c,p]; case 2: return [p,c,t]; case 3: return [p,q,c]; case 4: return [t,p,c]; case 5: return [c,p,q];}}return [0,0,0];};
		function rgb2hsb(r,g,b) {var rr,gr,br,h,a=Math.max(r,g,b),i=Math.min(r,g,b),d=a-i,n=a/255,s=(a!=0)?d/a:0; if(s==0){h=0;}else {rr=(a-r)/d; gr=(a-g)/d; br=(a-b)/d; if(r==a) {h=br-gr;}else if(g==a) {h=2+rr-br;}else {h=4+gr-rr;} h/=6; if(h<0){h++;}}return [Math.round(h*360), Math.round(s*100), Math.round(n*100)];};
		function yuv2rgb(y,u,v) {return [Math.min(255,Math.max(0,Math.round(y+v/0.877))),Math.min(255,Math.max(0,Math.round(y-0.39466*u-0.5806*v))),Math.min(255,Math.max(0,Math.round(y+u/0.493)))];};
		function rgb2yuv(r,g,b) {var y=0.299*r+0.587*g+0.114*b; return [y,(b-y)*0.493,(r-y)*0.877];};
		function getArg(a,t) {return (typeof opts[a]===t?opts[a]:defopts[a]);}; 
		if(obj&&obj.tagName.toUpperCase()=="CANVAS") { 
			if(obj.getContext) {var s,a,d,r,g,b,p,c,f,i,j,k,l,m,n,o,q,t,u,v,x=0,y=0,z=0,cb=false,yuv,hsb,rgb,ctx,bcx,defopts,proper,prepared; 
				ctx=obj.getContext('2d'); proper=window.opera||navigator.userAgent.indexOf('Chrome')>-1||navigator.userAgent.indexOf('WebKit')>-1?1:0; 
				if(ctx.getImageData){prepared=true;} defopts={"f":cvi_filter.defaultF, "m":cvi_filter.defaultM, "s":cvi_filter.defaultS}; bcx=img.getContext('2d');
				if(opts) {for(i in defopts){if(!opts[i]){opts[i]=defopts[i];}}}else{opts=defopts;} f=getArg('f','string'); m=getArg('m','object');
				c=(typeof opts['s']==='object')?opts['s']||-1:parseFloat(Math.max(0,Math.min(255,getArg('s','number'))))||-1;
				if(bcx&&prepared&&f!=null&&w>0&&h>0) {w+=4; h+=4; if(f=="convolve"&&(typeof m==='object')&&m!=null||(typeof cvi_matrix[f]==='object')) {s=ctx.getImageData(x,y,w,h); a=s.data;  
						d=ctx.getImageData(x,y,w,h); j=h; i=w; n=w*4; k=cvi_matrix[f]||m; t=(c[0]>=0?c[0]:k[0][0]+k[0][1]+k[0][2]+k[1][0]+k[1][1]+k[1][2]+k[2][0]+k[2][1]+k[2][2]); m=(c[1]>=0?Math.min(255,c[1]):0);
						for(j=h; j>0; j--) {q=[(j-2)*n,(j-1)*n,j*n]; for(i=w; i>0; i--) {o=[q[0]+(i-2)*4, q[1]+(i-1)*4, q[2]+i*4];
							r=(a[o[0]-4]*k[0][0]+a[o[0]]*k[0][1]+a[o[0]+4]*k[0][2]+a[o[1]-4]*k[1][0]+a[o[1]]*k[1][1]+a[o[1]+4]*k[1][2]+a[o[2]-4]*k[2][0]+a[o[2]]*k[2][1]+a[o[2]+4]*k[2][2])/t;
							g=(a[o[0]-3]*k[0][0]+a[o[0]+1]*k[0][1]+a[o[0]+5]*k[0][2]+a[o[1]-3]*k[1][0]+a[o[1]+1]*k[1][1]+a[o[1]+5]*k[1][2]+a[o[2]-3]*k[2][0]+a[o[2]+1]*k[2][1]+a[o[2]+5]*k[2][2])/t;
							b=(a[o[0]-2]*k[0][0]+a[o[0]+2]*k[0][1]+a[o[0]+6]*k[0][2]+a[o[1]-2]*k[1][0]+a[o[1]+2]*k[1][1]+a[o[1]+6]*k[1][2]+a[o[2]-2]*k[2][0]+a[o[2]+2]*k[2][1]+a[o[2]+6]*k[2][2])/t;			
							if(proper) {d.data[o[1]]=r+m; d.data[o[1]+1]=g+m; d.data[o[1]+2]=b+m;}else {d.data[o[1]]=Math.min(255,Math.max(0,r+m)); d.data[o[1]+1]=Math.min(255,Math.max(0,g+m)); d.data[o[1]+2]=Math.min(255,Math.max(0,b+m));}}
						}ctx.putImageData(d,x,y); 
					}else if(f=="outline") {v=(c[0]>=0?Math.min(255,c[0]):1); b=(c[1]>=0?Math.min(255,c[1]):0); t=(c[2]!=''?c[2].match(/sobel|scharr|prewitt|kirsh|roberts/i)?c[2]:'sobel':'sobel'); s=ctx.getImageData(x,y,w,h); a=s.data; d=ctx.getImageData(x,y,w,h); u=new Object(); 
						u.sobel=new Object(); u.sobel.y= [1,2,1,0,0,0,-1,-2,-1]; u.sobel.x= [1,0,-1,2,0,-2,1,0,-1]; u.scharr=new Object(); u.scharr.y= [3,10,3,0,0,0,-3,-10,-3]; u.scharr.x= [3,0,-3,10,0,-10,3,0,-3]; u.prewitt=new Object(); u.prewitt.y= [-1,-1,-1,0,0,0,1,1,1]; u.prewitt.x= [1,0,-1,1,0,-1,1,0,-1]; 
						u.kirsh=new Object(); u.kirsh.y= [5,5,5,-3,0,-3,-3,-3,-3]; u.kirsh.x= [5,-3,-3,5,0,-3,5,-3,-3]; u.roberts=new Object(); u.roberts.y= [-1,0,0,0,1,0,0,0,0]; u.roberts.x= [0,0,-1,0,1,0,0,0,0]; g=u[t].y; r=u[t].x; 		
						for(i=0, n=a.length; i<n; i+=4) {o=[[i-(w+1)*4,i-w*4,i-(w-1)*4],[i-4,i,i+4],[i+(w-1)*4,i+w*4,i+(w+1)*4]];
							l=g[0]*(a[o[0][0]]||0)+g[1]*(a[o[0][1]]||0)+g[2]*(a[o[0][2]]||0)+g[3]*(a[o[1][0]]||0)+g[4]*(a[o[1][1]]||0)+g[5]*(a[o[1][2]]||0)+g[6]*(a[o[2][0]]||0)+g[7]*(a[o[2][1]]||0)+g[8]*(a[o[2][2]]||0);
							m=r[0]*(a[o[0][0]]||0)+r[1]*(a[o[0][1]]||0)+r[2]*(a[o[0][2]]||0)+r[3]*(a[o[1][0]]||0)+r[4]*(a[o[1][1]]||0)+r[5]*(a[o[1][2]]||0)+r[6]*(a[o[2][0]]||0)+r[7]*(a[o[2][1]]||0)+r[8]*(a[o[2][2]]||0);
							q=Math.min(255,Math.max(0,(Math.sqrt((l*l)+(m*m))/v)+b)); d.data[i]=d.data[i+1]=d.data[i+2]=q;
						}ctx.putImageData(d,x,y); 
					}else if(f=="smooth") {v=(c>0?Math.min(10,Math.max(1,c)):1); t=Math.round(v*5); b=Math.round(w*.75); q=Math.round(h*.75); for(i=0;i<t;i++) {r=Math.max(2,Math.round(b-(2*i))); g=Math.max(2,Math.round(q-(2*i))); bcx.clearRect(0,0,w-4,h-4); bcx.drawImage(obj,0,0,w,h,0,0,r,g); ctx.clearRect(0,0,w,h); ctx.drawImage(img,0,0,r,g,0,0,w,h);} bcx.drawImage(obj,0,0,w,h,0,0,w-4,h-4);				
					}else if(f=="zoomblur") {bcx.drawImage(obj,0,0,w,h,0,0,w-4,h-4); v=(c>0?c:1); p=ctx.globalAlpha; b=.25; m=b/v; for(i=0;i<v;i++) {ctx.globalAlpha=b-(m*i); ctx.drawImage(img,0,0,img.width,img.height,-i,-i,w+(2*i),h+(2*i));} ctx.globalAlpha=p; bcx.drawImage(obj,0,0,w,h,0,0,w-4,h-4);
					}else if(f=="motionblur") {bcx.drawImage(obj,0,0,w,h,0,0,w-4,h-4); v=(c[0]>0?c[0]:1); r=(c[1]>=0?Math.min(360,c[1]):0); p=ctx.globalAlpha; i=0; b=.25; m=b/v; var xo,yo,dx,dy,sx=1,sy=1,xi=0,yi=0,frc; z=((r-90)*Math.PI)/180; xo=Math.round(v*Math.cos(z))+xi; yo=Math.round(v*Math.sin(z))+yi; dx=xo-xi; dy=yo-yi; if(dx<0) {sx=-1; dx=-dx;} if(dy<0) {sy=-1; dy=-dy;} dx=dx<<1; dy=dy<<1; if(dy<dx) {frc=dy-(dx>>1); while(xi!=xo) {if(frc>=0) {yi+=sy; frc-=dx;} frc+=dy; xi+=sx; i++; ctx.globalAlpha=b-(m*i); ctx.drawImage(img,0,0,img.width,img.height,xi,yi,w,h);}}else {frc=dx-(dy>>1); while(yi!=yo) {if(frc>=0) {xi+=sx; frc-=dy;} frc+=dx; yi+=sy; i++; ctx.globalAlpha=b-(m*i); ctx.drawImage(img,0,0,img.width,img.height,xi,yi,w,h);}}ctx.globalAlpha=p; bcx.drawImage(obj,0,0,w,h,0,0,w-4,h-4);
					}else if(f=="spinblur") {bcx.drawImage(obj,0,0,w,h,0,0,w-4,h-4); v=(c>0?c:1); b=.25; m=b/v; ctx.save(); ctx.translate(w/2,h/2); for(i=0;i<v;i++) {ctx.globalAlpha=b-(m*i); ctx.save(); ctx.rotate((Math.PI*i)/180); ctx.drawImage(img,0,0,img.width,img.height,0-(w/2),0-(h/2),w,h); ctx.restore(); ctx.save(); ctx.rotate((Math.PI*-i)/180); ctx.drawImage(img,0,0,img.width,img.height,0-(w/2),0-(h/2),w,h); ctx.restore();} ctx.restore(); bcx.drawImage(obj,0,0,w,h,0,0,w-4,h-4);
					}else {s=ctx.getImageData(x,y,w,h); a=s.data;
						if(f=="invertalpha") {for(i=0, n=a.length; i<n; i+=4) {a[i+3]=255-a[i+3];}}
						else if(f=="invert") {for(i=0, n=a.length; i<n; i+=4) {a[i]=255-a[i]; a[i+1]=255-a[i+1]; a[i+2]=255-a[i+2];}}
						else if(f=="grayscale") {for(i=0, n=a.length; i<n; i+=4) {t=Math.round(a[i]*0.299+a[i+1]*0.587+a[i+2]*0.114); a[i]=a[i+1]=a[i+2]=t;}}
						else if(f=="solarize") {for(i=0, n=a.length; i<n; i+=4) {if(a[i]>127) {a[i]=255-a[i];} if(a[i+1]>127) {a[i+1]=255-a[i+1];} if(a[i+2]>127) {a[i+2]=255-a[i+2];}}}
						else if(f=="threshold") {v=(c>=0?Math.min(2,c)*127:127); for(i=0, n=a.length; i<n; i+=4) {t=Math.round(a[i]*0.299+a[i+1]*0.587+a[i+2]*0.114); t=t>=v?255:0; a[i]=t; a[i+1]=t; a[i+2]=t;}}
						else if(f=="gamma") {g=(c>=0?c:1); t=new Array(); for(i=0;i<256;i++) {t[i]=Math.min(255,Math.max(0,(255*Math.pow(i/255,1/g))+0.5));} for(i=0, n=a.length; i<n; i+=4) {r=a[i]; g=a[i+1]; b=a[i+2]; a[i]=t[r]; a[i+1]=t[g]; a[i+2]=t[b];}}
						else if(f=="colorkey") {l=(typeof c[0]==='object')?c[0]:[0,0,0]; k=(typeof c[1]==='object')?c[1]:[255,255,255]; for(i=0, n=a.length; i<n; i+=4) {if((a[i]>=l[0]&&a[i]<=k[0])&&(a[i+1]>=l[1]&&a[i+1]<=k[1])&&(a[i+2]>=l[2]&&a[i+2]<=k[2])) {a[i+3]=0;}}}
						else if(f=="exposure") {v=(c>0?Math.min(255,Math.max(0,c)):1); if(v!=1) {t=new Array(); for(i=0; i<256; i++) {t[i]=Math.min(255,Math.max(0,255*(1-Math.exp(-(i/255)*v))));} for(i=0, n=a.length; i<n; i+=4) {r=a[i]; g=a[i+1]; b=a[i+2]; a[i]=t[r]; a[i+1]=t[g]; a[i+2]=t[b];}}}
						else if(f=="brightness") {v=(c>=0?c:1); if(proper) {for(i=0, n=a.length; i<n; i+=4) {a[i]=a[i]*v; a[i+1]=a[i+1]*v; a[i+2]=a[i+2]*v;}}else {for(i=0, n=a.length; i<n; i+=4) {a[i]=Math.min(255,Math.max(0,a[i]*v)); a[i+1]=Math.min(255,Math.max(0,a[i+1]*v)); a[i+2]=Math.min(255,Math.max(0,a[i+2]*v));}}}
						else if(f=="adjustyuva") {k=(c[0]>=0?c[0]:1); t=(c[1]>=0?c[1]:1); m=(c[2]>=0?c[2]:1); v=(c[3]>=0?c[3]:1); for(i=0, n=a.length; i<n; i+=4) {yuv=rgb2yuv(a[i],a[i+1],a[i+2]); rgb=yuv2rgb(yuv[0]*k,yuv[1]*t,yuv[2]*m); a[i]=rgb[0]; a[i+1]=rgb[1]; a[i+2]=rgb[2]; a[i+3]=Math.min(255,Math.max(0,a[i+3]*v));}}
						else if(f=="chromakey") {k=(c[0]>=0?Math.min(360,c[0]):127); t=(c[1]>=0?Math.min(360,c[1]*3.6):36); m=(c[2]>=0?Math.min(100,c[2]):88); r=(c[3]>=0?Math.min(100,c[3]):30); b=(c[4]>=0?Math.min(100,Math.max(r,c[4])):82); for(i=0, n=a.length; i<n; i+=4) {v=rgb2hsb(a[i],a[i+1],a[i+2]); if(v[1]>=m&&(v[2]>=r&&v[2]<=b)&&(v[0]-k<t)&&(v[0]-k>(-t))) {a[i+3]=Math.abs(v[0]-k)/t;}}}
						else if(f=="sepia") {if(proper) {for(i=0, n=a.length; i<n; i+=4) {r=a[i]; g=a[i+1]; b=a[i+2]; a[i]=r*.393+g*.769+b*.189; a[i+1]=r*.349+g*.686+b*.168; a[i+2]=r*.272+g*.534+b*.131;}}else {for(i=0, n=a.length; i<n; i+=4) {r=a[i]; g=a[i+1]; b=a[i+2]; a[i]=Math.min(255,Math.max(0,r*.393+g*.769+b*.189)); a[i+1]=Math.min(255,Math.max(0,r*.349+g*.686+b*.168)); a[i+2]=Math.min(255,Math.max(0,r*.272+g*.534+b*.131));}}}
						else if(f=="mixrgb") {k=(typeof c[0]==='object')?c[0]:[0,0,0]; l=(typeof c[1]==='object')?c[1]:[0,0,0]; for(i=0, n=a.length; i<n; i+=4) {r=a[i]; g=a[i+1]; b=a[i+2]; a[i]=Math.min(255,Math.max(0,(k[0]*(l[2]*g+(255-l[2])*b)/255+(255-k[0])*r)/255)); a[i+1]=Math.min(255,Math.max(0,(k[1]*(l[0]*b+(255-l[0])*r)/255+(255-k[1])*g)/255)); a[i+2]=Math.min(255,Math.max(0,(k[2]*(l[1]*r+(255-l[1])*g)/255+(255-k[2])*b)/255));}}
						else if(f=="posterize") {v=(c>0?Math.min(16,Math.max(1,c)):1); t=new Array(); for(i=0; i<256; i++) {t[i]=255*(v*i/256)/(v-1);} if(proper) {for(i=0, n=a.length; i<n; i+=4) {r=a[i]; g=a[i+1]; b=a[i+2]; a[i]=t[r]; a[i+1]=t[g]; a[i+2]=t[b];}}else {for(i=0, n=a.length; i<n; i+=4) {r=a[i]; g=a[i+1]; b=a[i+2]; a[i]=Math.min(255,Math.max(0,t[r])); a[i+1]=Math.min(255,Math.max(0,t[g])); a[i+2]=Math.min(255,Math.max(0,t[b]));}}}
						else if(f=="adjustrgba") {r=(c[0]>=0?c[0]:1); g=(c[1]>=0?c[1]:1); b=(c[2]>=0?c[2]:1); v=(c[3]>=0?c[3]:1); if(proper) {for(i=0, n=a.length; i<n; i+=4) {a[i]=a[i]*r; a[i+1]=a[i+1]*g; a[i+2]=a[i+2]*b; a[i+3]=a[i+3]*v;}}else {for(i=0, n=a.length; i<n; i+=4) {a[i]=Math.min(255,Math.max(0,a[i]*r)); a[i+1]=Math.min(255,Math.max(0,a[i+1]*g)); a[i+2]=Math.min(255,Math.max(0,a[i+2]*b)); a[i+3]=Math.min(255,Math.max(0,a[i+3]*v));}}}
						else if(f=="contrast") {v=(c>=0?c:1);if(proper) {for(i=0, n=a.length; i<n; i+=4) {a[i]=((((a[i]/255)-0.5)*v)+0.5)*255; a[i+1]=((((a[i+1]/255)-0.5)*v)+0.5)*255; a[i+2]=((((a[i+2]/255)-0.5)*v)+0.5)*255;}}else {for(i=0, n=a.length; i<n; i+=4) {a[i]=Math.min(255,Math.max(0,((((a[i]/255)-0.5)*v)+0.5)*255)); a[i+1]=Math.min(255,Math.max(0,((((a[i+1]/255)-0.5)*v)+0.5)*255)); a[i+2]=Math.min(255,Math.max(0,((((a[i+2]/255)-0.5)*v)+0.5)*255));}}}
						else if(f=="adjusthsba") {k=(c[0]>=0?c[0]:1); t=(c[1]>=0?c[1]:1); m=(c[2]>=0?c[2]:1); v=(c[3]>=0?c[3]:1); for(i=0, n=a.length; i<n; i+=4) {hsb=rgb2hsb(a[i],a[i+1],a[i+2]); hsb[0]*=k; if(hsb[0]<0) {hsb[0]=0;}else if(hsb[0]>360) {hsb[0]=360;} hsb[1]*=t; if(hsb[1]<0) {hsb[1]=0;}else if(hsb[1]>100) {hsb[1]=100;} hsb[2]*=m; if(hsb[2]<0) {hsb[2]=0;}else if(hsb[2]>100) {hsb[2]=100;} rgb=hsb2rgb(hsb[0],hsb[1],hsb[2]); a[i]=rgb[0]; a[i+1]=rgb[1]; a[i+2]=rgb[2]; a[i+3]=Math.min(255,Math.max(0,a[i+3]*v));}}
						else if(f=="tritone") {k=(typeof c[0]==='object')?c[0]:[255,0,0]; l=(typeof c[1]==='object')?c[1]:[0,255,0]; m=(typeof c[2]==='object')?c[2]:[0,0,255]; t=new Array(); for(i=0; i<128; i++) {q=i/127; t[i]=[k[0]+q*(l[0]-k[0]),k[1]+q*(l[1]-k[1]),k[2]+q*(l[2]-k[2])];} for(i=128; i<256; i++) {q=(i-127)/128; t[i]=[l[0]+q*(m[0]-l[0]),l[1]+q*(m[1]-l[1]),l[2]+q*(m[2]-l[2])];} for(i=0, n=a.length; i<n; i+=4) {v=Math.min(255,Math.max(0,Math.round(a[i]*0.299+a[i+1]*0.587+a[i+2]*0.114))); a[i]=t[v][0]; a[i+1]=t[v][1]; a[i+2]=t[v][2];}}
						ctx.putImageData(s,x,y); 
					}
				}
			}
		} return false; 
	}
}
