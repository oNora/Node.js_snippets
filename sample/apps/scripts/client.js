var clientjs;
(function (clientjs, $) {

	function nextQuestion(){
		if($( "input:checked" ).length){
			$.post('/nextQuestion', $('form').serialize()).done(function(data, error){
				console.log('data');
				console.log(data);
				console.log(error);
				console.log('error');
			});
		}
	}

	clientjs.nextQuestion = nextQuestion
})(clientjs || (clientjs = {}),$);