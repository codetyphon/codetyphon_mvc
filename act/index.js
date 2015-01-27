db_query("names",{tel:'54321'},function(d){
	//
	data=data.setValue({
		'{title}':d[0].name,
		'{time}':'2015-01-25',
		'{site}':'codetyphon'
	});
	
	console.log("d:"+d[0].name);
	render();
	//
},function(err){
	data=err;
	render();
});
