var http = require('http'),
url = require("url"),
path = require("path"),
fs = require("fs"),
qs = require('querystring'),
sphero = require("sphero");
var bb8 = null;
var bb8conn = false;
var update = true;
var setHeading = null;
var lastHeading = null;

//Lets define a port we want to listen to
const PORT=8080;

//We need a function which handles requests and send response

//Create a server

function connect(){
	console.log('Connecting');
	bb8 = sphero("f6115d5e33ea4eb8b0c0aa9c30e31269");
	bb8.connect(function() {
		console.log('Connection alive');
		bb8conn = true;
		bb8.color('green');
	});
}

//connect();

var server = http.createServer(handleRequest);

	server.listen(PORT, function(){
		//Callback triggered when server is successfully listening. Hurray!
		console.log("Server listening on: http://localhost:%s", PORT);
	});

	function commandSent(){
		update = true;
	}

	function handleRequest(request, response){

	   if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {

            var post = JSON.parse(body);
            if(typeof post['connect'] !='undefined'){
              connect();
            } else if (typeof post['disconnect'] !='undefined'){
              bb8.disconnect(function() {
                console.log('Disconnected');
                bb8conn = false;
				      });
            } else if (bb8conn && update && typeof post['roll'] !='undefined') {
                var args = [];
                if(setHeading) {
                  clearTimeout(setHeading);
                }
                args = args.concat(post['roll']);
                args = args.concat([commandSent]);
                bb8['roll'].apply(bb8,args);
                /*if(post['roll'][0] < 1) {
                  setHeading = setTimeout(function () {
                    bb8.roll(1, 0, 2, function () {
                      bb8.setHeading(0, function () {
                        bb8.roll(0, 0, 1);
                      });
                    })
                  }, 1000);
                } else {
                  lastHeading = post['roll'][1];
                }*/
                update = false;
            } else if (bb8conn && update) {
              for(key in post){
                var args = [];
                args = args.concat(post[key]);
                args = args.concat([commandSent]);
                bb8[key].apply(bb8,args);
                update = false;
              }
            }
        });

		response.end();
    } else if (request.method == 'GET') {
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
