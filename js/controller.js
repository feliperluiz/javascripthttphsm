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

  //s_server -accept 5696 -cert cert.pem -key key.pem -verify 10 -CAfile certkmip.pem
  //s_client -connect localhost:5696 -cert certkmip.pem -key keykmip.pem
  //1) CA do controller não está sendo usado como certificado de confiança (está confiando no navegador)
  //2) a biblioteca do socket IO deve ignorar a validação de common name (CN), está esperando que o CN do cert (que no caso pratico é o da dinamo), seja igual ao host onde estou me conectando

 
//criando TTLV de teste
var TTLVRequest = new KMIPTTLV (Tags.REQUEST_MESSAGE, Types.STRUCTURE, '', 0x000001e8);
// //Header Section
var TTLVHeader = new KMIPTTLV (Tags.REQUEST_HEADER, Types.STRUCTURE, '', 0x00000038);
var TTLVProtocol = new KMIPTTLV (Tags.PROTOCOL_VERSION, Types.STRUCTURE, '', 0x00000020);
var TTLVProtocolMajor = new KMIPTTLV (Tags.PROTOCOL_VERSION_MAJOR, Types.INTEGER, 0x00000001, 0x00000004);
var TTLVProtocolMinor = new KMIPTTLV (Tags.PROTOCOL_VERSION_MINOR, Types.INTEGER, 0x00000004, 0x00000004);
var TTLVMaximumResponse = new KMIPTTLV (Tags.MAXIMUM_RESPONSE_SIZE, Types.INTEGER, 0x00000100, 0x00000004);
var TTLVHeaderBatch = new KMIPTTLV (Tags.BATCH_COUNT, Types.INTEGER, 0x00000001, 0x00000004);
//Batch Items
var TTLVBatchItem = new KMIPTTLV (Tags.BATCH_ITEM, Types.STRUCTURE, '', 0x000001a0);
var TTLVItemOperation = new KMIPTTLV (Tags.OPERATION, Types.ENUMERATION, Operation.QUERY, 0x00000004);
var TTLVRequestPayload = new KMIPTTLV (Tags.REQUEST_PAYLOAD, Types.STRUCTURE, '', 0x00000188);
var TTLVQueryFunction = new KMIPTTLV (Tags.QUERY_FUNCTION, Types.ENUMERATION, QueryFunction.QUERY_PROFILES, 0x00000004);

// 420078 01 000001e8 '' //cada numero em hexadecimal vale 4 numeros em binari

// 420077 01 00000038 ''
// 420069 01 00000020 ''
// 42006a 02 00000004 00000001 00000000
// 42006b 02 00000004 00000004 00000000
// 420050 02 00000004 00000100 00000000
// 42000d 02 00000004 00000001 00000000

// 42000f 01 000001a0 ''
// 42005c 05 00000004 00000024 00000000
// 420079 01 00000188 ''
// 420074 05 00000004 00000010 00000000

  // console.log('Numero em hex: ' + n);
  // console.log('Numero em bin: ' + parseInt(n,16).toString(2));
  // var decimal = parseInt(hex, 16);
  // var binario = decimal.toString(2);

  function hex2bin(str) {
    for (var bytes = [], c = 0; c < str.length; c += 2)
    bytes.push(parseInt(str.substr(c, 2), 16));
    return bytes;
  }


console.log(TTLVRequest.getBlock()+TTLVHeader.getBlock()+TTLVProtocol.getBlock()+TTLVProtocolMajor.getBlock()+
TTLVProtocolMinor.getBlock()+TTLVMaximumResponse.getBlock()+TTLVHeaderBatch.getBlock()+TTLVBatchItem.getBlock()+
TTLVItemOperation.getBlock()+TTLVRequestPayload.getBlock()+TTLVQueryFunction.getBlock());

var bin1 = hex2bin(TTLVRequest.getBlock()+TTLVHeader.getBlock()+TTLVProtocol.getBlock()+TTLVProtocolMajor.getBlock()+
TTLVProtocolMinor.getBlock()+TTLVMaximumResponse.getBlock()+TTLVHeaderBatch.getBlock()+TTLVBatchItem.getBlock()+
TTLVItemOperation.getBlock()+TTLVRequestPayload.getBlock()+TTLVQueryFunction.getBlock());

console.log(bin1);

ws.onopen = function () {
  ws.send(bin1)
  console.log('Valor de assinatura enviado');
};

ws.onmessage = function(data) {
  var reader = new FileReader();
  reader.onload = function() {
      console.log(reader.result);
  }
  console.log('Documento em binário assinado: ' + reader.readAsText(data.data));
};


/*if (client.status == 200)
    alert("A assinatura foi bem sucedida!\n\nThe response representation was:\n\n" + client.responseText)
else
    alert("Falha na assinatura!\n\nThe response status was: " + client.status + " " + client.statusText + ".");
*/
}