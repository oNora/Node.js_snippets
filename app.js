var fs = require("fs");
fs.readFile('phone_summary.txt', 'utf8', function(error, data) {
	var array = data.toString().split('\n'),
		arrLength = array.length,
		startHtml = '<!DOCTYPE html><html><head><title>node.js demo</title>'
					+ '<meta http-equiv="content-type" content="text/html; charset=utf-8" />'
					+ '<link href="demo.css" rel="stylesheet"/></head><body>',
		allTable = '<div><table>'
					+ '<tr><th>Company</th><th>Model</th><th>weight</th></tr>',
		closeTable = '</table></div>',
		closeHtml = '</body></html>',
		allHtml;

	for (var i = 0; i < arrLength; i++) {
		var currentRow = array[i].split('|');
		var tableRow ='<tr><td>' + currentRow[0] + ' <br />(<a href="'+ currentRow[1] + '">'+ currentRow[1] + '</a>)</td>'
						+ '<td>' + currentRow[2] + '</td>'
						+ '<td>' + currentRow[3] + '</td></tr>';
		allTable += tableRow;
	}
	allTable += closeTable;
	allHtml = startHtml + allTable + closeHtml;
	fs.writeFile('demo.html', allHtml, function (err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
});
