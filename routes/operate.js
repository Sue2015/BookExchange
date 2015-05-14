var ejs = require("ejs");

var query=require('./dbConnection/sqlQuery');

var node=[],edge=[],user_node=[],book_edge=[],edge_length=-1,node_length=-1;

exports.signin=function(req,res){
	
	
	var sqlStr="select * from user where email=? and password=?";
	console.log("Query is:"+sqlStr);
	
	var params = [req.param('email'), req.param('password')];
	console.log(req.param('email')+req.param('password'));
	query.execQuery(sqlStr, params, function(err, rows) {
		
		console.log(rows.length);
		if(rows.length !== 0) {
			//var firstname;
			//var lastname;
			
			console.log("rows: "+rows[0].first_name);
			req.session.user_id =rows[0].id;
			//req.session.username =rows[0].username;
			res.json({"login":'Success'})
			
			
		}else{
			//res.send({'errorMessage': "Please enter a valid email and password"});
			console.log("no such user");
			//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
		}
	});
}

exports.signup=function(req,res){
	var sqlStr="select count(*) as user_number from user"; 
	var params=[];
	
	query.execQuery(sqlStr, params, function(err, rows) {
		
		console.log(rows.length);
		
		if(rows.length !== 0) {
			
			console.log("rows: "+rows[0].user_number);	
			var next_userid=rows[0].user_number+1;
			var account=req.param("account");
			console.log(account.email);
			var sqlStr="insert into user (`id`,`first_name`, `last_name`, `email`,`phone`,`address`,`password`) values(?,?,?,?,?,?,?)"; 
			var params=[next_userid,account.firstname,account.lastname,account.email,account.phone,account.address,account.password];
			query.execQuery(sqlStr, params, function(err, rows) {			
				if(err){
					//res.send({'errorMessage': "Please enter a valid email and password"});
					console.log("ERROR: " + err.message);
					console.log("create an user failed");
					//res.render({errorMessage: 'Sign Up Fail!'});
					
				}else{
					res.json({"signup":'Success'})
					console.log("create an user with id: "+rows.insertId);				
				}			
			});
				
		}else{
			//res.send({'errorMessage': "Please enter a valid email and password"});
			console.log("no user search results");
			//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
		}
	});
}

exports.logout = function(req, res){
	if(req.session.user_id)
		req.session.destroy();
	res.json({"logout":"yes"});
}

exports.loadProfile=function(req,res){
	var sqlStr="select * from user where id=?";
	console.log("Query is:"+sqlStr);
	
	var params = [req.session.user_id];

	query.execQuery(sqlStr, params, function(err, rows) {
		
		console.log(rows.length);
		if(rows.length !== 0) {
	
			res.json({"user":rows[0]})
			
			
		}else{
			//res.send({'errorMessage': "Please enter a valid email and password"});
			console.log("no such user");
			//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
		}
	});

}

exports.getOwnOrWantBooks=function(req,res){
	
	if(req.param("type")==='Own Books')
		var sqlStr="select * from book,own_book where book.id=own_book.book_id and user_id=?";
	else
		var sqlStr="select * from book,want_book where book.id=want_book.book_id and user_id=?";

	console.log("Query is:"+sqlStr);
	
	var params = [req.session.user_id];

	query.execQuery(sqlStr, params, function(err, rows) {
		
		console.log(rows.length);
		if(rows.length !== 0) {
	
			res.json({"books":rows})
			
			
		}else{
			//res.send({'errorMessage': "Please enter a valid email and password"});
			console.log("no books");
			//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
		}
	});

}


exports.getDbBooks=function(req,res){
	var sqlStr="select * from book";
	console.log("Query is:"+sqlStr);
	
	var params = [];

	query.execQuery(sqlStr, params, function(err, rows) {
		
		console.log(rows.length);
		if(rows.length !== 0) {
	
			res.json({"books":rows})
			
			
		}else{
			//res.send({'errorMessage': "Please enter a valid email and password"});
			console.log("no books");
			//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
		}
	});
}

