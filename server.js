var http = require('http');
var fs = require('fs');
var PORT = 8080;

http.createServer((req, res) => {
    fs.readFile('./' + req.url, (err, data) => {
        if (!err) {
            var dotoffset = req.url.lastIndexOf('.');
            var mimetype = dotoffset == -1 ? 'text/plaint' : {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'text/javascript',
                '.jpg': 'image/jpeg',
                '.png': 'image/png',
                '.ico': 'image/x-icon',
                '.gif': 'image/gif',
				'.xml': 'text/xml',
				'.ogg':'audio/ogg',
				'.mp3':'audio/mp3'
            }[ req.url.substr(dotoffset) ];
            res.setHeader('Content-Type', mimetype);
            res.end(data);
            console.log(req.url, mimetype);
        } else {
            console.log('File not fount: ' + req.url);
            res.writeHead(404, "Not Found");
            res.end();
        }
    });
 }).listen(PORT);
 console.log('listening on port ' + PORT + '...');
 
 /*

var fs = require('fs');
var http = require('http');

http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});

  var file = fs.createReadStream(__dirname + '/index.html');
  file.pipe(response);

}).listen(8080);

console.log('listening on port 8080...');
*/
/*
var fileServer = require('./fileServer');
var http = require('http');
http.createServer(function(req, res) {
   var file = __dirname + req.url;
   if(req.url === '/') {
       // serve index.html on root 
       file = __dirname + 'index.html'
   }
   // serve all other files echoed by index.html e.g. style.css
   // callback is optional
   fileServer(file, req, res, callback);

})
module.exports = function(file, req, res, callback) {
    var fs = require('fs')
        , ext = require('path').extname(file)
        , type = ''
        , fileExtensions = {
            'html':'text/html',
            'css':'text/css',
            'js':'text/javascript',
            'json':'application/json',
            'png':'image/png',
            'jpg':'image/jpg',
            'wav':'audio/wav'
        }
    console.log('req    '+req.url)
    for(var i in fileExtensions) {
       if(ext === i) {    
          type = fileExtensions[i]
          break
       }
    }
    fs.exists(file, function(exists) {
       if(exists) {
          res.writeHead(200, { 'Content-Type': type })
          fs.createReadStream(file).pipe(res)
          console.log('served  '+req.url)
          if(callback !== undefined) callback()
       } else {
          console.log(file,'file dne')
         }  
    })
}*/