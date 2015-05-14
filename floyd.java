import java.sql.*;
import java.util.*;

public class floyd {

  	public static int[][] shortestpath(int[][] adj, int[][] path) {

    	int n = adj.length;
    	int[][] ans = new int[n][n];
    
    	// Implement algorithm on a copy matrix so that the adjacency isn't
    	// destroyed.
    	copy(ans, adj);

    	// Compute successively better paths through vertex k.
    	for (int k=0; k<n;k++) {
      		// Do so between each possible pair of points.
      		for (int i=0; i<n; i++) {
        		for (int j=0; j<n;j++) {
          			if (ans[i][k]+ans[k][j] < ans[i][j]) {
          				ans[i][j] = ans[i][k]+ans[k][j];
          				path[i][j] = path[k][j];
          			}
          		}
      		}
    	}
    
    	// Return the shortest path matrix.
    	return ans;
  	}

  	// Copies the contents of array b into array a. Assumes that both a and
  	// b are 2D arrays of identical dimensions.
  	public static void copy(int[][] a, int[][] b) {

    	for (int i=0;i<a.length;i++)
      		for (int j=0;j<a[0].length;j++)
        		a[i][j] = b[i][j];
  	}

  	// Returns the smaller of a and b.
  	public static int min(int a, int b) {
    	if (a < b) 
      		return a;
    	else       
      		return b;
  	}

  	public static void main(String[] args) throws Exception {
  		long startTime = System.nanoTime();
  		Connection conn = null;
  	    Statement stmt = null;
  	    ResultSet rs = null;	
		try { 
			  int size = 0;
		      Class.forName("com.mysql.jdbc.Driver");
		      String url = "jdbc:mysql://us-cdbr-iron-east-02.cleardb.net:3306/ad_7a5f7dbbaac9577";
		      conn = DriverManager.getConnection(url,"b6fdb34b13fc79", "81573ca7");

		      stmt = conn.createStatement();
		      
		      rs = stmt.executeQuery("select count(*) from user");
		      if( rs.next()){
		    	  size = rs.getInt(1);	
		      }
		      int[][] m = new int[size][size];
		      for (int i=0; i<m.length;i++) {
		      	  for (int j=0; j<m.length;j++)
		      		  m[i][j]=10000;
		    	}
		      for(int i=0; i<size; i++){
		    	  m[i][i]=0;
		      }
		      
		      for(int i=1; i<=size; i++){
		    	  stmt = conn.createStatement();
		    	  rs = stmt.executeQuery("select book_id from want_book where user_id= '"+i+"'");
		    	  while(rs.next()){
		    		  int temp_book_id = rs.getInt(1);
		    		  stmt = conn.createStatement();
		    		  ResultSet temp_rs = stmt.executeQuery("select user_id from own_book where book_id = '"+temp_book_id+"'");
		    		  while(temp_rs.next()){
		    			  m[i-1][temp_rs.getInt(1)-1]=1;
		    		  }
		    	  }
		      }
		      
		      /**
		      System.out.println ("input matrix:");
		      for (int i=0; i<m.length;i++) {
		      	  for (int j=0; j<m.length;j++)
		        	System.out.print(m[i][j]+" ");
		      		System.out.println();
		    	}
		    	**/
		      
		      int[][] shortpath;
		      int[][] path = new int[size][size];
		      // Initialize with the previous vertex for each edge. -1 indicates
		      // no such vertex.
		      for (int i=0; i<path.length; i++){
		    		for (int j=0; j<path.length; j++){
		    			if (m[i][j] == 10000)
		    			    path[i][j] = -1;
		    			else
		    			    path[i][j] = i;
		    		}
		      }
		    		
		    	// This means that we don't have to go anywhere to go from i to i.
		      for (int i=0; i<path.length; i++)
		    		path[i][i] = i;
		    	
		       shortpath = shortestpath(m, path);
		       // Prints out shortest distances.
		       /**
		    	System.out.println ("shortest distance");
		    	for (int i=0; i<shortpath.length;i++) {
		      		for (int j=0; j<shortpath.length;j++)
		        		System.out.print(shortpath[i][j]+" ");
		      		System.out.println();
		    	}
		    	
		    	System.out.println ("path matrix");
		    	for (int i=0; i<path.length;i++) {
		      		for (int j=0; j<shortpath.length;j++)
		        		System.out.print(path[i][j]+" ");
		      		System.out.println();
		    	}
		    	**/
		    
		    	int user_want = Integer.valueOf(args[0]);
		    	int book_want = Integer.valueOf(args[1]);
		    	//System.out.println("user "+user_want+" want book "+book_want);
		    	int user_own = 10000;
		    	stmt = conn.createStatement();
	    		rs = stmt.executeQuery("select user_id from own_book where book_id = '"+book_want+"'");
	    		if(!rs.next()) {
	    			System.out.println("No people own this book");
	    			return;
	    		}
	    		rs.beforeFirst();
		    	
	    		while(rs.next()) {
	    			int temp = rs.getInt(1);
	    			if(temp==user_want){
	    				System.out.println("You already own this book");
	    				return;
	    			}
	    			if(user_own==10000){
	    				user_own=temp;
	    			}
	    			else {
	    				if(shortpath[temp-1][user_want-1]<shortpath[user_own-1][user_want-1])
	    					user_own=temp;
	    			}
	    		}
	    		//System.out.println("select User "+user_own);
	    		
	    		if(shortpath[user_own-1][user_want-1]>=10000){
	    			System.out.println("No Path");
	    			return;
	    		}
		    	else
		    	{
		    	//System.out.println("shortest loop found: "+(1+shortpath[user_own-1][user_want-1]));
		    	// The path will always end at end.		    	
		    	
		    	
		    	String myPath_forward = user_want + "->" +user_own;
		    	
		    	int temp_start = user_own-1;
		    	int temp_end = user_want-1;
		        String myPath_backward  = user_want + "";
		    
		    	while (path[temp_start][temp_end] != user_own-1) {
		    		myPath_backward = path[temp_start][temp_end]+1 + "->" + myPath_backward;
		    		temp_end = path[temp_start][temp_end];
		    	}
		    	
		    	String myPath = myPath_forward +"->"+ myPath_backward;
		    	
		    	//System.out.println("Here's the path "+myPath);
		    	
		    	String[] temp_result = myPath.split("->");
		    	String result="";
		    	result=temp_result[0]+"->"+book_want+","+temp_result[1];
		    		    	
		    	for(int i=2; i<temp_result.length; i++){
		    		result += "->";
		    		int prev = Integer.valueOf(temp_result[i-1]);
		    		int cur = Integer.valueOf(temp_result[i]);
		    		stmt = conn.createStatement();
		    		rs = stmt.executeQuery("select own_book.book_id from own_book join want_book on own_book.book_id=want_book.book_id where want_book.user_id = '"+prev+"' and own_book.user_id='"+cur+"'" );
		    		while(rs.next()){
		    			result = result+rs.getInt(1)+",";
		    		}
		    		result += cur;
		    	}
		    	System.out.println(result);
		    	long estimatedTime = System.nanoTime() - startTime;
				System.out.println("Took "+estimatedTime + " ns");
		    	

		    	}
		    	
		      

		      rs.close();
		      stmt.close();
		      conn.close();
		    } catch (Exception e) {
		      throw e;
		    }
  	}
}
