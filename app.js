const https = require('https');
const io = require('socket.io')(http);
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const server = https.createServer((req, res) => {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

io.on('connection', function(socket) {
    socket.on('message', function(data){
        
    	//tratar dado recebido da assinatura
        console.log("recieved data:");
        console.log(data);

        // var bufArr = new ArrayBuffer(4);
        // var bufView = new Uint8Array(bufArr);
        // bufView[0]=6;
        // bufView[1]=7;
        // bufView[2]=8;
        // bufView[3]=9;
        // socket.emit('message',bufArr);
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
