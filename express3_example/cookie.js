var express = require('express'),
	http = require('http');

var	 app = express();

app.configure(function() {
	app.set('port', process.env.POTR || 3000);
	app.set('views', __dirname + "/views");
	app.set("view engine", "jade");
	
	app.use(express.cookieParser());
	app.use(app.router);
	app.use(express.static(__dirname + '/publice'));

});

// to set cookiename hit http://localhost:3000/name/cookiename
// when click on 'Go here' - unset cookie and see the cookiename
app.get('/name/:name', function(req, res) {
	res.cookie('name', req.params.name).send('<p>To see the cookie in action, <a href="/name">Go here</a></p>')
});


//unset cookie and see the cookiename
app.get('/name', function(req, res) {
	res.clearCookie('name').send("cookies name: " + req.cookies.name);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
