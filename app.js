var http = require('http');
var fs = require('fs');
var path = require('path');
var tls = require('tls');
var hashDocumentoAssinado = '';
var hashDocumento = '';

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
console.log('Servidor rodando em http://127.0.0.1:4000/');

//Criando servidor WebTCP que será o Proxy para todas as requisições TCP dos clientes

var WebTCP = require('./webtcp/lib/server/webtcp.js').WebTCP

var serverTCP = new WebTCP();
serverTCP.listen(4002, "localhost");


//Criando socket interno para envio do hash da assinatura (partindo do cliente) e utilizando 

var net = require('net');
var server = net.createServer(function (socket) {
  socket.write("Enviando mensagem do socket interno para o cliente\r\n");
  socket.pipe(socket);
});

server.listen(4001, "localhost", function() {
  address = server.address();
  console.log("Aberto servidor para socket interno %j", address);
});

server.on('connection', function (stream) {
  console.log('Nova conexão de socket interno ' + stream.remoteAddress);
});

server.on('data', function (data) {
  hashDocumento = data;
  console.log('Dado recebido: ' + hashDocumento);
});

if (hashDocumentoAssinado !== '')
    socket.write(hashDocumentoAssinado);

/////////////////////////

const options = {
    ca: fs.readFileSync('certhsm.pem'),
    key: fs.readFileSync('keykmip.pem'),
    cert: fs.readFileSync('certkmip.pem'),
    host: '192.168.105.9',
    port: 5696,
    rejectUnauthorized:false,
    requestCert:true
};

const socket = tls.connect(options, () => {
    console.log('client connected', socket.authorized ? 'authorized' : 'unauthorized');
    process.stdin.pipe(socket);
    process.stdin.resume();
});

socket.setEncoding('utf8');
if (hashDocumento !== '')
    socket.write(hashDocumento);

socket.on('data', (data) => {
    hashDocumentoAssinado = data;
    console.log('Assinatura realizada recebida: ' + hashDocumentoAssinado);
});

socket.on('error', (error) => {
    console.log(error);
});

socket.on('end', (data) => {
    console.log('Socket end event');
});

