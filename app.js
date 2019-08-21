var http = require('http');
var fs = require('fs');
var path = require('path');
var https = require('https')
var respostaWeb = '';
var authToken = '';

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
            var pathValue = ''
            var dadoStr = ''
            var headersObject = ''
            
            if (parseInt(message)) {
                pathValue = '/api/gen_rand'
                dadoStr = '{"len": '+message+'}'
                headersObject = {
                    'Content-Type': 'application/json',
                    'Content-Length': dadoStr.length,
                    'Authorization': 'HSM' + authToken
                }
            } else {
                pathValue = '/api/auth'
                dadoStr = '{"usr": "master","pwd": "12345678"}'
                headersObject = {
                    'Content-Type': 'application/json',
                    'Content-Length': dadoStr.length
                }
            }
    
            var options = { 
                hostname: 'hsmlab64.dinamonetworks.com',
                method: 'POST',
                port: 443,
                path: pathValue,
                passphrase: '12345678',
                key: fs.readFileSync('./certsjson/lab.pri'), 
                cert: fs.readFileSync('./certsjson/lab.cer'), 
                ca: fs.readFileSync('./certsjson/hsm.cer'), 
                rejectUnauthorized: false,
                headers: headersObject
            }; 

            var req = https.request(options, function(res) { 
                res.on('data', function(data) { 
                    var resposta = JSON.parse(data)
                    if (resposta.token !== undefined) {
                        authToken = resposta.token
                        respostaWeb = authToken
                        console.log('Passou na resposta do token: ' + respostaWeb)
                    } else {
                        console.log(resposta)
                        respostaWeb = resposta.rnd
                        console.log('Resposta do numero aleatorio: ' + respostaWeb)                     
                    }
                    ws.send(respostaWeb);
                }); 

                req.on('error', (e) => {
                    console.error('Erro:' + e);
                });
            }); 
            req.write(dadoStr);
            req.end();
        });

        
    })






//{ "token":  "48D50D8E79ABBEFC5F711B4B517046B29E4F7D52229E1587DB570752E13A081A" , "cid": 935639491, "pwd_expired": 0}
// { "rnd": "D98A09FFF997DB8197EFB67CDC23E142"}