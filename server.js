var http = require('http');
var url = require("url");
var path = require("path");
var fs = require("fs");
var ws = require("nodejs-websocket");
var robotControl = require('./bb8_control');

const WSPORT=9001;
const WSHOST="127.0.0.1";

ws.createServer(function (conn) {
  console.log('WEB Client connected');

  conn.on("text", function (str) {
    var jsonData = JSON.parse(str);
    robotControl.postCommand(jsonData['command'],jsonData['arguments']);
  });

  conn.on("close", function (code, reason) {
    console.log('WEB Client disconnected');
  });

  conn.on("error", function (code, reason) {
    console.log('Player ' + conn.clientID + ' disconnected');
  });

}).listen(WSPORT,WSHOST);


const PORT=8080;

var server = http.createServer(handleRequest);

	server.listen(PORT, function(){
		//Callback triggered when server is successfully listening. Hurray!
		console.log("Server listening on: http://localhost:%s", PORT);
	});

	function commandSent(){
		update = true;
	}

	function handleRequest(request, response){

    if (request.method == 'GET') {
       var uri = url.parse(request.url).pathname
         , filename = path.join(process.cwd() + "/bb8_control/Webapp/app/", uri);

       var contentTypesByExtension = {
         '.html': "text/html",
         '.css':  "text/css",
         '.js':   "text/javascript"
       };

       fs.exists(filename, function(exists) {
         if(!exists) {
           response.writeHead(404, {"Content-Type": "text/plain"});
           response.write("404 Not Found\n");
           response.end();
           return;
         }

         if (fs.statSync(filename).isDirectory()) filename += '/index.html';

         fs.readFile(filename, "binary", function(err, file) {
           if(err) {
             response.writeHead(500, {"Content-Type": "text/plain"});
             response.write(err + "\n");
             response.end();
             return;
           }

           var headers = {};
           var contentType = contentTypesByExtension[path.extname(filename)];
           if (contentType) headers["Content-Type"] = contentType;
           response.writeHead(200, headers);
           response.write(file, "binary");
           response.end();
         });
       });
     }
}



// Send the buffer back to the sound card
