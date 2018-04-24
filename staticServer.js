var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime-types');
const WSServer = require('ws').Server;

function _404(res){
	res.writeHead(404, {'Content-type': 'text/plain'});
	res.write('404');
	res.end();
}
function sendFile(res, filePath, fileContents){
	res.writeHead(200, {
		'Content-type': mime.lookup(path.basename(filePath))
	});
	res.end(fileContents);
}
function serverStatic(res, absPath){
	fs.exists(absPath, function (exists){
		if(exists){
			fs.readFile(absPath, function (err, data){
				if(err){
					_404(res);
					return;
				}
				sendFile(res, absPath, data);
			});
		} else {
			_404(res);
		}
	});
}
var server = http.createServer(function (req, res){
	var filePath = '';
	var path = req.url.replace(/\?.*$/, '');
	
	if(/^static\//.test(path)){
		filePath = '/' + path;
	} else {
		filePath = '/index.html';
	}
	var absPath = './' + filePath;
	serverStatic(res, absPath);
});

const wsServer = new WSServer({
	server: server
});

wsServer.on('connection', ws => {
	initWs(ws);
	setTimeout(() => {
		ws.send('connected!');
	}, 3000);
});

const initWs = ws => {
	ws.on('message', msg => {
		console.log(`received: ${msg}`);
	});
}

server.listen(8888, function (){
	console.log('server start: 8888');
});

