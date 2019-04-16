var http = require('http');
var fs = require('fs');
var path = require('path');
var tls = require('tls');
var documentoBinarioAssinado = '';
var documentoBinario = '';

http.createServer(function (request, response) {
    console.log('Requisitando início do servidor node...');

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
//console.log('(4000-NODE) Servidor rodando em http://127.0.0.1:4000/');


function byteToHexString(uint8arr) {
  if (!uint8arr) {
    return '';
  }
  
  var hexStr = '';
  for (var i = 0; i < uint8arr.length; i++) {
    var hex = (uint8arr[i] & 0xff).toString(16);
    hex = (hex.length === 1) ? '0' + hex : hex;
    hexStr += hex;
  }
  
  return hexStr.toUpperCase();
}

//Criação do WebSocket para comunicação com o cliente Browser
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 4001})

    wss.on('connection', function (ws) {
      ws.on('message', function (message) {

            //Momento em que recebeu binário do Browser

            //console.log('(4001-WEBSOCKET) Mensagem recebida do cliente: ' + message);
        
            documentoBinario = message;

            // Informações sobre a comunicação com o TLS

            const options = {
                ca: [ fs.readFileSync('certhsm.pem') ],
                key: fs.readFileSync('keykmip.pem'),
                cert: fs.readFileSync('certkmip.pem'),
                host: '192.168.105.9',
                port: '5696',
                rejectUnauthorized:false,
                secureProtocol: 'TLSv1_2_method',
                checkServerIdentity: () => { return null; }
            };

            //Criação do TLS para conexão com o HSM

            var socket = tls.connect(options, () => {
                //console.log('(5696-SOCKET) Conexão ao HSM: ', socket.authorized ? 'authorized' : 'unauthorized');
            });
                
            if (documentoBinario !== '') {
                //console.log('(5696-SOCKET) Tem hash documento para enviar pro HSM!');
                //console.log(documentoBinario);
                socket.write(documentoBinario);
            }
                
            socket.on('data', (data) => {
                documentoBinarioAssinado = data;
                //console.log('(5696-SOCKET) Assinatura realizada recebida: ' + byteToHexString(documentoBinarioAssinado));

                //Enviando documento em binário assinado para o cliente tratar              
                ws.send(byteToHexString(documentoBinarioAssinado));

            });
        })
    })