exports.createOwnOrWantBook=function(req,res){
	var book=req.param("book");
	var sqlStr="select * from book where name=? and version=? and author=?";
	console.log("Query is:"+sqlStr);
	
	var params = [book.name,book.version,book.author];

	query.execQuery(sqlStr, params, function(err, rows) {
		
		console.log(rows.length);
		if(rows.length !== 0) {
	
			var book_id=rows[0].id;
			
			if(req.param("type")==='Own Books')
				var sqlStr="insert into own_book (`user_id`, `book_id`) values(?,?)";
			else
				var sqlStr="insert into want_book (`user_id`, `book_id`) values(?,?)";

			console.log("Query is:"+sqlStr);
			
			var params = [req.session.user_id,book_id];

			query.execQuery(sqlStr, params, function(err, rows) {
				
				if(err){
					//res.send({'errorMessage': "Please enter a valid email and password"});
					console.log("ERROR: " + err.message);
					//res.render({errorMessage: 'Sign Up Fail!'});
					
				}else{
					res.json({'create':'success'});
					console.log("insert into "+req.param("type")+": "+rows.insertId);
					
				}
			
			});
			
			
			
			
		}else{
			var sqlStr="insert into book (`name`, `version`, `author`) values(?,?,?)";
			console.log("Query is:"+sqlStr);
			
			var params = [book.name,book.version,book.author];

			query.execQuery(sqlStr, params, function(err, rows) {
				
				if(err){
					//res.send({'errorMessage': "Please enter a valid email and password"});
					console.log("ERROR: " + err.message);
					//res.render({errorMessage: 'Sign Up Fail!'});
					
				}else{
					console.log(rows.insertId);
					var book_id=rows.insertId;
					
					
					if(req.param("type")==='Own Books')
						var sqlStr="insert into own_book (`user_id`, `book_id`) values(?,?)";
					else
						var sqlStr="insert into want_book (`user_id`, `book_id`) values(?,?)";

					console.log("Query is:"+sqlStr);
					
					var params = [req.session.user_id,book_id];

					query.execQuery(sqlStr, params, function(err, rows) {
						
						if(err){
							//res.send({'errorMessage': "Please enter a valid email and password"});
							console.log("ERROR: " + err.message);
							//res.render({errorMessage: 'Sign Up Fail!'});
							
						}else{
							res.json({'create':'success'});

							console.log("insert into "+req.param("type")+": "+rows.insertId);
							
						}
					
					});
				}
			
			});
			
			
		}
	});

	
}


