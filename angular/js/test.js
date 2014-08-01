var sys = require("sys");
myhttp = require("http");

myhttp.createServer(function(request, response) {
	sys.puts("Hi");
	response.writeHeader(200, {"Content-Type": "text/plain"});
	response.write("Hello World");
	response.end();
}).listen(8080);

sys.puts("Server running on 8080");


