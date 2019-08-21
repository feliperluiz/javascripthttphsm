var hashDocumentoAssinado = '';
var hashDocumento = '';
var ws = '';

function Auth () { 
  ws = new WebSocket('ws://localhost:4001'); 
  ws.onopen = function () {
      ws.send(true)
      ws.onmessage = function(dado) {
        console.log('Token: ' + dado.data);
        alert('Token gerado no HSM: ' + dado.data);
      };
  };
}

function GenerateRandom () { 
    ws = new WebSocket('ws://localhost:4001');
    ws.onopen = function () {
      ws.send(16) //16 bytes aleatórios gerados
      ws.onmessage = function(dado) {
        console.log('Número aleatório: ' + dado.data);
        alert('Número aleatório gerado no HSM: ' + dado.data);
      };
    };
}