exports.editOwnOrWantBook=function(req,res){
	var book=req.param("book");
	var sqlStr="select * from book where name=? and version=? and author=?";
	console.log("Query is:"+sqlStr);
	
	var params = [book.name,book.version,book.author];

	query.execQuery(sqlStr, params, function(err, rows) {
		
		console.log(rows.length);
		if(rows.length !== 0) {
	
			var book_id=rows[0].id;
			
			
			
			if(req.param("type")==='Own Books'){
				var sqlStr="insert into own_book (`user_id`, `book_id`) values(?,?)";
				var del_sqlStr="delete from own_book where id=?";
			}
			else{
				var sqlStr="insert into want_book (`user_id`, `book_id`) values(?,?)";
				var del_sqlStr="delete from want_book where id=?";
			}

			console.log("Query is:"+sqlStr);
			
			var params = [req.session.user_id,book_id];

			query.execQuery(sqlStr, params, function(err, rows) {
				
				if(err){
					//res.send({'errorMessage': "Please enter a valid email and password"});
					console.log("ERROR: " + err.message);
					//res.render({errorMessage: 'Sign Up Fail!'});
					
				}else{
					console.log("edit by insert a available book and delete a book, insert own/want id "+rows.insertId);
					var params = [book.id];
					/*delete*/
					query.execQuery(del_sqlStr, params, function(err, rows) {
						
						if(err){
							//res.send({'errorMessage': "Please enter a valid email and password"});
							console.log("ERROR: " + err.message);
							//res.render({errorMessage: 'Sign Up Fail!'});
							
						}else{
							res.json({'edit':'success'});
							console.log("edit by insert a available book and delete a book "+book.id);
							
						}
					
					});
					
				}
			
			});
					
		}else{
			var sqlStr="insert into book (`name`, `version`, `author`) values(?,?,?)";
			console.log("Query is:"+sqlStr);
			
			var params = [book.name,book.version,book.author];

			query.execQuery(sqlStr, params, function(err, rows) {
				
				if(err){
					//res.send({'errorMessage': "Please enter a valid email and password"});
					console.log("ERROR: " + err.message);
					//res.render({errorMessage: 'Sign Up Fail!'});
					
				}else{
					console.log(rows.insertId);
					var book_id=rows.insertId;
					
					
					if(req.param("type")==='Own Books'){
						var sqlStr="insert into own_book (`user_id`, `book_id`) values(?,?)";
						var del_sqlStr="delete from own_book where id=?";
					}
					else{
						var sqlStr="insert into want_book (`user_id`, `book_id`) values(?,?)";
						var del_sqlStr="delete from want_book where id=?";
					}

					console.log("Query is:"+sqlStr);
					
					var params = [req.session.user_id,book_id];

					query.execQuery(sqlStr, params, function(err, rows) {
						
						if(err){
							//res.send({'errorMessage': "Please enter a valid email and password"});
							console.log("ERROR: " + err.message);
							//res.render({errorMessage: 'Sign Up Fail!'});
							
						}else{
							console.log("edit by insert a new book and delete a book, insert id "+rows.insertId);
							var params = [book.id];

							query.execQuery(del_sqlStr, params, function(err, rows) {
								
								if(err){
									//res.send({'errorMessage': "Please enter a valid email and password"});
									console.log("ERROR: " + err.message);
									//res.render({errorMessage: 'Sign Up Fail!'});
									
								}else{
									res.json({'edit':'success'});
									console.log("edit by insert a available book and delete a book "+book.id);
									
								}
							
							});
						}
					
					});
				}
			
			});
			
			
		}
	});

	
}

exports.deleteOwnOrWantBook=function(req,res){
	
	var book=req.param("book");
	
	if(req.param("type")==='Own Books')
		var sqlStr="delete from own_book where id=?";
	else
		var sqlStr="delete from want_book where id=?";

	console.log("Query is:"+sqlStr);
	
	var params = [book.id];

	query.execQuery(sqlStr, params, function(err, rows) {
		
		if(err){
			//res.send({'errorMessage': "Please enster a valid email and password"});
			res.send({'delet':'failed'});
			console.log("ERROR: " + err.message);
	//、	res.send({"editEducation":'Fail'});
		}else{
			
			res.send({'delet':'success'});
		}
		
	});
}

