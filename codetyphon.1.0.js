/*
author :codetyphon
email   :g@codetyphon
https://github.com/codetyphon/codetyphon
2014-04-30 beijing
*/
function $(id){
	if(id){
		return new CodeTyphon(id);
	}
}
function CodeTyphon(id){
	this.id=id;
	this.obj=document.getElementById(id);
	return this;
}
CodeTyphon.prototype.val=function(v){
	//2014-05-08
	if(v==undefined){
		return this.obj.value;
	}
	else{	
		this.obj.value=v;
		return this;
	}
}
CodeTyphon.prototype.text=function(text){
	if(text==undefined){
		return this.obj.innerHTML;
	}else{
		this.obj.innerHTML=text;
		return this;
	}
}
CodeTyphon.prototype.append=function(text){//2014-05-05
	if(text==undefined){
		return this.obj.innerHTML;
	}else{
		this.obj.innerHTML+=text;
		return this;
	}
}
CodeTyphon.prototype.href=function(link){//2014-05-11
	if(link==undefined){
		return this.obj.href;
	}else{
		this.obj.href=link;
		return this;
	}
}
CodeTyphon.prototype.src=function(link){//2014-05-11
	if(link==undefined){
		return this.obj.src;
	}else{
		this.obj.src=link;
		return this;
	}
}
CodeTyphon.prototype.style=function(styleName,styleValue){
	if(!styleValue){
		
		return this.obj.style.styleName;
	}else{
		eval("this.obj.style."+styleName+"='"+styleValue+"'");
		return this;
	}
}
CodeTyphon.prototype.show=function(){
	this.obj.style.display='block';
	return this;
}
CodeTyphon.prototype.hide=function(){
	this.obj.style.display='none';
	return this;
}
CodeTyphon.prototype.click=function(fun){
	this.bind('click',fun);
	return this;
}
CodeTyphon.prototype.keydown=function(fun){
	this.bind('keydown',fun);
	return this;
}
CodeTyphon.prototype.bind=function(evname,fun){//2014-05-02
	if(!fun){
	}else{
		if(evname=="dragstart"){//16:10
			this.obj.draggable=true;
		}
		this.obj.addEventListener(evname,fun);
		return this;
	}
}
CodeTyphon.prototype.focus=function(){
	this.obj.focus();
	return this;
}
/* plus .. */
$.cort_array=function(array){
	array=array.sort(function(){
		return 0.5 > Math.random();
	});
	return array;
}
$.html_encode=function(str){
	 var s = "";   
	  if (str.length == 0) return "";   
	  s = str.replace(/&/g, "&gt;");   
	  s = s.replace(/</g, "&lt;");   
	  s = s.replace(/>/g, "&gt;");   
	  s = s.replace(/ /g, "&nbsp;");   
	  s = s.replace(/\'/g, "&#39;");   
	  s = s.replace(/\"/g, "&quot;");   
	  s = s.replace(/\n/g, "<br>");   
	  return s;   
}
$.html_decode=function(str){
	 var s = "";   
	  if (str.length == 0) return "";   
	  s = str.replace(/&gt;/g, "&");   
	  s = s.replace(/&lt;/g, "<");   
	  s = s.replace(/&gt;/g, ">");   
	  s = s.replace(/&nbsp;/g, " ");   
	  s = s.replace(/&#39;/g, "\'");   
	  s = s.replace(/&quot;/g, "\"");   
	  s = s.replace(/<br>/g, "\n");   
	  return s;   
}
//2014-05-12
$.saveObj = function(key, obj) {
	localStorage.setItem(key, JSON.stringify(obj));
}
$.openObj = function(key) {
    return JSON.parse(localStorage.getItem(key));
}
$.delObj = function(key) {
    localStorage.removeItem(key);
}
$.clearObj = function() {
    localStorage.clear();
}
$.checkTel=function(str){
	var regPartton=/1[3-8]+\d{9}/;
	if(!str || str==null){
		return "手机号码不能为空！";
	}else if(!regPartton.test(str)){
		return "手机号码格式不正确！";
	}else{
		return true;
	}
}
$.isMob=function(fun){
	if(navigator.userAgent.indexOf('Mobile')!=-1){
		fun();
	}
}
$.isMobElse=function(mofun,pcfun){
	if(navigator.userAgent.indexOf('Mobile')!=-1){
		mofun();
	}else{
		pcfun();
	}
}
//2014-05-18
$.json=function(url,callback){
	var s=document.createElement("script");
	s.src=url+callback;
	document.getElementsByTagName("body").item(0).appendChild(s);
}
/*
$.json("http://haskellchina.jd-app.com/tops/3/",function(x){
	listop(x);
});
*/
//2014-05-19
$.setResizeBackGround=function(src){
	var img=document.createElement('img');
	img.id="resizebackgroundimg";
	img.style.position='fixed';
	document.getElementsByTagName("body").item(0).appendChild(s);
	window.onresize=function(){
		var bw=document.documentElement.clientWidth;
		var bh=document.documentElement.clientHeight;
		document.getElementById("resizebackgroundimg").style.left='0px';
		document.getElementById("resizebackgroundimg").style.top='0px';
		document.getElementById("resizebackgroundimg").width=parseInt(bw);
		document.getElementById("resizebackgroundimg").height=parseInt(bh);
	}
}
//2014-05-21
$.randomStr=function(len){
	var rdmString = "";
	for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
	return rdmString.substr(0, len);
}
$.float2int=function(float){
	return (float)|0;
	//return ~~ (float);
}
$.ab2ba=function(a,b){
	a=[b,b=a][0];
	return [a,b];
}
$.query=function (name){
     var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
     if(result == null || result.length < 1){
         return "";
     }
     return result[1];
     /*
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if (r!=null) return unescape(r[2]); return null;
     */
}
