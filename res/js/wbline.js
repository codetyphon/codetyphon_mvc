var wbline={
	x:0,
	y:0,
	timeoutid:0,
	points:new Array(),
	pointIndex:0,
	runs:new Array(),
	fps:5,
	init:function(id,w,h){
		var canvas_box=document.querySelector("#"+id);
    	var canvas=document.createElement("canvas");
    	
    	if(w==undefined && h==undefined){
    		h=document.body.clientHeight;
    	}

    	if(w==undefined){
    		w=document.body.clientWidth;
    	}

    	if(h==undefined){
    		h=w;
    	}


	    c_w=w;
	    c_h=h;
	    canvas.width=c_w;
	    canvas.height=c_h;
	    canvas.top = 0;
	    canvas.left = 0;
	    c = canvas.getContext('2d');
	    canvas_box.innerHTML="";
	    canvas_box.appendChild(canvas);
	    c.clearRect(0, 0,c_w,c_h);
	    return wbline;
	},
	addRun:function(x,y,r,g,b){
		wbline.next=false;

        function xx(x,y){

        	c.lineWidth=2;
			c.strokeStyle ='rgba('+r+','+g+','+b+',1)';
			c.beginPath();
			//wb2d.rgb(r,g,b);
			
			c.moveTo(wbline.x,wbline.y);

			if(x>wbline.x){
				wbline.x++;
			}
			if(x<wbline.x){
				wbline.x--;
			}

			if(y>wbline.y){
				wbline.y++;
			}
			if(y<wbline.y){
				wbline.y--;
			}

			c.lineTo(wbline.x,wbline.y);
	        //c.strokeStyle=o.color;
	        c.stroke();
	        if(x==wbline.x && y==wbline.y){
	        	wbline.pointIndex++;
	        	wbline.next=true;
	        	wbline.run();
	        }else{
	        	setTimeout(function(){
		        	xx(x,y)
		        },wbline.fps);
	        }
        }
        xx(x,y);
        
	},
	run:function(){
		
		var points=wbline.points;
		var points_len=points.length;
		var i=wbline.pointIndex;
		var point=points[i];

		if(i<points_len-1){
			wbline.addRun(points[i][0],points[i][1],points[i][2],points[i][3],points[i][4]);
		}else{
			console.log('end')
			wbline.runEnd();
		}
		setInterval(function(){
			
		});
		
	},
	runEnd:function(){

	},
	setRunEnd:function(x){
		wbline.runEnd=x;
		return wbline;
	},
	setFps:function(f){
		wbline.fps=f;
		return wbline;
	}
}