exports.match = function(req, res){
	var user_id=req.session.user_id;
	var want_book_id=req.param('want_book_id');
	var own_book_id=req.param('own_book_id')
	console.log("want_book_id"+want_book_id);
	console.log("own_book_id"+own_book_id);

	if (typeof own_book_id==='undefined')
		var exeStr='java -jar CycleDetect.jar '+user_id+' '+want_book_id;
	else
		var exeStr='java -jar CycleDetectSpecify.jar '+user_id+' '+want_book_id+' '+own_book_id;
	var exec = require('child_process').exec, child;
	child = exec(exeStr, function (error, stdout, stderr){
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if(error !== null){
	      console.log('exec error: ' + error);
	    }
	    console.log(typeof stdout);
	    if(stdout.indexOf('No Path') > -1)
	    	res.json({'result':'no'});
	    else{
	    	node=[];edge=[];
	    	var seperate=stdout.split('->');
	    	for (i=0;i<seperate.length;i++)
	    		console.log(seperate[i]);
	    	for (i=0;i<seperate.length;i++){
	    		//node[i]=seperate[i].slice(-1);
	    		var arr=seperate[i].split(',');
	    		node[i]=arr.slice(-1);
	    		edge[i]=arr.slice(0,arr.length-1);
	    	}
	    	edge=edge.slice(1,edge.length);
	    	console.log("node");
	    	
	    	for (i=0;i<node.length;i++)
	    		console.log(node[i]);
	    	console.log("edge");
	    	for (i=0;i<edge.length;i++)
	    		console.log(edge[i]);
	    	
	    	user_node=[];
	    	book_edge=[];
	    	edge_length=edge.length;
	    	node_length=node.length;
	    	//edge.shift();
	    	
	    	/*node.forEach(function(item) {
	    		  async(item, 'user',function(result){
	    			 user_node.push(result);
	    		    if(user_node.length == node.length) {
	    		    	for(i=0;i<user_node.length;i++)
	    		    	    console.log(JSON.stringify(user_node[i]));
	    		    	
	    		    	if(book_edge.length===edge.length)
	    				{
	    		    		console.log("now return from user_node");
	    		    		res.json({'user_node':user_node,'book_edge':book_edge});
	    		    	}
	    		
	    		    }
	    		  })
	    		});
	    	
	    	edge.forEach(function(item) {
	    		  async(item, 'book',function(result){
	    			 book_edge.push(result);
	    		    if(book_edge.length == edge.length) {
	    		    	for(i=0;i<book_edge.length;i++)
	    		    	    console.log(JSON.stringify(book_edge[i]));
	    		    	if(user_node.length===node.length)
	    				{
	    		    		console.log("now return from book_edge");
	    		    		res.json({'user_node':user_node,'book_edge':book_edge});
	    				}
	    		
	    		    }
	    		  })
	    		});*/
	    	
	    	series(node.shift(),'user',res);
	    	
	    	series(edge.shift(),'book',res);
	    	
			//res.json({'user_node':user_node,'book_edge':book_edge});

	    }
	    
	    
	});
};


function async(arg,type,callback) {
	if(type==='user'){
		console.log('do something with user\''+arg+'\', return 1 sec later');
		var sqlStr="select * from user where id=?";
		var params = [arg];
	}
	else{
		console.log('do something with book\''+arg+'\', return 1 sec later');
		var sqlStr="select * from book where id in ("+arg+")";
		var params = [];
	}
	console.log("Query is:"+sqlStr);
			
	query.execQuery(sqlStr, params, function(err, rows) {
			
			console.log(rows.length);
			if(rows.length !== 0) {
		
				setTimeout(function() { callback(rows); }, 50);
				
			}else{
				//res.send({'errorMessage': "Please enter a valid email and password"});
				console.log("no record");
				//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
			}
	});	  
}

function series(item,type,res) {
	if(type==='user'){
	  if(item) {
	    async( item, type, function(result) {
	      user_node.push(result);
	      return series(node.shift(),type,res);
	    });
	  } else {
		for(i=0;i<user_node.length;i++)
	    console.log(JSON.stringify(user_node[i]));
		console.log("book_edge length: "+book_edge.length);
		console.log("edge_length -1: "+(edge_length));
		if(book_edge.length===edge_length)
			{
			console.log("now return from user_node");
			res.json({'user_node':user_node,'book_edge':book_edge});}
	  }
	}else{
		if(item) {
			async( item, type, function(result) {
			   book_edge.push(result);
			   return series(edge.shift(),type,res);
			 });
		} else {
			for(i=0;i<book_edge.length;i++)
			console.log(JSON.stringify(book_edge[i]));
			console.log("user_node legnth: "+user_node.length);
			console.log("node length: "+node_length);
			if(user_node.length===node_length)
				{
				console.log("now return from book_edge");
				res.json({'user_node':user_node,'book_edge':book_edge});
				}
		
		}
		
	}
}
		
	