var express = require('express'),
	http = require('http'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser');

var	 app = express();


app.set('port', process.env.POTR || 3000);
app.set('views', __dirname + "/views");
app.set("view enginew", "jade");

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride());
app.use(cookieParser());

// hit http://localhost:3000/name/cookieName - set cookie
// and after click 'Go here' on the page you will see cookie name
app.get('/name/:name', function(req, res) {
	res.cookie('name', req.params.name).send('<p>To see the cookie in action, <a href="/name">Go here</a></p>')
});

// hit http://localhost:3000/name/cookieName - delete cookie
app.get('/name', function(req, res) {
	res.clearCookie('name').send(req.cookies.name);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});