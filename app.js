var http = require('http');
var fs = require('fs');
var path = require('path');
var https = require('https')
//var dadoStr = '{"usr": "master","pwd": "12345678"}'
var dadoStr = '{"len": 16}'
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
    hostname: 'hsmlab63.dinamonetworks.com',
    method: 'POST',
    port: 443,
    path: '/api/gen_rand',
    passphrase: '12345678',
    key: fs.readFileSync('./certsjson/lab.pri'), 
    cert: fs.readFileSync('./certsjson/lab.cer'), 
    ca: fs.readFileSync('./certsjson/hsm.cer'), 
    rejectUnauthorized: false,
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': dadoStr.length,
        'Authorization': 'HSM EA90DCD52172616D33F8D4A1DABFAE70B158F8431DBCC880FF5D8B327503E816'
    }
}; 

var req = https.request(options, function(res) { 
    res.on('data', function(data) { 
        process.stdout.write(data); 
    }); 
}); 

req.on('error', (e) => {
  console.error('Erro:' + e);
});

req.write(dadoStr);
req.end();

//{ "token":  "48D50D8E79ABBEFC5F711B4B517046B29E4F7D52229E1587DB570752E13A081A" , "cid": 935639491, "pwd_expired": 0}
// { "rnd": "D98A09FFF997DB8197EFB67CDC23E142"}