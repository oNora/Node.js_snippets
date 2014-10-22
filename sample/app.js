var express = require('express'),
	http = require('http'),
	bodyParser = require('body-parser');
	// var path = require('path');

var	app = express(),
	router = express.Router();

app.set('port', process.env.POTR || 3000);
app.use(bodyParser.urlencoded({
	extended: true
}));
//db simulation
var q1Text = {
	question: 'Which word doesn\'t fit?',
	questionNumber: '1',
	a: 'Seeing',
	b: 'Hearing',
	c:'Television'
};
var q2Text = {
	question: 'Coffee is to cup, what cake is to...',
	questionNumber: '2',
	a: 'fork',
	b: 'napkin',
	c:'plate'
};
var q3Text = {
	question: 'Which word doesn\'t fit?',
	questionNumber: '3',
	a: 'pear',
	b: 'apple',
	c:'stone'
};

var correctAnswer = {
	q1: 'television',
	q2: 'fork',
	q3: 'stone'
}
var saveAnswers = {
	q1: '',
	q2: '',
	q3: ''
};

function loadQuestions(req, res){
	res.send(q1Text);
};

function nextQuestion(req, res){

	var body = req.body;
	var questionNumber = body.q_number;
	var qNumber = parseInt(questionNumber,10);
	var questionVersion = 'q'+qNumber;

	saveAnswers[questionVersion] = body[questionVersion];

	qNumber++;
	// console.log('qNumber');
	// console.log(qNumber);

	switch(qNumber) {
    case 2:
        res.send(q2Text);
        break;
    case 3:
        res.send(q3Text);
        break;
    case 4:
        res.send('no more questions');
        break;
	}
}

function seeAnswers(req, res) {
	console.log('saveAnswers in seeAnswers');
	console.log(saveAnswers);
	var results = {
		q1Answers: saveAnswers.q1,
		q1Currect: correctAnswer.q1,
		q2Answers: saveAnswers.q2,
		q2Currect: correctAnswer.q2,
		q3Answers: saveAnswers.q3,
		q3Currect: correctAnswer.q3
	}

	res.send(results);
}

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/apps/veiws/index.html");
});

// app.get(["/404.html", '/404'],function(req, res) {
app.get(["/404", '/404.html'], function(req, res) {
	res.sendFile(__dirname + "/apps/veiws/404.html");
});

app.get('/loadQuestions', loadQuestions);
app.post('/nextQuestion', nextQuestion);
app.post('/seeAnswers', seeAnswers);

// for static files in html
app.use(/^(.+)$/, function(req, res){
	res.sendFile( __dirname + req.params[0]);
});
//send error if try to get no existing url
app.use(function(err, req, res, next) {
	// res.status(404).send('four-oh-four');
	res.redirect('/404');
});
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});