var express = require('express'),
	http = require('http'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	// session = require('cookie-session');
	session = require('express-session');

var	 app = express();


app.set('port', process.env.POTR || 3000);
app.set('views', __dirname + "/views");
app.set("view enginew", "jade");

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride());
app.use(cookieParser());
// app.use(express.session({secret: "This is a secret"}));
app.use(session({
  secret: "This is a secret",
  secureProxy: true // if you do SSL outside of node
}));

// to set a session hit http://localhost:3000/name/sessionname
// click on 'Go here' -  see the session
app.get('/name/:name', function(req, res) {
	req.session.name = req.params.name;
	res.send('<p>To see the session in action, <a href="/name">Go here</a></p>');
});

// see the session
app.get('/name', function(req, res) {
	res.send(req.session.name);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
