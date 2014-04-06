var fs = require("fs");
fs.readFile('phone_summary.txt', 'utf8', function(error, data) {
	var array = data.toString().split('\n'),
		arrLength = array.length,
		startHtml = '<!DOCTYPE html>\n<html>\n<head>\n<title>node.js demo</title>\n'
					+ '<meta http-equiv="content-type" content="text/html; charset=utf-8" />\n'
					+ '<link href="demo.css" rel="stylesheet"/></head>\n<body>\n',
		allTable = '<div><table>\n'
					+ '<tr><th>Company</th><th>Model</th><th>weight</th></tr>\n',
		closeTable = '</table></div>\n',
		closeHtml = '</body>\n</html>',
		allHtml;

	for (var i = 0; i < arrLength; i++) {
		var currentRow = array[i].split('|');
		var tableRow ='<tr><td>' + currentRow[0] + ' \n(<a href="'+ currentRow[1] + '">'+ currentRow[1] + '</a>)</td>\n'
						+ '<td>' + currentRow[2] + '</td>\n'
						+ '<td>' + currentRow[3] + '</td></tr>\n';
		allTable += tableRow;
	}
	allTable += closeTable;
	allHtml = startHtml + allTable + closeHtml;
	fs.writeFile('demo.html', allHtml, function (err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
});
