var http = require('http');
var fs = require('fs');
var path = require('path');
var tls = require('tls');

// SOCKET STREAM
// var ss = require('socket.io-stream');
// var io = require('socket.io-client');
// var socket = io.connect('192.168.105.9:5696');
// var stream = ss.createStream();
//

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
console.log('(4000-NODE) Servidor rodando em http://127.0.0.1:4000/');


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
                ca: fs.readFileSync('certhsm.pem'),
                key: fs.readFileSync('keykmip.pem'),
                cert: fs.readFileSync('certkmip.pem'),
                host: '192.168.105.9',
                port: 5696,
                rejectUnathorized: true,
                //Error [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames: IP: 192.168.105.9 is not in the cert's list:
                // If not false the server will reject any connection which is not 
                // authorized with the list of supplied CAs. This option only has an effect if requestCert is true. 
                requestCert: true,
                checkServerIdentity: () => { return null; }
            };

            // //Criação do TLS para conexão com o HSM

            var socket = tls.connect(options, () => {
                console.log('(5696-SOCKET) Conexão ao HSM: ', socket.authorized ? 'authorized' : 'unauthorized');
                process.stdin.pipe(socket);
                process.stdin.resume();
            });

            socket.setEncoding('utf8');
                
            if (documentoBinario !== '') {
                console.log('(5696-SOCKET) Tem hash documento para enviar pro HSM!');
                //console.log('Documento enviado ao HSM: '+documentoBinario+'\n');

                //ss(socket).emit('sign', stream, documentoBinario);
                console.log('Enviando uma assinatura!')
                console.log('Assinatura do cliente: ' + documentoBinario)
                console.log('Assinatura do cliente enviada: ' + Buffer.from(documentoBinario, 'hex'))
                const buf2 = Buffer.from(documentoBinario, 'hex');
                socket.write(buf2+'\n');
            }
                
            socket.on('data', (data) => {
                documentoBinarioAssinado = data;
                console.log('Recebeu uma assinatura!')
                console.log('Assinatura: ' + byteToHexString(documentoBinarioAssinado))
                //console.log('(5696-SOCKET) Assinatura realizada recebida: ' + documentoBinarioAssinado);

                //Enviando documento em binário assinado para o cliente tratar              
                ws.send(byteToHexString(documentoBinarioAssinado));

            });
        })
    })

