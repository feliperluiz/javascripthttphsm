const https = require('https');
const hostname = '127.0.0.1';
const port = 3000;

https.createServer((req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// io.on('connection', function(socket) {
//     socket.on('message', function(data){
        
//     	//tratar dado recebido da assinatura
//         console.log("received data:");
//         console.log(data);

//         // var bufArr = new ArrayBuffer(4);
//         // var bufView = new Uint8Array(bufArr);
//         // bufView[0]=6;
//         // bufView[1]=7;
//         // bufView[2]=8;
//         // bufView[3]=9;
//         // socket.emit('message',bufArr);
//     });
// });
