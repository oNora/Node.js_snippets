var clientjs;
(function (clientjs, $) {

	function nextQuestion(){
		if($( "input:checked" ).length){
			$.post('/nextQuestion', $('form').serialize()).done(function(data, error){
				console.log('data');
				console.log(data);
				console.log('error');
				console.log(error);

				if (error == 'success'){
					// $('input[name=q1]').attr('checked',false);
					var numberQ = 'q'+data.questionNumber;

					$('ul').html('<li>'+data.a+'</li><li>'+data.b+'</li><li>'+data.c+'</li>');
					$('h3').html(data.question);
					$('input[type="radio"]').attr('name', numberQ);
					$('input[type="hidden"]').val(data.questionNumber);

				}
			});
		}
	}

	clientjs.nextQuestion = nextQuestion
})(clientjs || (clientjs = {}),$);