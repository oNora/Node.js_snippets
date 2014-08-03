var express = require('express'),
	http = require('http');

var	 app = express();

app.configure(function() {
	app.set('port', process.env.POTR || 3000);
	app.set('views', __dirname + "/views");
	app.set("view engine", "jade");

	app.use(app.router);
	app.use(express.static(__dirname + '/publice'));

	//regualr error message
	app.use(function (req, res) {
		res.send(404, 'four - oh- four');
	});

	//specific error message
	app.use(function(err, req, res, next){
		console.log("err.status");
		console.log(err.status);
		console.log("err.massage");
		console.log(err.message);
		res.status(err.status || 404);
		res.send(err.message);
	});
});

app.get('/', function (req, res) {
	res.send('index');
});


//regualr error message
// app.get('/users/:username', function(req, res, next) {
// 	if(req.params.username === "andrew") {
// 		next();
// 	} else {
// 		res.send(req.params.username + "'s profile");
// 	}
// });


//specific error message
// app.get('/users/:username', function(req, res, next) {
// 	if(req.params.username === "andrew") {
// 		var err = new Error('User does not exist');
// 		err.status = 'user-error';
// 		// err.massage = 'User does not exist';
// 		next(err);
// 	} else {
// 		res.send(req.params.username + "'s profile");
// 	}
// });


//second way to do the same thing
app.param('username', function (req, res, next, username){
	if(username !== "andrew"){
		req.user = username;
		next();
	} else {
		next(new Error('no user found'));
	}
});

app.get('/users/:username', function(req, res, next) {
	res.send(req.user + "'s profile");
});


http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});