var clientjs;
(function (clientjs, $) {

	var questionsTemplate = $('#questionsTemplate').html();
	var tmpQuestions = Handlebars.compile(questionsTemplate);

	var resultsTemplate = $('#resultsTemplate').html();
	var tmpResults = Handlebars.compile(resultsTemplate);

	function showErrorMsg() {
		$('.erorMsgBox').show();
		$('.overlay').show();
	}

	function loadQuestions(){
		$.get('/loadQuestions').success(function (data, error) {

			if (error == 'success') {
				data.numberQ = 'q'+data.questionNumber;
				$('form').html(tmpQuestions(data));
			} else {
				showErrorMsg();
			}
		});
	}

	function nextQuestion(){
		if($( "input:checked" ).length){
			$.post('/nextQuestion', $('form').serialize()).done(
				function(data, error){
					if (error == 'success') {
						updateHtml(data);
					} else {
						showErrorMsg();
					}
				}
			);
		}
	}

	function updateHtml (dataHtml){
		$('input[type="radio"]').attr('checked',false);

		if(dataHtml != 'no more questions'){

			dataHtml.numberQ = 'q'+dataHtml.questionNumber;
			$('form').html(tmpQuestions(dataHtml));

		}else{
			$('form').hide();
			$('h3').hide();
			$('.noMoreQuestions').show();
		}
	}

	function seeAnswers() {

		$.get('/seeAnswers').done(function(data, error){

			if (error == 'success') {

				var content = {
					items: [
						{
							questtuon_text: "Questiuon 1",
							given_answers: data.q1Answers,
							right_answers: data.q1Currect
						},
						{
							questtuon_text: "Questiuon 2",
							given_answers: data.q2Answers,
							right_answers: data.q2Currect
						},
						{
							questtuon_text: "Questiuon 3",
							given_answers: data.q3Answers,
							right_answers: data.q3Currect
						}
					]
				};

				Handlebars.registerHelper( "checkStatus", function (items){
					if (this.given_answers == this.right_answers){
						return 'currect';
					}
					else{
						return 'wrong';
					}
				});

				$('.tableWrap').html(tmpResults(content));
				$('.noMoreQuestions').hide();

			} else {
				showErrorMsg();
			}
		});
	}

	loadQuestions();

	clientjs.nextQuestion = nextQuestion;
	clientjs.seeAnswers = seeAnswers;
})(clientjs || (clientjs = {}),$);