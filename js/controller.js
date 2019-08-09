var hashDocumentoAssinado = '';
var hashDocumento = '';

function onChange(event) { 
    var logFile = $('#input_file').get(0).files[0];
    var readerFile = new FileReader();
    readerFile.readAsBinaryString(logFile);
    readerFile.onload = function(event){
        var arrayBuffer = event.target.result;
        hashDocumento = CryptoJS.SHA256(arrayBuffer).toString(CryptoJS.enc.Hex);
        console.log(hashDocumento);
             
    }
}

function Sign () {  
  var ws = new WebSocket('ws://localhost:4001');

ws.onopen = function () {
  var teste = "teste"
  ws.send(teste)
  console.log('Valor de assinatura enviado');
};

ws.onmessage = function(data) {
  hashDocumentoAssinado = data;
  console.log('Documento em binário assinado: ' + hashDocumentoAssinado.data);
};

}