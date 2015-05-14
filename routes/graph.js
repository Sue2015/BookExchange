
//var ejs = require("ejs");
var query=require('./dbConnection/sqlQuery');
var length=0, m = [];

  	var shortestpath=function(adj, path) {

    	var n = adj.length;
    	var ans=[];
    	//new int[n][n];
    	for (x = 0; x < n; x++) {
    		  ans[x] = new Array(n);
    		 
    	}
    
    	// Implement algorithm on a copy matrix so that the adjacency isn't
    	// destroyed.
    	copy(ans, adj);

    	// Compute successively better paths through vertex k.
    	for (var k=0; k<n;k++) {
      		// Do so between each possible pair of points.
      		for (var i=0; i<n; i++) {
        		for (var j=0; j<n;j++) {
          			if (ans[i][k]+ans[k][j] < ans[i][j]) {
          				ans[i][j] = ans[i][k]+ans[k][j];
          				path[i][j] = path[k][j];
          			}
          		}
      		}
    	}
    
    	// Return the shortest path matrix.
    	return ans;
  	};

  	// Copies the contents of array b into array a. Assumes that both a and
  	// b are 2D arrays of identical dimensions.
  	var copy=function(a, b) {

    	for (var i=0;i<a.length;i++)
      		for (var j=0;j<a[0].length;j++)
        		a[i][j] = b[i][j];
  	}

  	// Returns the smaller of a and b.
  	var min=function(a,b) {
    	if (a < b) 
      		return a;
    	else       
      		return b;
  	};

exports.getPath=function(req,res){
	
	var sqlStr="select count(*) as number from user";
	console.log("Query is:"+sqlStr);
	
	var params = [];
	//console.log(req.param('email')+req.param('password'));
	query.execQuery(sqlStr, params, function(err, rows) {
		
		console.log(rows.length);
		if(rows.length !== 0) {
			length=rows[0].number;
			console.log("rows: "+rows[0].number);
			
			for (x = 0; x < length; x++) {
				  m[x] = new Array(length);	
				  m[x][x]=0;
			}
			for (i=1;i<=length; i++) {
				console.log("userid: "+i);
				var sqlStr="select book_id from want_book where user_id=?";
				console.log("Query is:"+sqlStr);
			
				var params = [i];
			//console.log(req.param('email')+req.param('password'));
				query.execQuery(sqlStr, params, function(err, rows) {
					if(rows.length !== 0) {
						for(j=0;j<rows.length;j++){
							    console.log("book_id: "+rows[j].book_id);
						
								var sqlStr="select distinct(user_id) from own_book where book_id=?";
								console.log("Query is:"+sqlStr);
							
								var params = [rows[j].book_id];
								query.execQuery(sqlStr, params, function(err, rows) {
									if(rows.length !== 0) {
										for(z=0;z<rows.length;z++){
											console.log(rows[z].user_id);
											console.log(i-1);
											console.log(Number(rows[z].user_id)-1);
											m[i-1][Number(rows[z].user_id)-1]=1;
										}
										for(z=0;z<length;z++){
											if(m[i-1][z]!=1)
												m[i-1][z]=10000;
											console.log(m[i-1][z]);
											
										}
										
										
										
									}
								});
							
							
						}
						
					}
					
				});
				
			}
			
			
			
		}else{
			//res.send({'errorMessage': "Please enter a valid email and password"});
			console.log("no such user");
			//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
		}
	});
}
	
/*	var m = [];
	for (x = 0; x < 5; x++) {
		  m[x] = new Array(5);
		 
	}
	m[0][0] = 0; m[0][1] = 1; m[0][2] = 10000; m[0][3] = 10000; m[0][4] = 10000;
	m[1][0] = 10000; m[1][1] = 0; m[1][2] = 1; m[1][3] = 1; m[1][4]=10000;
	m[2][0] = 1; m[2][1] = 10000; m[2][2] = 0; m[2][3] = 10000; m[2][4] = 10000;
	m[3][0] = 10000; m[3][1] = 10000; m[3][2] = 10000; m[3][3] = 0; m[3][4] = 1;
	m[4][0] = 10000; m[4][1] = 1; m[4][2] = 1; m[4][3] = 10000;m[4][4] =0;

	var shortpath=[];
	for (x = 0; x < 5; x++) {
		shortpath [x]=new Array(5);
		 
	}
	
	var path = [];
	for (x = 0; x < 5; x++) {
		path [x]=new Array(5);
		 
	}
	

	// Initialize with the previous vertex for each edge. -1 indicates
	// no such vertex.
	for (var i=0; i<5; i++)
		for (var j=0; j<5; j++)
			if (m[i][j] == 10000)
				path[i][j] = -1;
			else
				path[i][j] = i;
		
	// This means that we don't have to go anywhere to go from i to i.
	for (var i=0; i<5; i++)
		path[i][i] = i;
	
	shortpath = shortestpath(m, path);

	// Prints out shortest distances.
	console.log("shortest distance");
	for (var i=0; i<5;i++) {
  		for (var j=0; j<5;j++)
  			console.log(shortpath[i][j]+" ");
  		console.log('\n');
	}
	
	console.log("path matrix");
	for (var i=0; i<5;i++) {
  		for (var j=0; j<5;j++)
  			console.log(path[i][j]+" ");
  		console.log('\n');
	}

	console.log("From where to where do you want to find the loop?(0 to 4)");
	console.log(req.param("book_want"));
	console.log(req.param("book_own"));

	var start = Number(req.param("book_want"));
	var end = Number(req.param("book_own"));
	
	if(shortpath[start][end]+shortpath[end][start]>=10000){
		console.log("No Path");
	}
	else
	{
		console.log("shortest loop found: "+(shortpath[start][end]+shortpath[end][start]));
	// The path will always end at end.
	var temp_start= start;
	var temp_end = end;
	
	
	var myPath_forward = end + "";

	// Loop through each previous vertex until you get back to start.
	while (path[temp_start][temp_end] != start) {
		myPath_forward = path[temp_start][temp_end] + " -> " + myPath_forward;
		temp_end = path[temp_start][temp_end];
	}
	  	
	// Just add start to our string and print.
	myPath_forward = start + " -> " + myPath_forward;
	
	
	temp_start = end;
	temp_end = start;
   var myPath_backward  = start + "";

	while (path[temp_start][temp_end] != end) {
		myPath_backward = path[temp_start][temp_end] + " -> " + myPath_backward;
		temp_end = path[temp_start][temp_end];
	}
	
	var myPath = myPath_forward +" -> "+ myPath_backward;
	
	console.log("Here's the path "+myPath);
	}

}
 
	//	Scanner stdin = new Scanner(System.in);
    	// Tests out algorithm with graph shown in class.
		/*
    	int[][] m = new int[5][5];
    	m[0][0] = 0; m[0][1] = 3; m[0][2] = 8; m[0][3] = 10000; m[0][4] = -4;
    	m[1][0] = 10000; m[1][1] = 0; m[1][2] = 10000; m[1][3] = 1;
    	m[1][4]=7;
    	m[2][0] = 10000; m[2][1] = 4; m[2][2] = 0; m[2][3] = 10000; 
    	m[2][4] = 10000;
    	m[3][0] = 2; m[3][1] = 10000; m[3][2] = -5; m[3][3] = 0; 
    	m[3][4] = 10000;
    	m[4][0] = 10000; m[4][1] = 10000; m[4][2] = 10000; m[4][3] = 6;
    	m[4][4] =0; */
		
    	

