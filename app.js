var http = require('http');
var fs = require('fs');
var path = require('path');
var https = require('https')
const dado = JSON.stringify({
  'len': '16'
})

var documentoBinario = '';

http.createServer(function (request, response) {
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }


fs.readFile(filePath, function(error, content) {
    if (error) {
        if(error.code == 'ENOENT'){
            fs.readFile('./404.html', function(error, content) {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            });
        } else {
            response.writeHead(500);
            response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            response.end(); 
        }
    } else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
    }
});

}).listen(4000);
console.log('(4000-NODE) Servidor rodando em http://127.0.0.1:4000/');


//Criação do WebSocket para comunicação com o cliente Browser
var WebSocketServer = require('ws').Server, 
    wss = new WebSocketServer({port: 4001})
    
    wss.on('connection', function (ws) {
      ws.on('message', function (message) {        
            documentoBinario = message;
      });
    })

var options = { 
    hostname: 'hsmlab64.dinamonetworks.com',
    method: 'POST',
    port: 443,
    path: '/api/gen_rand',
    passphrase: '12345678',
    key: fs.readFileSync('./certsjson/lab.pri'), 
    cert: fs.readFileSync('./certsjson/lab.cer'), 
    ca: fs.readFileSync('./certsjson/hsm.cer'), 
    checkServerIdentity: () => { return null; },
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': dado.length
    }
}; 

var req = https.request(options, function(res) { 
    res.on('data', function(data) { 
        console.log('passou aqui' + data)
        process.stdout.write(data); 
    }); 
}); 

req.on('error', (e) => {
  console.error('Erro:' + e);
});

req.write(dado);
req.end();

