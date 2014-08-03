var express = require('express'),
	http = require('http'),
	bodyParser = require('body-parser');

var	 app = express();
	router = express.Router();

app.set('port', process.env.POTR || 3000);
app.set('views', __dirname + "/views");
app.set("view engine", "jade");
app.use(bodyParser.urlencoded({
	extended: true
}));


app.use(express.static(__dirname + '/publice'));

// regualr error message
// function error(req, res) {
// 	res.send(404, 'four - oh- four');
// };
// router.use(function (req, res) {
// 	res.send(404, 'four - oh- four');
// });
//specific error message
app.use(function(err, req, res, next){
	res.status(err.status || 404);
	res.send(err.message);
});

app.get('/', function(req, res) {
	// res.render('index');
	res.send('raboti');
});

// app.get('/name', function(req, res) {
// 	res.clearCookie('name').send(req.cookies.name);
// });

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
// 		var err = new Error ('User does not exist');
// 		err.status = 'user-error';
// 		next(err);
// 	} else {
// 		res.send(req.params.username + "'s profile");
// 	}
// });


// second way to do the same thing
app.param('username', function (req, res, next, username){
	if(username !== "andrew"){
		req.user = username;
		next();
	} else {
		next(new Error('no user found'));
	}
});

app.get('/users/:username', function(req, res, next) {
	console.log('get - mona prez nego');
	res.send(req.user + "'s profile");
});

app.get('*', function(req, res){
  res.send('what???', 404);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});