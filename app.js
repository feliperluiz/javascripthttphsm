var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const ioclient = require('socket.io-client');


server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

console.log('test');
ioclient('wss://192.168.105.9:5696', { 
      path: '/kmip',
      key: './keykmip.pem',
      cert: './certkmip.pem',
      ca: './certificado_hsm.pem',
      transports:  ['websocket'],
      rejectUnauthorized: false
   });