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

					$('.tableWrap').html(tmpResults(data));

					$('.yourAnswers_1').addClass(
						data.q1Answers == data.q1Currect? "currect":"wrong"
					);
					$('.yourAnswers_2').addClass(
						data.q2Answers == data.q2Currect? "currect":"wrong"
					);
					$('.yourAnswers_3').addClass(
						data.q3Answers == data.q3Currect? "currect":"wrong"
					);

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