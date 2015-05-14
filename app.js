
/**
 * Module dependencies.
 */

var express = require('express')
  , operate = require('./routes/operate')
  , http = require('http')
  , path = require('path')

var app = express();

// all environments
app.set('ip', process.env.OPENSHIFT_NODEJS_IP);
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({ secret: 'xDDFsdfddsdfSDdbg', cookie: { maxAge: null }}));	

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req,res){
	res.render('login');

});
app.get('/index', function(req,res){
	res.render('index');

});

app.get('/signin', operate.signin);

app.get('/loadProfile', operate.loadProfile);

app.get('/getOwnOrWantBooks', operate.getOwnOrWantBooks);

app.get('/getDbBooks',operate.getDbBooks);

app.post('/createOwnOrWantBook',operate.createOwnOrWantBook);

app.post('/editOwnOrWantBook',operate.editOwnOrWantBook);

app.post('/deleteOwnOrWantBook',operate.deleteOwnOrWantBook);
//app.post('/signup', home.afterSignUp);

app.get('/match',operate.match);

app.post('/signup',operate.signup);

app.post('/logout',operate.logout);




http.createServer(app).listen(app.get('port'), app.get('ip'),function(){
  console.log('Express server listening on port ' + app.get('port'));
});

