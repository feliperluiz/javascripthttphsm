var http = require('http');
var fs = require('fs');
var path = require('path');
var tls = require('tls');

// Instalação dos componentes para conexão com o Python
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request-promise');
var app = express();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

//Criação do WebSocket para comunicação com o cliente Browser
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 4001})

    wss.on('connection', function (ws) {
      ws.on('message', function (message) {
            documentoBinario = message;            
            console.log("Documento recebido do cliente para ser assinado: " + documentoBinario);

            var options = {
                method: 'POST',
                uri: 'http://localhost:5000/sign',
                body: documentoBinario
            };
            
            var returndata;
            var sendrequest = request(options)
            .then(function (parsedBody) {
                console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
                returndata = parsedBody; // do something with this data, here I'm assigning it to a variable.
            })
            .catch(function (err) {
                console.log(err);
            });

            //res.send(returndata);

        });
    })



    /*// Informações sobre a comunicação com o TLS
            
cd C:\Users\Felipe\Desktop\TCC\reporter\reporter
cd C:\Users\Felipe\Desktop\TCC\signaturekmip

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
                console.log('Assinatura: ' + documentoBinarioAssinado)
                //console.log('(5696-SOCKET) Assinatura realizada recebida: ' + documentoBinarioAssinado);

                //Enviando documento em binário assinado para o cliente tratar              
                ws.send(documentoBinarioAssinado);*/
